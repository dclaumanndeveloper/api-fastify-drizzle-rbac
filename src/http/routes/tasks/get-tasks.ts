import { db } from '@/db/connection'
import { tasks } from '@/db/schema'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { getUserPermissions } from '@/permissions/get-user-permissions'
import { count, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../erros/unauthorized-error'

const schema = {
	summary: 'List tasks',
	security: [{ bearerAuth: [] }],
	tags: ['Tasks'],
	description: 'list users tasks ',
	operationId: 'getListOfTasks',
	querystring: z.object({
		limit: z
			.string()
			.default('10')
			.transform(Number)
			.refine((val) => val > 0, { message: 'Limit must be a positive number' }),
		page: z
			.string()
			.default('1')
			.transform(Number)
			.refine((val) => val > 0, { message: 'Page must be a positive number' }),
	}),
	response: {
		200: z.object({
			tasks: z.array(
				z.object({
					id: z.string(),
					title: z.string(),
					description: z.string().nullable(),
					status: z.enum(['pending', 'in progress', 'completed', 'canceled']),
					createdAt: z.date(),
					updatedAt: z.date().nullable(),
					assignedTo: z.string(),
				}),
			),
			total: z.number(),
		}),
		401: z.object({
			message: z.string(),
		}),
		422: z.object({
			errors: z.array(
				z.object({
					field: z.string(),
					message: z.string(),
				}),
			),
		}),
	},
}

export const getTasks = async (app: FastifyInstance) => {
	app
		.addHook('onRequest', authMiddleware)
		.withTypeProvider<ZodTypeProvider>()

		.get('/tasks', { schema }, async (request, reply) => {
			const { sub, role } = request.user

			const { can } = getUserPermissions(sub, role)

			const userCanGetTasks = can('read', 'task')

			if (!userCanGetTasks) {
				throw new UnauthorizedError('You can not access this recource')
			}

			const { limit, page } = request.query
			const offset = (page - 1) * limit

			const [tasksCount] = await db
				.select({
					count: count(),
				})
				.from(tasks)
				.where(eq(tasks.assignedTo, sub))

			const allTasks = await db
				.select()
				.from(tasks)
				.where(eq(tasks.assignedTo, sub))
				.offset(offset)
				.limit(limit)

			return reply
				.status(200)
				.send({ tasks: allTasks, total: tasksCount.count })
		})
}

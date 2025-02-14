import { db } from '@/db/connection'
import { tasks } from '@/db/schema'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { getUserPermissions } from '@/permissions/get-user-permissions'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../erros/unauthorized-error'

const schema = {
	summary: 'Create task',
	security: [{ bearerAuth: [] }],
	tags: ['Tasks'],
	description: 'Create new task',
	operationId: 'createNewTask',

	body: z.object({
		title: z.string().min(3, { message: 'New task must have a title' }),
		description: z.string().nullable(),
	}),
	response: {
		201: z.object({
			task: z.object({
				id: z.string(),
				title: z.string(),
				description: z.string().nullable(),
				status: z.enum(['pending', 'in progress', 'completed', 'canceled']),
				createdAt: z.date(),
				updatedAt: z.date().nullable(),
				assignedTo: z.string(),
			}),
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

export const createNewTask = async (app: FastifyInstance) => {
	app
		.addHook('onRequest', authMiddleware)
		.withTypeProvider<ZodTypeProvider>()
		.post('/tasks', { schema }, async (request, reply) => {
			const { sub, role } = request.user
			const { can } = getUserPermissions(sub, role)

			const userCanCreateTask = can('create', 'task')

			if (!userCanCreateTask) {
				throw new UnauthorizedError('You can not access this recource')
			}

			const { title, description } = request.body

			const task = await db
				.insert(tasks)
				.values({
					title,
					description,
					assignedTo: sub,
				})
				.returning()

			return reply.status(201).send({ task: task[0] })
		})
}

import { db } from '@/db/connection'
import { tasks } from '@/db/schema'
import { authMiddleware } from '@/http/middlewares/auth-middleware'
import { getUserPermissions } from '@/permissions/get-user-permissions'
import { and, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../erros/unauthorized-error'

const schema = {
	summary: 'Update task',
	security: [{ bearerAuth: [] }],
	tags: ['Tasks'],
	description: 'Update one tasks',
	operationId: 'updateTask',
	params: z.object({
		taskId: z
			.string()
			.min(3, { message: 'Task to be updated is not informaded' }),
	}),
	body: z.object({
		title: z.string().min(3, { message: 'Task must have a title' }),
		description: z.string().optional(),
		status: z.enum(['pending', 'in progress', 'completed', 'canceled']),
	}),
	response: {
		200: z.object({
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

export const updateTask = async (app: FastifyInstance) => {
	app
		.addHook('onRequest', authMiddleware)
		.withTypeProvider<ZodTypeProvider>()

		.put('/tasks/:taskId', { schema }, async (request, reply) => {
			const { sub, role } = request.user
			const { can } = getUserPermissions(sub, role)

			const userCanUpdateTasks = can('update', 'task')

			if (!userCanUpdateTasks) {
				throw new UnauthorizedError('You can not access this recource')
			}

			const { taskId } = request.params

			const { title, description, status } = request.body

			const task = await db
				.update(tasks)
				.set({
					title,
					description,
					status,
				})
				.where(and(eq(tasks.id, taskId), eq(tasks.assignedTo, sub)))
				.returning()

			return reply.status(200).send({ task: task[0] })
		})
}

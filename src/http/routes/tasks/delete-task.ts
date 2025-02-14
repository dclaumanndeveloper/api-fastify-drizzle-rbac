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
	summary: 'Delete task',
	security: [{ bearerAuth: [] }],
	tags: ['Tasks'],
	description: 'Delete task',
	operationId: 'deleteTask',
	params: z.object({
		taskId: z
			.string()
			.min(3, { message: 'Task to be deleted is not informaded' }),
	}),
	response: {
		204: z.any(),
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

export const deleteTask = async (app: FastifyInstance) => {
	app
		.addHook('onRequest', authMiddleware)
		.withTypeProvider<ZodTypeProvider>()

		.delete('/tasks/:taskId', { schema }, async (request, reply) => {
			const { sub, role } = request.user

			const { can } = getUserPermissions(sub, role)

			const userCanDeleteTask = can('delete', 'task')

			if (!userCanDeleteTask) {
				throw new UnauthorizedError('You can not access this recource')
			}

			const { taskId } = request.params

			await db
				.delete(tasks)
				.where(and(eq(tasks.id, taskId), eq(tasks.assignedTo, sub)))
			return reply.status(204).send()
		})
}

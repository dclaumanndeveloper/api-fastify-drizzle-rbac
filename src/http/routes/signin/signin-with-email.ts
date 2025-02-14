import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { comparePassword } from '@/lib/handle-password-hash'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { UnauthorizedError } from '../erros/unauthorized-error'

const schema = {
	summary: 'Signin with email',
	tags: ['authenticate'],
	description: 'Authenticate user with email',
	operationId: 'signinWithEmail',
	body: z.object({
		email: z.string().email({ message: 'Invalid email' }),
		password: z
			.string()
			.min(6, { message: 'Possword must have at least 6 characters' }),
	}),
	response: {
		200: z.object({
			token: z.string(),
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

export const signinWithEmail = async (app: FastifyInstance) => {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post('/signin/email', { schema }, async (request, reply) => {
			const { email, password } = request.body

			const user = await db.query.users.findFirst({
				where: eq(users.email, email),
			})

			if (!user) throw new UnauthorizedError('User not exist')

			const passwordMatches = await comparePassword(password, user.passwordHash)

			if (!passwordMatches)
				throw new UnauthorizedError('Invalid email or password')

			const userData = { sub: user.id, email: user.email, role: user.role }

			const token = await reply.jwtSign(userData, {
				sign: {
					expiresIn: '1week',
				},
			})

			return reply.status(200).send({ token })
		})
}

import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify/types/instance'
import supertest from 'supertest'
import { hashPassword } from './handle-password-hash'

export async function createAndSigninWithEmail(
	app: FastifyInstance,
	isAdmin = false,
) {
	const email = 'user@gmail.com'
	await db.transaction(async (tx) => {
		const existingUser = await tx
			.select()
			.from(users)
			.where(eq(users.email, email))

		if (existingUser.length > 0) {
			await tx
				.update(users)
				.set({
					name: 'John Doe',
					passwordHash: await hashPassword('123456'),
					role: isAdmin ? 'admin' : 'user',
				})
				.where(eq(users.email, email))
		} else {
			await tx.insert(users).values([
				{
					name: 'John Doe',
					email,
					passwordHash: await hashPassword('123456'),
					role: isAdmin ? 'admin' : 'user',
				},
			])
		}
	})

	const authResponse = await supertest(app.server).post('/signin/email').send({
		email,
		password: '123456',
	})

	const { token } = authResponse.body

	return {
		token,
		email,
	}
}

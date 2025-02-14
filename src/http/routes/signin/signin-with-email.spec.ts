import { app } from '@/app'
import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { hashPassword } from '@/lib/handle-password-hash'
import { eq } from 'drizzle-orm'

import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const email = 'user@gmail.com'

describe('Signin with email', () => {
	beforeAll(async () => {
		await app.ready()
		await db.transaction(async (tx) => {
			await tx.delete(users).where(eq(users.email, email))
			await tx.insert(users).values([
				{
					name: 'John Doe',
					email,
					passwordHash: await hashPassword('123456'),
				},
			])
		})
	})

	afterAll(() => {
		app.close()
	})

	it('should authenticate the user with valid email & password', async () => {
		const res = await supertest(app.server).post('/signin/email').send({
			email,
			password: '123456',
		})

		expect(res.status).toEqual(200)
	})

	it('should authenticate the user and return a token', async () => {
		const res = await supertest(app.server).post('/signin/email').send({
			email,
			password: '123456',
		})

		expect(res.body).toEqual({
			token: expect.any(String),
		})
	})

	it('should not authenticate with wrong email', async () => {
		const res = await supertest(app.server).post('/signin/email').send({
			email: 'wrong@gmail.com',
			password: '123456',
		})

		expect(res.status).toBe(401)
	})

	it('should not authenticate with wrong password', async () => {
		const res = await supertest(app.server).post('/signin/email').send({
			email,
			password: '123123',
		})

		expect(res.status).toBe(401)
	})

	it('should not authenticate without email & password', async () => {
		const res = await supertest(app.server).post('/signin/email').send({
			email: '',
			password: '',
		})
		expect(res.status).toEqual(422)
	})
})

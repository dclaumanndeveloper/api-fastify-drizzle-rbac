import { app } from '@/app'
import { createAndSigninWithEmail } from '@/lib/create-and-signin-with-email'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let token: string

describe('Create a new task', () => {
	beforeAll(async () => {
		await app.ready()
		const user = await createAndSigninWithEmail(app)
		token = user.token
	})

	afterAll(() => {
		app.close()
	})

	it('should create a new task', async () => {
		const res = await supertest(app.server)
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'New task',
				description: 'About the task',
			})
		expect(res.status).toEqual(201)
	})

	it('should create a new task without description', async () => {
		const res = await supertest(app.server)
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'New task',
				description: '',
			})
		expect(res.status).toEqual(201)
	})

	it('should not create a new task without a title', async () => {
		const res = await supertest(app.server)
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: '',
				description: '',
			})
		expect(res.status).toEqual(422)
	})

	it('should not create a new task without a user logged', async () => {
		const res = await supertest(app.server).post('/tasks').send({
			title: '',
			description: '',
		})

		expect(res.status).toEqual(401)
	})
})

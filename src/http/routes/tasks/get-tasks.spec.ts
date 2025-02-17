import { app } from '@/app'
import { createAndSigninWithEmail } from '@/lib/create-and-signin-with-email'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let token: string

describe('Get list of tasks', () => {
	beforeAll(async () => {
		await app.ready()
		const user = await createAndSigninWithEmail(app)
		token = user.token
	})

	afterAll(() => {
		app.close()
	})

	it('should get a list of tasks', async () => {
		await supertest(app.server)
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'New task',
				description: 'About the task',
			})

		const tasks = await supertest(app.server)
			.get('/tasks?limit=10&page=1')
			.set('Authorization', `Bearer ${token}`)
		expect(tasks.body.tasks).toBeTypeOf('object')
	})
})

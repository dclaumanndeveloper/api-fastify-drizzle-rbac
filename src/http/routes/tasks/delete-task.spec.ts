import { app } from '@/app'
import { createAndSigninWithEmail } from '@/lib/create-and-signin-with-email'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let token: string

describe('Delete a new task', () => {
	beforeAll(async () => {
		await app.ready()
		const user = await createAndSigninWithEmail(app)
		token = user.token
	})

	afterAll(() => {
		app.close()
	})

	it('should delete a task', async () => {
		await supertest(app.server)
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'New task',
				description: 'About the task',
			})

		const allTasks = await supertest(app.server)
			.get('/tasks?limite=10&page=1')
			.set('Authorization', `Bearer ${token}`)

		const taskId = allTasks.body.tasks[0].id

		const res = await supertest(app.server)
			.delete(`/tasks/${taskId}`)
			.set('Authorization', `Bearer ${token}`)
		expect(res.status).toEqual(204)
	})

	it('should not delete a task without a user logged', async () => {
		await supertest(app.server)
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'New task',
				description: 'About the task',
			})

		const allTasks = await supertest(app.server)
			.get('/tasks?limite=10&page=1')
			.set('Authorization', `Bearer ${token}`)

		const taskId = allTasks.body.tasks[0].id

		const res = await supertest(app.server).delete(`/tasks/:${taskId}`)

		expect(res.status).toEqual(401)
	})

	it('should not delete a task without a task id', async () => {
		await supertest(app.server)
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'New task',
				description: 'About the task',
			})

		const res = await supertest(app.server)
			.delete('/tasks/')
			.set('Authorization', `Bearer ${token}`)
		expect(res.status).toEqual(422)
	})
})

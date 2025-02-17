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
		const newTask = await supertest(app.server)
			.post('/tasks')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'New task',
				description: 'About the task',
			})

		expect(newTask.status).toBe(201)

		const allTasks = await supertest(app.server)
			.get('/tasks?limit=10&page=1')
			.set('Authorization', `Bearer ${token}`)

		expect(allTasks.status).toBe(200)

		const taskId = allTasks.body.tasks.find(
			(task: { id: string }) => typeof task.id === 'string',
		)

		expect(taskId.id).toBeDefined()

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
			.get('/tasks?limit=10&page=1')
			.set('Authorization', `Bearer ${token}`)

		const taskId = allTasks.body.tasks.find(
			(task: { id: string }) => typeof task.id === 'string',
		)

		const res = await supertest(app.server).delete(`/tasks/:${taskId.id}`)

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

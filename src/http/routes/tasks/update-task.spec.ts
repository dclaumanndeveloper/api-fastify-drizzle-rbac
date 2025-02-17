import { app } from '@/app'
import { createAndSigninWithEmail } from '@/lib/create-and-signin-with-email'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Update a new task', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(() => {
		app.close()
	})

	it('should update a task', async () => {
		const { token } = await createAndSigninWithEmail(app)

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

		const taskId = allTasks.body.tasks[0].id
		expect(taskId).toBeDefined()

		const res = await supertest(app.server)
			.put(`/tasks/${taskId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Task updated 2',
				description: '',
				status: 'in progress',
			})
		expect(res.status).toEqual(200)
	})

	it.skip('should not update a task without user logged', async () => {
		const { token } = await createAndSigninWithEmail(app)
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

		const res = await supertest(app.server).put(`/tasks/${taskId}`).send({
			title: 'Task updated 2',
			description: '',
			status: 'in progress',
		})
		expect(res.status).toEqual(401)
	})

	it.skip('should not update a task without user title', async () => {
		const { token } = await createAndSigninWithEmail(app)
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
			.put(`/tasks/${taskId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: '',
				description: '',
				status: 'in progress',
			})
		expect(res.status).toEqual(422)
	})
})

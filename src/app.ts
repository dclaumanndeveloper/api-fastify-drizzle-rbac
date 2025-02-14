import { signinWithEmail } from './http/routes/signin/signin-with-email'
import { createNewTask } from './http/routes/tasks/create-task'
import { deleteTask } from './http/routes/tasks/delete-task'
import { getTasks } from './http/routes/tasks/get-tasks'
import { updateTask } from './http/routes/tasks/update-task'
import { createApp } from './lib/create-app'
import { createAppDocs } from './lib/create-app-docs'

const app = createApp()

createAppDocs(app)

const routes = [
	signinWithEmail,
	createNewTask,
	updateTask,
	deleteTask,
	getTasks,
]

for (const route of routes) {
	app.register(route)
}

export { app }

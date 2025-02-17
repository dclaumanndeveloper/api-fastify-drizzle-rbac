import { env } from '@/env'
import { app } from './app'

app
	.listen({
		port: env.PORT,
		host: '0.0.0.0',
	})
	.catch((err) => {
		app.log.error({ err }, 'the server could not start.')
	})
	.finally(() => {
		console.log(`HTTP server is running on: http://localhost:${env.PORT}`)
	})

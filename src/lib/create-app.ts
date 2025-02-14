import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { createId } from '@paralleldrive/cuid2'
import fastify from 'fastify'

import { env } from '@/env'
import { errorHandler } from '@/lib/errors-handler'
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'

export function createApp() {
	const app = fastify({
		logger: {
			level: env.LOG_LEVEL,

			transport: {
				target: 'pino-pretty',

				options: {
					colorize: true,
					translateTime: 'yyyy-MM-dd HH:mm:ss',
				},
			},
		},
		genReqId: () => {
			return createId()
		},
	})

	app.register(fastifyCors)
	app.register(fastifyJwt, {
		secret: env.AUTH_SECRET,
	})
	app.setErrorHandler(errorHandler)
	app.withTypeProvider<ZodTypeProvider>()
	app.setValidatorCompiler(validatorCompiler)
	app.setSerializerCompiler(serializerCompiler)

	return app
}

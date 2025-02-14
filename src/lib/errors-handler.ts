import { app } from '@/app'
import { BadRequestError } from '@/http/routes/erros/bad-request-error'
import { UnauthorizedError } from '@/http/routes/erros/unauthorized-error'
import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (err, req, reply) => {
	if (err instanceof UnauthorizedError) {
		return reply.status(401).send({
			message: err.message,
		})
	}

	if (hasZodFastifySchemaValidationErrors(err)) {
		return reply.code(422).send({
			errors: err.validation.map((err) => ({
				field: err.instancePath.replace('/', ''),
				message: err.message,
			})),
			details: {
				method: req.method,
				url: req.url,
			},
		})
	}

	if (err instanceof BadRequestError) {
		return reply.status(400).send({
			message: err.message,
		})
	}

	app.log.fatal(err, 'uncaught exception detected')
	return reply.status(500).send({ message: 'Internal server error' })
}

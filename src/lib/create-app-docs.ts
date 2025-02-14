import fastifySwagger from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'
import type { FastifyInstance } from 'fastify/types/instance'
import packageJSON from '../../package.json'

export function createAppDocs(app: FastifyInstance) {
	app.register(fastifySwagger, {
		openapi: {
			info: {
				title: packageJSON.name,
				description: packageJSON.description,
				version: packageJSON.version,
			},
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT',
					},
				},
			},
		},
		transform: jsonSchemaTransform,
	})

	app.get('/openapi.json', () => {
		return app.swagger()
	})

	app.register(ScalarApiReference, {
		routePrefix: '/docs',
		configuration: {
			theme: 'fastify',
			layout: 'modern',
			darkMode: true,
			defaultHttpClient: {
				targetKey: 'node',
				clientKey: 'fetch',
			},
			metaData: {
				title: 'API Reference',
				description: packageJSON.description,
			},
		},
	})
}

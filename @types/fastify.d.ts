import type { Role } from '@/permissions/roles'
// biome-ignore lint: no-use-imports
import { FastifyInstance, FastifyRequest } from 'fastify'

declare module 'fastify' {
	interface FastifyRequest {
		user: {
			sub: string
			role: Role
		}
	}
}

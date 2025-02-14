import type { FastifyRequest } from 'fastify'
import { UnauthorizedError } from '../routes/erros/unauthorized-error'

export async function authMiddleware(request: FastifyRequest) {
	try {
		await request.jwtVerify()
	} catch {
		throw new UnauthorizedError('Invalid auth token')
	}
}

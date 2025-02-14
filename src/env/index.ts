import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'prod']),
	PORT: z.coerce.number(),
	AUTH_SECRET: z.string(),
	DATABASE_HOST: z.string(),
	DATABASE_USER: z.string(),
	DATABASE_PASSWORD: z.string(),
	DATABASE_NAME: z.string(),
	LOG_LEVEL: z
		.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
		.default('debug'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('Invalid environment variables:')
	console.log(JSON.stringify(_env.error.flatten().fieldErrors, null, 2))
	process.exit(1)
}

export const env = _env.data

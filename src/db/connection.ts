import { env } from '@/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export const connectionString = `postgresql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:5432/${env.DATABASE_NAME}`
export const db = drizzle(connectionString, { schema })

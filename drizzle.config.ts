import { connectionString } from '@/db/connection'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: './src/drizzle',
	schema: './src/db/schema/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: connectionString,
	},
})

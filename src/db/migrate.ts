import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from './connection'
import { app } from '@/app'

async function runMigrations() {
	try {
		await migrate(db, { migrationsFolder: 'drizzle' })
		console.log('Migrations applied successfully')
	} catch (err) {
		app.log.error(err, 'Error applying migrations')
		process.exit(1)
	}
}

runMigrations()

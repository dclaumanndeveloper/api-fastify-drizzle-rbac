import * as schema from '@/db/schema'

import { reset } from 'drizzle-seed'
import { db } from './connection'

import * as readlineSync from 'readline-sync'
import { app } from '@/app'

const answer = readlineSync.question(
	console.log('Do you want to delete ALL data? (y/n): '),
)

if (answer.toLowerCase() === 'y') {
	reset(db, schema)
		.then(() => {
			console.log('Database was reset successfully!')
			process.exit(0)
		})
		.catch((err) => {
			app.log.error(err, 'Error resetting the database:')
			process.exit(0)
		})
} else {
	console.log('Operation canceled. No data was deleted.')
	process.exit(0)
}

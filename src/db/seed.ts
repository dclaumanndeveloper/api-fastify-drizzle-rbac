import * as schema from '@/db/schema'
import { hashPassword } from '@/lib/handle-password-hash'
import * as readlineSync from 'readline-sync'

import { reset } from 'drizzle-seed'
import { db } from './connection'
import { users } from './schema'
import { app } from '@/app'

const answer = readlineSync.question(
	console.log('Do you want reset the database before seed? (y/n): '),
)

if (answer.toLowerCase() === 'y') {
	db.transaction(async (tx) => {
		reset(tx, schema)
			.then(() => {
				console.log('Database was reset successfully!')
			})
			.catch((err) => {
				app.log.error(err, 'Error resetting the database.')
			})
		await tx.insert(users).values([
			{
				name: 'Admin',
				email: 'admin@gmail.com',
				passwordHash: await hashPassword('123456'),
				role: 'admin',
			},
			{
				name: 'User',
				email: 'user@gmail.com',
				passwordHash: await hashPassword('123456'),
			},
		])
		console.log('Created users Admin and User')
	}).finally(() => {
		console.log('Database seeded successfully!')
		process.exit(0)
	})
} else {
	db.transaction(async (tx) => {
		await tx.insert(users).values([
			{
				name: 'Admin',
				email: 'admin@gmail.com',
				passwordHash: await hashPassword('123456'),
				role: 'admin',
			},
			{
				name: 'User',
				email: 'user@gmail.com',
				passwordHash: await hashPassword('123456'),
			},
		])
		console.log('Created users Admin and User')
	}).finally(() => {
		console.log('Database seeded successfully!')
		process.exit(0)
	})
}

import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { tasks } from './tasks'

export const userRoleEnum = pgEnum('user_role', [
	'admin',
	'manager',
	'editor',
	'user',
])

export const users = pgTable('users', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: userRoleEnum('role').default('user').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})

export const usersRelations = relations(users, ({ many }) => ({
	tasks: many(tasks),
}))

import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const statusEnum = pgEnum('status', [
	'pending',
	'in progress',
	'completed',
	'canceled',
])

export const tasks = pgTable('tasks', {
	id: text('id').$defaultFn(createId).primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	status: statusEnum('status').default('pending').notNull(),
	assignedTo: text('assigned_to')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})

export const tasksRelations = relations(tasks, ({ one }) => ({
	user: one(users, {
		fields: [tasks.assignedTo],
		references: [users.id],
	}),
}))

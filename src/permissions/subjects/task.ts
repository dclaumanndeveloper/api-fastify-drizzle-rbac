import { z } from 'zod'

export const taskSchema = z.object({
	__typename: z.literal('task').default('task'),
	assignedTo: z.string(),
})

export const taskSubject = z.tuple([
	z.union([
		z.literal('manage'),
		z.literal('create'),
		z.literal('read'),
		z.literal('update'),
		z.literal('delete'),
	]),
	z.union([z.literal('task'), taskSchema]),
])

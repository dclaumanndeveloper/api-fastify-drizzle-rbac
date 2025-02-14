import { z } from 'zod'
import { roleSchema } from '../roles'

export const userSchema = z.object({
	id: z.string(),
	role: roleSchema,
})

export const userSubject = z.tuple([
	z.union([
		z.literal('manage'),
		z.literal('create'),
		z.literal('read'),
		z.literal('update'),
		z.literal('delete'),
	]),
	z.literal('User'),
])

export type User = z.infer<typeof userSchema>
export type UserSubject = z.infer<typeof userSubject>

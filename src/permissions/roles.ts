import { z } from 'zod'

export const roleSchema = z.union([
	z.literal('admin'),
	z.literal('manager'),
	z.literal('editor'),
	z.literal('user'),
])

export type Role = z.infer<typeof roleSchema>

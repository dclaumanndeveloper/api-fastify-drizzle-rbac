import { type Role, roleSchema } from './roles'

export const avaliableRoles = Object.fromEntries(
	roleSchema.options.map((option) => [option.value, option.value]),
) as Record<Role, Role>

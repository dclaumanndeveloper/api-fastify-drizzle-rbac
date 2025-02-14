import { defineAbilityFor } from './permissions-config'
import type { Role } from './roles'
import { userSchema } from './subjects/user'

export function getUserPermissions(id: string, role: Role) {
	const authUser = userSchema.parse({
		id,
		role,
	})

	const ability = defineAbilityFor(authUser)

	return ability
}

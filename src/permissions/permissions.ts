import type { AbilityBuilder } from '@casl/ability'
import type { AppAbility } from './permissions-config'
import type { Role } from './roles'
import type { User } from './subjects/user'

type PermissionsByRole = (
	user: User,
	builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
	admin(_, { can }) {
		can('manage', 'all')
	},
	manager(_, { can }) {
		can('manage', 'all')
	},
	editor(_, { can }) {
		can('manage', 'all')
	},
	user(_, { can }) {
		can('manage', 'all')
	},
}

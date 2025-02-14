import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import type { CreateAbility, MongoAbility } from '@casl/ability'

import { z } from 'zod'
import { permissions } from './permissions'
import { taskSubject } from './subjects/task'
import type { User } from './subjects/user'

const appAbilitiesSchema = z.union([
	taskSubject,
	z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
	const builder = new AbilityBuilder(createAppAbility)

	if (typeof permissions[user.role] !== 'function') {
		throw new Error(`Permissions for role ${user.role} not found.`)
	}

	permissions[user.role](user, builder)

	const ability = builder.build({
		detectSubjectType(subject) {
			return subject.__typename
		},
	})

	ability.can = ability.can.bind(ability)
	ability.cannot = ability.cannot.bind(ability)

	return ability
}

import bcryptjs from 'bcryptjs'

const SALT_ROUDS = 8

export const hashPassword = async (password: string) => {
	const passwordHash = await bcryptjs.hash(password, SALT_ROUDS)

	return passwordHash
}

export const comparePassword = async (
	password: string,
	passwordHash: string,
) => {
	const passwordMatched = await bcryptjs.compare(password, passwordHash)

	return passwordMatched
}

import cryptoService from './crypto.js'
import usersService from './user.js'
import tokenService from './token.js'

const authFailed = (email) =>
  Promise.reject({
    status: 401,
    code: 'UNAUTHENTICATED',
    message: `Failed to authenticate user ${email}`,
  })

const authenticate = async ({ email, password }) => {
  const user = await usersService.findByEmail(email)
  if (!user) {
    return authFailed(email)
  }

  const passwordMatch = await cryptoService.compare(password, user.password)
  if (!passwordMatch) {
    return authFailed(email)
  }

  const { id, role } = user
  return tokenService.sign({ id, role })
}

export default { authenticate }

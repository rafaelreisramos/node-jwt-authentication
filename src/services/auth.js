import prisma from '../database/client.js'
import cryptoService from './crypto.js'
import usersService from './user.js'
import tokenService from './token.js'

const authFailed = (email) =>
  Promise.reject({
    status: 401,
    code: 'UNAUTHENTICATED',
    message: `Failed to authenticate user ${email || ''}`.trim(),
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
  const { token, expiresAt } = await tokenService.createRefreshToken(id)

  return {
    refreshToken: { token, expiresAt },
    accessToken: tokenService.sign({ id, role }),
  }
}

const isRefreshTokenValid = (refreshToken) =>
  refreshToken && refreshToken.valid && refreshToken.expiresAt >= Date.now()

const refreshToken = async (token) => {
  const { user, ...refreshTokenData } = await tokenService.getRefreshToken(
    token
  )

  if (!isRefreshTokenValid(refreshTokenData)) {
    return authFailed()
  }

  await tokenService.invalidateRefreshToken(refreshTokenData)

  const { id, role } = user
  return {
    refreshToken: await tokenService.createRefreshToken(id),
    accessToken: tokenService.sign({ id, role }),
  }
}

const logout = ({ refreshToken, allDevices }) => {
  if (allDevices) {
    return tokenService.invalidateAllUserRefreshTokens(refreshToken)
  }

  return tokenService.invalidateRefreshToken(refreshToken)
}

export default { authenticate, refreshToken, logout, authFailed }

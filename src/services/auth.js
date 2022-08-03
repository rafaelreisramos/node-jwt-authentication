import cryptoService from './crypto.js'
import usersService from './user.js'
import tokenService from './token.js'
import twoFactorService from './2fa.js'

const authFailed = (email) =>
  Promise.reject({
    status: 401,
    code: 'UNAUTHENTICATED',
    message: `Failed to authenticate user ${email || ''}`.trim(),
  })

const authenticate = async ({ email, password, token: token2fa }) => {
  const user = await usersService.findByEmail(email)
  if (!user) {
    return authFailed(email)
  }

  const { id, role, password: userPassword, twoFactor } = user
  const passwordMatch = await cryptoService.compare(password, userPassword)
  if (!passwordMatch) {
    return authFailed(email)
  }

  if (twoFactor.enabled && !token2fa) {
    return twoFactorService.twoFactorFailed()
  }

  if (twoFactor.enabled) {
    const token2FAValid = twoFactorService.is2FATokenValid(
      token2fa,
      twoFactor.secret
    )
    if (!token2FAValid) {
      return twoFactorService.twoFactorFailed()
    }
  }

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

  await tokenService.invalidateRefreshTokens({
    refreshToken: refreshTokenData.token,
  })

  const { id, role } = user
  return {
    refreshToken: await tokenService.createRefreshToken(id),
    accessToken: tokenService.sign({ id, role }),
  }
}

const logout = ({ refreshToken, allDevices }) => {
  return tokenService.invalidateRefreshTokens({ refreshToken, allDevices })
}

export default { authenticate, refreshToken, logout, authFailed }

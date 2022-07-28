import authService from '../services/auth.js'

const authenticate = async (ctx) => {
  const { email, password } = ctx.request.body
  const { refreshToken, accessToken } = await authService.authenticate({
    email,
    password,
  })

  ctx.cookies.set('refreshToken', refreshToken.token, {
    httpOnly: true,
    expires: refreshToken.expiresAt,
  })
  ctx.body = {
    accessToken,
  }
  ctx.status = 201
}

const refreshToken = async (ctx) => {
  const { accessToken } = await authService.refreshToken(
    ctx.cookies.get('refreshToken')
  )
  ctx.body = {
    accessToken,
  }
  ctx.status = 201
}

const logout = async (ctx) => {
  const { allDevices } = ctx.request.body

  const refreshToken = ctx.cookies.get('refreshToken')
  if (!refreshToken) {
    return authService.authFailed()
  }

  await authService.logout({ refreshToken, allDevices })

  ctx.cookies.set('refreshToken', null)
  ctx.status = 204
}

export default { authenticate, refreshToken, logout }

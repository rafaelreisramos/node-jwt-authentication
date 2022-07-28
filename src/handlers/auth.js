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
}

const refreshToken = async (ctx) => {
  const { accessToken } = await authService.refreshToken(
    ctx.cookies.get('refreshToken')
  )
  ctx.body = {
    accessToken,
  }
}

const logout = async (ctx) => {
  const { allDevices } = ctx.request.body

  await authService.logout({
    refreshToken: {
      token: ctx.cookies.get('refreshToken'),
    },
    allDevices,
  })
  ctx.cookies.set('refreshToken', null)
  ctx.body = {}
}

export default { authenticate, refreshToken, logout }

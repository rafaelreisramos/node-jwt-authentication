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

export default { authenticate, refreshToken }

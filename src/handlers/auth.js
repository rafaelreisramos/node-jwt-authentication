import authService from '../services/auth.js'
import twoFactorService from '../services/2fa.js'

const authenticate = async (ctx) => {
  const { email, password, token } = ctx.request.body
  const { refreshToken, accessToken } = await authService.authenticate({
    email,
    password,
    token,
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

const generateQrCode = async (ctx) => {
  const { userId } = ctx.state
  const qrcode = await twoFactorService.generateQrCode(userId)
  ctx.body = `<img src=${qrcode} />`
}

const activate2FA = async (ctx) => {
  const { token } = ctx.request.body
  const { userId } = ctx.state

  await twoFactorService.activate2FA(userId, token)
  ctx.status = 204
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

export default {
  authenticate,
  refreshToken,
  generateQrCode,
  activate2FA,
  logout,
}

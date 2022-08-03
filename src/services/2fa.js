import otplib from 'otplib'
import qrcode from 'qrcode'

import prisma from '../database/client.js'

import pkg from '../../package.json' assert { type: 'json' }

const twoFactorFailed = () =>
  Promise.reject({
    status: 401,
    code: 'UNAUTHENTICATED',
    message: 'Invalid or missing 2FA token',
  })

const generateQrCode = async (userId) => {
  const secret = otplib.authenticator.generateSecret()

  await prisma.twoFactor.upsert({
    where: { user_id: userId },
    update: { secret },
    create: { user_id: userId, secret },
  })
  const otpAuth = otplib.authenticator.keyuri(userId, pkg.name, secret)

  return qrcode.toDataURL(otpAuth)
}

const is2FATokenValid = (token, secret) =>
  otplib.authenticator.verify({ token, secret })

const activate2FA = async (userId, token) => {
  const { id: twoFactorId, secret } = await prisma.twoFactor.findUnique({
    where: { user_id: userId },
    select: { id: true, secret: true },
  })

  if (!is2FATokenValid(token, secret)) {
    return twoFactorFailed()
  }

  return prisma.twoFactor.update({
    where: { id: twoFactorId },
    data: { enabled: true },
  })
}

export default {
  generateQrCode,
  activate2FA,
  is2FATokenValid,
  twoFactorFailed,
}

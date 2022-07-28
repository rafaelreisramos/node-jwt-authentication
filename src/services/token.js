import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

import prisma from '../database/client.js'
import config from '../../config/token.js'

const signOptions = {
  algorithm: config.algorithm,
  expiresIn: config.expiresIn,
}

const sign = (payload) => jwt.sign(payload, config.keys.private, signOptions)

const verify = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, config.keys.public, (error, data) =>
      error ? reject(error) : resolve(data)
    )
  )

const createRefreshToken = async (userId) => {
  const token = `${userId}${crypto.randomBytes(64).toString('hex')}`
  const expiresAt = new Date(Date.now() + config.refresh.duration)

  await prisma.token.create({
    data: { user_id: userId, token, expiresAt, valid: true },
  })

  return { token, expiresAt }
}

const getRefreshToken = async (token) =>
  await prisma.token.findUnique({
    where: { token },
    select: {
      token: true,
      valid: true,
      user: { select: { id: true, role: true } },
      expiresAt: true,
    },
  })

const invalidateRefreshToken = async ({ token }) => {
  return await prisma.token.update({
    where: { token },
    data: { valid: false },
  })
}

const invalidateAllUserRefreshTokens = ({ token }) =>
  prisma.token
    .findUnique({
      where: { token },
      select: { user_id: true },
    })
    .then(({ user_id }) =>
      prisma.token.updateMany({
        where: { user_id },
        data: { valid: false },
      })
    )

export default {
  sign,
  verify,
  createRefreshToken,
  getRefreshToken,
  invalidateRefreshToken,
  invalidateAllUserRefreshTokens,
}

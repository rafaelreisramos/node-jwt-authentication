import jwt from 'jsonwebtoken'

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

export default { sign, verify }

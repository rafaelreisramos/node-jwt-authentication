import jwt from 'jsonwebtoken'

import config from '../../config/token.js'

const signOptions = {
  expiresIn: config.expiresIn,
}

const sign = (payload) => jwt.sign(payload, config.secret, signOptions)

const verify = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, config.secret, (error, data) =>
      error ? reject(error) : resolve(data)
    )
  )

export default { sign, verify }

import bcrypt from 'bcrypt'

import config from '../../config/crypto.js'

const hash = async (password) =>
  await bcrypt.hash(password, config.hashSaltRounds)

const compare = async (password, hash) => await bcrypt.compare(password, hash)

export default { hash, compare }

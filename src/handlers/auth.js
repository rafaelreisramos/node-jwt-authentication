import authService from '../services/auth.js'

const authenticate = async (ctx) => {
  const { email, password } = ctx.request.body
  ctx.body = {
    token: await authService.authenticate({ email, password }),
  }
}

export default { authenticate }

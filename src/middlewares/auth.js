import tokenService from '../services/token.js'

const extractTokenFromHeaders = (ctx) => {
  const authorization = ctx.headers.authorization || ''
  return authorization.replace('Bearer ', '')
}

const handleError = (error) => {
  console.error('Failed to verify token', error)

  return Promise.reject({
    status: 401,
    code: 'UNAUTHENTICATED',
    message: 'Invalid authentication token',
  })
}

export default (ctx, next) => {
  const token = extractTokenFromHeaders(ctx)
  return tokenService
    .verify(token)
    .catch(handleError)
    .then(({ role, id }) => {
      ctx.state.role = role
      ctx.state.userId = id
    })
    .then(next)
}

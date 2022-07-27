import Router from 'koa-router'

import error from './middlewares/error.js'
import authenticated from './middlewares/auth.js'
import usersHandler from './handlers/users.js'
import authHandler from './handlers/auth.js'

const router = new Router()

router.use(error)

router.post('/users', usersHandler.createUser)
router.get('/users', authenticated, usersHandler.getAllUsers)

router.post('/auth', authHandler.authenticate)
router.post('/auth/refresh', authHandler.refreshToken)
export default router

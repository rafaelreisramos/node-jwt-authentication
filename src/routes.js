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
router.post('/auth/logout', authHandler.logout)
router.post('/auth/refresh', authHandler.refreshToken)
router.post('/auth/2fa/qrcode', authenticated, authHandler.generateQrCode)
router.post('/auth/2fa/activate', authenticated, authHandler.activate2FA)

export default router

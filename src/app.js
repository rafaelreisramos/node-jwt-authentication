import Koa from 'koa'
import bodyParser from 'koa-body'
import router from './routes.js'

const app = new Koa()

app.use(bodyParser())
app.use(router.routes())

export default app

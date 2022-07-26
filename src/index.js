import 'dotenv/config'
import app from './app.js'
import config from '../config/server.js'

const port = config.port

app
  .listen(port)
  .on('listening', () => console.log(`server is listening on port ${port}`))

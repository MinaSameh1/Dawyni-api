import app from './app'
import { connect, disconnect } from './utils/db'
import logger from './utils/logger'
import config from 'config'
import swaggerDocs from './utils/swagger'

// Start the application by listening to specific port
const PORT = Number(process.env.PORT || config.get<number>('Port') || 8000)

process.on('exit', async () => {
  await disconnect()
})

app.listen(PORT, async () => {
  await connect()
  logger.info(`Server Running on port ${PORT}`)
  swaggerDocs(app, PORT)
})

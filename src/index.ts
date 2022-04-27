import config from 'config'
import app from './app'
import { connect, disconnect } from './utils/db'
import { firebase } from './utils/firebase'
import logger from './utils/logger'
import swaggerDocs from './utils/swagger'

// Start the application by listening to specific port
const PORT = Number(process.env.PORT || config.get<number>('Port') || 8000)

function shutdown(signal: string) {
  return async (err: unknown) => {
    logger.info(`Recieved ${signal}, shutting down gracefully`)
    if (err) {
      logger.error(err)
    }

    setTimeout(function () {
      logger.error('could not close gracefully, bailling.')
      process.exit(1)
    }, 8000)

    server.close(async () => {
      await disconnect()
      await firebase.delete()
      logger.info('Server Shutdown gracefully')
      process.exit(err ? 1 : 0)
    })
  }
}

const server = app.listen(PORT, async () => {
  if (process.env['NODE_ENV'] == 'production') {
    // Use atlas
    await connect(process.env.DB_URI || config.get<string>('dbUri'))
  } else {
    await connect(config.get<string>('dbUri'))
  }

  logger.info(`Server Running on port ${PORT}`)
  swaggerDocs(app, PORT)
})

// Handle some signals
process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'))
  .on('exit', shutdown('exit'))

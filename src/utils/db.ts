import mongoose from 'mongoose'
import logger from './logger'

export async function connect(dbUri: string) {
  try {
    await mongoose.connect(dbUri)
    logger.info('Connected to DB')
  } catch (error) {
    logger.fatal(`Could not connect to db ${error}`)
    process.exit(1)
  }
  return mongoose
}

export async function disconnect() {
  try {
    await mongoose.disconnect()
    await mongoose.connection.close()
    logger.info('Disconnected from mongodb')
  } catch (err) {
    logger.fatal('Failed to disconnect mongodb')
    logger.fatal(err)
  }
}

export default connect

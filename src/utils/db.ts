import mongoose from 'mongoose'
import logger from './logger'

export async function connect() {
  const dbUri = process.env['DB_URI'] || 'mongodb://localhost:27017/PIS'

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
  await mongoose.connection.close()
}

export default connect

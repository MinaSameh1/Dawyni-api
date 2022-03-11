import pino from 'pino'
import config from 'config'
import pretty from 'pino-pretty'

const logger = pino(
  {
    base: { name: 'Rest API' }
  },
  pretty({
    ignore: 'pid,hostname',
    translateTime: 'SYS:standard',
    colorize: true
  })
)

// Set the level in config/default.ts
logger.level = process.env.PINO_LOG_LEVEL || config.get<string>('loggingLevel')

export default logger

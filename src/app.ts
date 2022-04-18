import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pino from 'express-pino-logger'
import { getFilesWithKeyword } from './utils/getFilesWithKeyword'

const app = express()

/************************************************************************************
 *                              Setting Environment Variables
 ***********************************************************************************/
process.env['NODE_CONFIG_DIR'] = __dirname + '/utils/constants/'
import 'dotenv/config'

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/
import logger from './utils/logger'
import config from 'config'
import deseralizeUser from './middleware/deseralizeUser'
import logReqs from './middleware/logReqs'

app.set('json spaces', 2)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cors
app.use(cors())

// For security.
app.use(helmet())

// Log request
app.use(logReqs)

// User authentication
app.use(deseralizeUser)

// Logger, must be last on the list.
if (config.get<string>('NODE_ENV') == 'dev') app.use(pino(logger))

/************************************************************************************
 *                               Register all routes
 ***********************************************************************************/

// Get files that have `router` in their name, check the function def for more info
getFilesWithKeyword('router', __dirname + '/api').forEach((file: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { router } = require(file)
  app.use('/', router)
})

/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line no-unused-vars
    _: express.NextFunction
  ) => {
    logger.error({
      errorName: err.name,
      message: err.message,
      stack: err.stack || 'no stack defined'
    })
    return res.status(500).json({
      message: 'Something went wrong server side'
    })
  }
)

// In case of invalid request
app.use((_, res) => {
  res.status(404).json({
    message: '404! This Request Was not found!'
  })
})

export default app

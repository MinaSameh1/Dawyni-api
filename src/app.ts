import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import pino from 'express-pino-logger'
import helmet from 'helmet'
import deseralizeUser from './middleware/deseralizeUser'
import logReqs from './middleware/logReqs'
import { getFilesWithKeyword } from './utils/getFilesWithKeyword'
import logger from './utils/logger'

/************************************************************************************
 *                              Main Server Config File
 ***********************************************************************************/

const app = express()

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/

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

// Logger, only enable request
if (process.env['NODE_ENV'] == 'development') app.use(pino(logger))

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

export default app
// This is a comment

import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

/**
 * Middleware that logs request path, type and its status code.
 */
function logReqs(req: Request, res: Response, next: NextFunction) {
  res.on('finish', () => {
    logger.info(`${req.baseUrl + req.path} ${req.method} ${res.statusCode}`)
    return
  })

  return next()
}

export default logReqs

import { findUserByUid } from '../api/user/user.service'
import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'
import { get } from 'lodash'
import { FBverifyIdToken } from '../utils/jwt.utils'

async function deseralizeUser(req: Request, res: Response, next: NextFunction) {
  const headerToken: string = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/, // Removes Bearer from token
    ''
  )

  const accessToken: string = get(req, 'headers.access_token', '').replace(
    /^Bearer\s/, // Removes Bearer from token
    ''
  )

  logger.info('Recieved token!')

  if (!headerToken && !accessToken) {
    return next()
  }

  try {
    const { decoded } = await FBverifyIdToken(headerToken || accessToken)

    if (decoded) {
      res.locals.user = decoded
      res.locals.userData = await findUserByUid(decoded.uid)
      return next()
    }
    return next()
  } catch (err: unknown) {
    return res.status(400).json({ message: 'Token malformed or error in fb' })
  }
}

export default deseralizeUser

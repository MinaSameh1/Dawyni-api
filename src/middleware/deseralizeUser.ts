import { Request, Response, NextFunction } from 'express'
import { get } from 'lodash'
import { FBverifyIdToken } from '../utils/jwt.utils'

async function deseralizeUser(req: Request, res: Response, next: NextFunction) {
  const headerToken: string = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/, // Removes Bearer from token
    ''
  )

  // logger.debug(`Recieved This in auth headers: ${headerToken}`)

  if (!headerToken) {
    return next()
  }

  try {
    const { decoded } = await FBverifyIdToken(headerToken)

    if (decoded) {
      res.locals.user = decoded
      return next()
    }
    return next()
  } catch (err: unknown) {
    return res.status(400).json({ message: 'Token malformed or error in fb' })
  }
}

export default deseralizeUser

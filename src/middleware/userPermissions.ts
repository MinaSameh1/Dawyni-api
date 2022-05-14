import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

/**
 * Middleware that checks if the user has permissions to access
 * the endpoint.
 */
const userPermission =
  (roles: Array<string>) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
      return res.status(403).json([{ message: 'Please Log in' }])
    }
    // Get the user role
    // User must be signed in to set res.locals.user,
    // as such if the logged in user is the same as the user
    // who uploaded the item/question let them do what they want with it.
    logger.debug(`userPerms Recieved Role:${res.locals.user.role}`)
    if (
      res.locals.user.role === 'user' &&
      req.params.uid === res.locals.user.uid
    ) {
      return next()
    } else if (roles.includes(res.locals.user.role)) {
      return next()
    }

    return res.status(401).json([{ message: 'access denied' }])
  }

export default userPermission

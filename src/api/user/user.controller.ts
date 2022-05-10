import { Request, Response } from 'express'
import logger from '../../utils/logger'
import { createUserUsingEmailPassFB, getAllUsersFB } from './user.service'

export async function CreateUserByEmailHandler(req: Request, res: Response) {
  try {
    const { user, err } = await createUserUsingEmailPassFB(req.body)
    if (err) {
      return res.status(err.status).json({ message: err.message })
    }
    return res.status(200).json({ message: 'Working', user: user })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Something went wrong server side' })
  }
}

export async function GetAllUsersHandler(_: Request, res: Response) {
  logger.info('Getting users.')
  const users = await getAllUsersFB()
  if (!users) res.status(500).json({ message: 'Server Side error!' })
  return res.status(200).send(users)
}

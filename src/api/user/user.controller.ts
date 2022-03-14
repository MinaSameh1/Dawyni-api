import { Request, Response } from 'express'
import logger from '../../utils/logger'
import UserService from './user.service'

const userService = new UserService()

export async function CreateUserHandler(req: Request, res: Response) {
  const { user, err } = await userService.createUserUsingEmailPass(req.body)
  if (err) {
    return res.status(403).json({ message: err })
  }
  return res.status(200).json({ message: 'Working', user: user })
}

export async function GetAllUsersHandler(_: Request, res: Response) {
  logger.info('Getting users.')
  const users = await userService.getAllUsers()
  if (!users) res.status(500).send('Server Side error!')
  return res.status(200).send(users)
}

import { Request, Response } from 'express'
import logger from '../../utils/logger'
import firebase_config from '../server/firebase'
import UserService from './user.service'

const userService = new UserService()
userService.initializeApp(firebase_config)

export async function CreateUserHandler(req: Request, res: Response) {
  const ret = await userService.createUserUsingEmailPass(req.body)
  logger.debug(typeof ret)
  return res.status(200).json({ message: 'Working', user: ret })
}

export async function GetAllUsersHandler(_: Request, res: Response) {
  logger.info('Getting users.')
  const users = await userService.getAllUsers()
  if (!users) res.status(500).send('Server Side error!')
  return res.status(200).send(users)
}

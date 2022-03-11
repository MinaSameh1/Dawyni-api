import { Request, Response } from 'express'
import UserService from './user.service'

const FireBaseUserService = new UserService()

export async function CreateUserHandler(_: Request, res: Response) {
  throw new Error('Function not implemented.')
  return res.status(200).json({ message: 'Working' })
}

export async function GetAllUsersHandler(_: Request, res: Response) {
  const users = await FireBaseUserService.getAllUsers()
  if (!users) res.status(500).send('Server Side error!')
  return res.status(200).send(users)
}

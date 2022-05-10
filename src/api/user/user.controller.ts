import { Request, Response } from 'express'
import logger from '../../utils/logger'
import { get } from 'lodash'
import {
  createUserUsingEmailPassFB,
  deleteUser,
  getAllUsersFB,
  getUserByUID,
  updateUser
} from './user.service'

export async function CreateUserByEmailHandler(req: Request, res: Response) {
  try {
    const { user, err } = await createUserUsingEmailPassFB(req.body)
    if (err) {
      return res.status(err.status).json({ message: err.message })
    }
    return res.status(200).json({ result: user })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Something went wrong server side' })
  }
}

export async function UpdateUserByUidHandler(req: Request, res: Response) {
  if (req.params.uid) {
    const uid = get(req.params, 'uid')
    const user = await getUserByUID(uid)
    if (user) {
      const result = await updateUser(uid, req.body)
      logger.info(result)
      if (result) {
        return res.status(200).json({ message: 'User deleted' })
      }
    }
    return res.status(400).json({ message: "user doesn't exist!" })
  }
  return res
    .status(400)
    .json({ message: "missing uid of user or user doesn' exist!" })
}

export async function DeleteUserByUidHandler(req: Request, res: Response) {
  if (req.params.uid) {
    const uid = get(req.params, 'uid')
    const user = await getUserByUID(uid)
    if (user) {
      const result = await deleteUser(uid)
      logger.info(result)
      if (result) {
        return res.status(200).json({ message: 'User deleted' })
      }
    }
    return res.status(400).json({ message: "user doesn't exist!" })
  }
  return res
    .status(400)
    .json({ message: "missing uid of user or user doesn' exist!" })
}

export async function GetUserByUidHandler(req: Request, res: Response) {
  if (req.params.uid) {
    const uid = get(req.params, 'uid')
    const user = await getUserByUID(uid)
    if (user) {
      return res.status(200).json({ result: user })
    }
    return res.status(400).json({ message: "user doesn't exist!" })
  }
  return res
    .status(400)
    .json({ message: "missing uid of user or user doesn' exist!" })
}

export async function GetAllUsersHandler(_: Request, res: Response) {
  logger.info('Getting users.')
  const users = await getAllUsersFB()
  if (!users) res.status(500).json({ message: 'Server Side error!' })
  return res.status(200).json({ result: users })
}

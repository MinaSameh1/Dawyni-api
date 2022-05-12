import { Request, Response } from 'express'
import logger from '../../utils/logger'
import { get } from 'lodash'
import {
  createUser,
  createUserMongo,
  deleteUser,
  verifyEmailAndPass,
  getToken,
  findUserByEmail,
  findUserByPhone,
  getAllUsersFB,
  getUserByUID,
  updateUser
} from './user.service'

export async function CreateUserByEmailHandler(req: Request, res: Response) {
  try {
    // If user isn't admin/loggedin force set role as user.
    if (res.locals.user?.role != 'admin') {
      req.body.role = 'user'
    }
    const findUser = await findUserByEmail(get(req.body, 'email'))
    if (findUser)
      return res.status(400).json({ message: 'user already exists!' })
    const { user, err } = await createUser(req.body)
    if (err) {
      return res.status(err.status).json({ message: err.message })
    }
    return res.status(200).json({ result: user })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Something went wrong server side' })
  }
}

export async function CreateUserByPhone(req: Request, res: Response) {
  try {
    const findUser = await findUserByPhone(req.body.phoneNumber)
    if (findUser)
      return res.status(400).json({ message: 'user already exists!' })
    const { user, err } = await createUserMongo(req.body)
    if (err) {
      return res.status(err.status).json({ message: err.message })
    }
    return res.status(200).json({ result: user })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Something went wrong server side' })
  }
}

export async function CreateTokenHandler(req: Request, res: Response) {
  const user = await verifyEmailAndPass(
    get(req.body, 'email'),
    get(req.body, 'pass')
  )
  if (user) {
    const token = await getToken(user.uid || '')
    if (token) return res.status(200).json({ token: token })
  }
  return res.status(401).json({ message: 'Wrong email or pass' })
}

export async function UpdateUserByUidHandler(req: Request, res: Response) {
  if (req.params.uid) {
    const uid = get(req.params, 'uid')
    if (uid != res.locals.user.uid)
      return res.status(401).json({ message: 'unauthroaized user!' })
    const user = await getUserByUID(uid)
    if (user) {
      const result = await updateUser(uid, req.body)
      logger.info(result)
      if (result) {
        return res.status(200).json({ message: 'User updated' })
      }
    }
    return res.status(400).json({ message: "user doesn't exist!" })
  }
  return res
    .status(400)
    .json({ message: "missing uid of user or user doesn't exist!" })
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
    .json({ message: "missing uid of user or user doesn't exist!" })
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

export async function TestTokenHandler(_: Request, res: Response) {
  if (res.locals.user) return res.status(200).json({ result: res.locals.user })
  return res.status(400).json({ message: 'Failed!' })
}

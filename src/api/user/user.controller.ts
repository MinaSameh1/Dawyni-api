import { Request, Response } from 'express'
import logger from '../../utils/logger'
import { get } from 'lodash'
import {
  createUser,
  createUserForAndroid,
  deleteUser,
  verifyEmailAndPass,
  getToken,
  getAdmins,
  getAllUsersFB,
  findUserByUid,
  updateUser,
  checkIfUserExists,
  getUserByEmail
} from './user.service'

export async function CreateUserByEmailHandler(req: Request, res: Response) {
  try {
    // If user isn't admin/loggedin force set role as user.
    if (res.locals.userData?.role != 'admin') {
      req.body.role = 'user'
    }
    const findUser = await checkIfUserExists({
      username: get(req.body, 'username', ''),
      email: get(req.body, 'email', ''),
      phoneNumber: get(req.body, 'phoneNumber', ''),
      uid: ''
    })
    if (findUser)
      return res.status(400).json({
        message:
          'user already exists or same information like phone/email/usernmae already in use!'
      })
    const findUserFirebase = await getUserByEmail(get(req.body, 'email', ''))
    if (findUserFirebase)
      return res.status(400).json({ message: 'user already exists in fb!' })
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

export async function CreateUserAndroid(req: Request, res: Response) {
  try {
    const findUser = await checkIfUserExists({
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      uid: res.locals.user.uid
    })
    if (findUser)
      return res.status(400).json({
        message:
          'user already exists or some information like phone/email/usernmae already in use!'
      })
    // get the user
    const { user, err } = await createUserForAndroid(req.body)
    if (err) {
      return res.status(err.status).json({ message: err.message })
    }
    return res.status(200).json({ is_error: false, ...user })
  } catch (err) {
    logger.error(err)
    return res
      .status(500)
      .json({ is_error: true, message: 'Something went wrong server side' })
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

export async function UpdateCurrentUserByUidHandler(
  req: Request,
  res: Response
) {
  const uid = res.locals.user.uid
  const user = await findUserByUid(uid)
  if (user) {
    const result = await updateUser(uid, req.body)
    logger.info(result)
    if (result) {
      return res.status(200).json({ message: 'User updated' })
    }
    return res.status(400).json({ message: "user doesn't exist!" })
  }
  return res
    .status(400)
    .json({ message: "missing uid of user or user doesn't exist!" })
}

export async function UpdateUserByUidHandler(req: Request, res: Response) {
  if (req.params.uid) {
    const uid = get(req.params, 'uid')
    if (uid != res.locals.user.uid)
      return res.status(401).json({ message: 'unauthroaized user!' })
    const user = await findUserByUid(uid)
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
    const user = await findUserByUid(uid)
    if (user) {
      const result = await deleteUser(uid)
      logger.info(result)
      if (result) {
        return res.status(200).json({ message: 'User deleted' })
      }
    }
    return res.status(404).json({ message: "user doesn't exist!" })
  }
  return res.status(400).json({ message: 'missing uid of user!' })
}

export async function GetUserByUidForAdminHandler(req: Request, res: Response) {
  const user = await findUserByUid(get(req.params, 'uid', ''))
  if (user) {
    return res.status(200).json(user)
  }
  return res.status(404).json({ message: "user doesn't exist!" })
}

export async function GetUserByUidHandler(_: Request, res: Response) {
  const user = await findUserByUid(res.locals.user.uid)
  if (user) {
    return res.status(200).json(user)
  }
  return res.status(404).json({ message: "user doesn't exist!" })
}

// This is mostly for testing
export async function GetAllUsersHandler(_: Request, res: Response) {
  logger.info('Getting users.')
  const users = await getAllUsersFB()
  if (!users) res.status(500).json({ message: 'Server Side error!' })
  return res.status(200).json({ result: users })
}

// Test token
export async function TestTokenHandler(_: Request, res: Response) {
  if (res.locals.user) return res.status(200).json(res.locals.user)
  return res.status(400).json({ message: 'Failed!' })
}

// They wanted a route to return the admins :dunno:
export async function GetAllAdmins(_: Request, res: Response) {
  const result = await getAdmins()
  if (result) return res.status(200).json(result)
  return res.status(404).json({ message: 'no users found!' })
}

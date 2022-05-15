import { UserRecord } from 'firebase-admin/lib/auth/user-record'
import { omit, get } from 'lodash'
import { FilterQuery, QueryOptions } from 'mongoose'
import { auth } from '../../utils/firebase'
import logger from '../../utils/logger'
import UserModel, { User, UserInput } from './user.model'

export function findUser(
  query: FilterQuery<User>,
  options: QueryOptions = { lean: true }
) {
  return UserModel.find(query, {}, options)
}

export function findOneUser(
  query: FilterQuery<User>,
  options: QueryOptions = { lean: true }
) {
  return UserModel.findOne(query, {}, options)
}

/*
 * Checks if user exists or not
 */
export function checkIfUserExists({
  username,
  email,
  phoneNumber,
  uid = ''
}: {
  username: string
  email: string
  phoneNumber: string
  uid: string
}) {
  return UserModel.exists({
    $or: [
      {
        email: email
      },
      {
        username: username
      },
      {
        phoneNumber: phoneNumber
      },
      {
        uid: uid
      }
    ]
  })
}

/**
 * Create a user
 *
 * @param { UserInput } [ input ]
 * @returns { Promise<CreateUserResponse> } [ User ]
 * @memberof UserService
 */
export async function createUser(input: UserInput) {
  logger.info(`Gonna Check for ${input.email}`)

  const check = await checkIfUserExists({
    username: get(input, 'username', ''),
    email: get(input, 'email', ''),
    phoneNumber: get(input, 'phoneNumber', ''),
    uid: ''
  })
  if (check) {
    return {
      err: {
        status: 400,
        message: 'Email or Username Already Exists!'
      },
      user: null
    }
  }

  const userRecord = await auth().createUser({
    email: get(input, 'email'),
    emailVerified: true,
    phoneNumber: get(input, 'phoneNumber'),
    password: get(input, 'password'),
    displayName: get(input, 'username'),
    disabled: false
  })

  logger.info('Created user.')
  logger.debug(userRecord)
  const newUser = await UserModel.create({
    email: get(input, 'email'),
    password: get(input, 'password'),
    uid: userRecord.uid,
    isMale: get(input, 'isMale'),
    dob: get(input, 'dob'),
    role: get(input, 'role', 'user'),
    deviceToken: get(input, 'deviceToken'),
    username: get(input, 'username'),
    phoneNumber: get(input, 'phoneNumber')
  })

  return {
    err: null,
    user: omit(newUser.toJSON(), 'password')
  }
}

export async function createUserForAndroid(input: UserInput) {
  try {
    const check = await checkIfUserExists({
      username: get(input, 'username', ''),
      email: get(input, 'email', ''),
      phoneNumber: get(input, 'phoneNumber', ''),
      uid: ''
    })
    if (check) {
      return {
        err: {
          status: 400,
          message: 'Email or Username Already Exists!'
        },
        user: null
      }
    }

    const fb_update = {
      email: get(input, 'email'),
      emailVerified: true,
      password: get(input, 'password'),
      displayName: get(input, 'username')
    }

    const userRecord = await auth().updateUser(get(input, 'uid'), fb_update)

    const newUser = await UserModel.create({
      email: get(input, 'email'),
      password: get(input, 'password'),
      uid: get(input, 'uid'),
      deviceToken: get(input, 'deviceToken'),
      isMale: get(input, 'isMale'),
      dob: get(input, 'dob'),
      role: get(input, 'role', ''),
      username: get(input, 'username'),
      phoneNumber: get(input, 'phoneNumber')
    })

    return {
      err: userRecord ? null : true,
      user: omit(newUser.toJSON(), 'password'),
      userRecord: userRecord
    }
  } catch (err) {
    logger.error(err)
    return {
      err: {
        status: 500,
        message: 'Something went wrong server side'
      },
      user: null,
      userRecord: null
    }
  }
}

export async function getUserByPhoneNumber(phone: string) {
  try {
    return await auth().getUserByPhoneNumber(phone)
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') return null
    logger.error(err)
    throw err
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await auth().getUserByEmail(email)
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') return null
    logger.error(err)
    throw err
  }
}

export async function getUserByUid(uid: string) {
  try {
    return await auth().getUser(uid)
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') return null
    logger.error(err)
    throw err
  }
}

export function findUserByUid(uid: string) {
  return findOneUser({ uid: uid })
}

export async function updateUser(uid: string, input: UserInput) {
  const fb_update = {
    email: get(input, 'email'),
    password: get(input, 'password'),
    displayName: get(input, 'username')
  }

  return auth()
    .updateUser(uid, fb_update)
    .then(async userRecord => {
      logger.info(userRecord)
      return await UserModel.findOneAndUpdate({ uid: uid }, input)
    })
    .catch(err => {
      throw err
    })
}

export async function deleteUser(uid: string) {
  return auth()
    .deleteUser(uid)
    .then(async () => {
      return await UserModel.deleteOne({ uid: uid })
    })
    .catch(error => {
      logger.error(error)
      return null
    })
}

/**
 * Get a list of users
 *
 * @param {number} [maxResults=1000]
 * @returns {Promise<UserRecord[] | void>}
 * @memberof UserService
 */
export async function getAllUsersFB(
  maxResults = 1000
): Promise<UserRecord[] | void> {
  return auth()
    .listUsers(maxResults)
    .then(listUsersResult => listUsersResult.users)
    .catch(err => logger.error('Error getting users:' + err))
}

export async function verifyEmailAndPass(email: string, pass: string) {
  const user = await UserModel.findOne({ email: email })
  if (user?.comparePass(pass)) return user
  return null
}

export async function getToken(uid: string) {
  return auth().createCustomToken(uid)
}

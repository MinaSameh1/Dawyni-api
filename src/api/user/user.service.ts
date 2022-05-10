import { UserRecord } from 'firebase-admin/lib/auth/user-record'
import { omit, get } from 'lodash'
import { auth } from '../../utils/firebase'
import logger from '../../utils/logger'
import UserModel, { UserInput } from './user.model'

/*
 * Checks if user exists or not
 */
export async function checkUser(username: string, email: string) {
  return UserModel.exists({
    $or: [
      {
        email: email
      },
      {
        username: username
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
export async function createUserUsingEmailPassFB(input: UserInput) {
  logger.info(`Gonna Check for ${input.email}`)

  const check = await checkUser(
    get(input, 'username', ''),
    get(input, 'email', '')
  )
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
    username: get(input, 'username')
  })

  return {
    err: null,
    user: omit(newUser.toJSON(), 'password')
  }
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
    .catch(err => {
      logger.error('Error getting users:' + err)
    })
}

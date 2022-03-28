import { UserRecord } from 'firebase-admin/lib/auth/user-record'
import { omit, get } from 'lodash'
import { auth } from '../../utils/firebase'
import logger from '../../utils/logger'
import UserModel, { UserInput } from './user.model'

/**
 * Responsible for any connection to FB or mongo related to user.
 */
export default class UserService {
  /**
   * Create a user
   *
   * @param { UserInput } [ input ]
   * @returns { Promise<CreateUserResponse> } [ User ]
   * @memberof UserService
   */
  async createUserUsingEmailPass(input: UserInput) {
    logger.info(`Gonna Check for ${input.email}`)
    const checkUser = await UserModel.exists({
      $or: [
        {
          email: get(input, 'email')
        },
        {
          username: get(input, 'username')
        }
      ]
    })
    if (checkUser) {
      return {
        err: 'Email or Username Already Exists!',
        user: null
      }
    }

    const userRecord = await auth.createUser({
      email: get(input, 'email'),
      emailVerified: false,
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
      username: get(input, 'username')
    })

    return {
      err: null,
      user: omit(newUser.toJSON(), 'password')
    }
  }

  /**
   * Get a list of users
   *
   * @param {number} [maxResults=1000]
   * @returns {Promise<UserRecord[] | void>}
   * @memberof UserService
   */
  async getAllUsers(maxResults = 1000): Promise<UserRecord[] | void> {
    return auth
      .listUsers(maxResults)
      .then(listUsersResult => listUsersResult.users)
      .catch(err => {
        logger.error('Error getting users:', err)
      })
  }
}

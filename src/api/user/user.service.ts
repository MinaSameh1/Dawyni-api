import * as admin from 'firebase-admin'
import logger from '../../utils/logger'
import '../server/firebase'
import UserModel from './user.model'

// interface CreateUserResponse {
//   email: string
//   username: string
//   _id: string
//   createdAt: string
//   updatedAt: string
// }

export default class UserService {
  initializeApp(config: admin.AppOptions): undefined {
    admin.initializeApp(config)
    return
  }

  /**
   * @param {object} { email, username, password }
   * @returns {Promise<any>}
   * @memberof UserService
   */
  async createUserUsingEmailPass({
    email,
    username,
    password
  }: {
    email: string
    username: string
    password: string
  }): Promise<any> {
    return admin
      .auth()
      .createUser({
        email: email,
        emailVerified: false,
        phoneNumber: '',
        password: password,
        displayName: username,
        disabled: false
      })
      .then(userRecord => {
        logger.info('Created user.')
        logger.debug(userRecord)
        const user = new UserModel(userRecord)
        return user.save()
      })
  }

  /**
   * Get a list of users
   *
   * @param {number} [maxResults=1000]
   * @returns {Promise<UserRecord[] | void>}
   * @memberof UserService
   */
  async getAllUsers(maxResults = 1000): Promise<UserRecord[] | void> {
    return admin
      .auth()
      .listUsers(maxResults)
      .then(listUsersResult => listUsersResult.users)
      .catch(err => {
        logger.error('Error getting users:', err)
      })
  }
}

import * as admin from 'firebase-admin'
import logger from '../../utils/logger'
import { UserRecord } from 'firebase-admin/lib/auth/user-record'

export default class UserService {
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

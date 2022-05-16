import { Router } from 'express'
import requireUser from '../../middleware/requireUser'
import userPermissions from '../../middleware/userPermissions'
import validateResource from '../../middleware/validateResource'
import {
  TestTokenHandler,
  CreateUserByEmailHandler,
  CreateUserAndroid,
  CreateTokenHandler,
  GetAllUsersHandler,
  GetUserByUidHandler,
  UpdateUserByUidHandler,
  DeleteUserByUidHandler,
  GetUserByUidForAdminHandler,
  GetAllAdmins,
  UpdateCurrentUserByUidHandler
} from './user.controller'
import {
  createUserEmailSchema,
  createUserPhoneSchema,
  createTokenSchema,
  UserParams,
  updateUserPhoneSchema
} from './user.schema'

const router = Router()
const USER_ENDPOINT = '/api/user'

/**
 * @openapi
 * '/api/user':
 *  post:
 *    tags:
 *      - User
 *    summary: Register a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUserInput'
 *    responses:
 *      200:
 *        description: 'Everything went smoothly'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 *      500:
 *        description: 'Something went wrong server side'
 */
router.post(
  USER_ENDPOINT,
  requireUser,
  validateResource(createUserEmailSchema),
  CreateUserByEmailHandler
)

router.post(
  USER_ENDPOINT + '/phone',
  validateResource(createUserPhoneSchema),
  CreateUserAndroid
)

// Get a custom token
router.post(
  USER_ENDPOINT + '/token',
  validateResource(createTokenSchema),
  CreateTokenHandler
)

// Testing route for token
router.get(USER_ENDPOINT + '/token', requireUser, TestTokenHandler)

// Testing route for token
router.get(
  USER_ENDPOINT + '/admin',
  requireUser,
  userPermissions(['admin']),
  GetAllAdmins
)

router.put(
  USER_ENDPOINT + '/:uid',
  requireUser,
  validateResource(UserParams),
  validateResource(updateUserPhoneSchema),
  UpdateUserByUidHandler
)

router.put(
  USER_ENDPOINT,
  requireUser,
  validateResource(updateUserPhoneSchema),
  UpdateCurrentUserByUidHandler
)

router.get(
  USER_ENDPOINT + '/:uid',
  requireUser,
  userPermissions(['admin']),
  validateResource(UserParams),
  GetUserByUidForAdminHandler
)

router.get(USER_ENDPOINT, requireUser, GetUserByUidHandler)

router.delete(
  USER_ENDPOINT + '/:uid',
  validateResource(UserParams),
  DeleteUserByUidHandler
)

router.get(USER_ENDPOINT + '/all', GetAllUsersHandler)

export = { router }

import { Router } from 'express'
import requireUser from '../../middleware/requireUser'
import validateResource from '../../middleware/validateResource'
import {
  TestTokenHandler,
  CreateUserByEmailHandler,
  CreateUserByPhone,
  CreateTokenHandler,
  GetAllUsersHandler,
  GetUserByUidHandler,
  UpdateUserByUidHandler,
  DeleteUserByUidHandler
} from './user.controller'
import {
  createUserEmailSchema,
  createUserPhoneSchema,
  createTokenSchema,
  UserParams
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
  validateResource(createUserEmailSchema),
  CreateUserByEmailHandler
)

router.post(
  USER_ENDPOINT + '/phone',
  validateResource(createUserPhoneSchema),
  CreateUserByPhone
)

// Get a custom token
router.post(
  USER_ENDPOINT + '/token',
  validateResource(createTokenSchema),
  CreateTokenHandler
)

// Testing route for token
router.get(USER_ENDPOINT + '/token', requireUser, TestTokenHandler)

router.put(
  USER_ENDPOINT + '/:uid',
  validateResource(UserParams),
  requireUser,
  UpdateUserByUidHandler
)

router.get(USER_ENDPOINT, requireUser, GetUserByUidHandler)

router.delete(
  USER_ENDPOINT + '/:uid',
  validateResource(UserParams),
  DeleteUserByUidHandler
)

router.get(USER_ENDPOINT + '/all', GetAllUsersHandler)

export = { router }

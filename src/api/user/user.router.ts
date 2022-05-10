import { Router } from 'express'
import validateResource from '../../middleware/validateResource'
import {
  CreateUserByEmailHandler,
  DeleteUserByUidHandler,
  UpdateUserByUidHandler,
  GetAllUsersHandler,
  GetUserByUidHandler
} from './user.controller'
import { createUserEmailSchema, UserParams } from './user.schema'

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

router.put(
  USER_ENDPOINT + '/:uid',
  validateResource(UserParams),
  UpdateUserByUidHandler
)

router.get(
  USER_ENDPOINT + '/:uid',
  validateResource(UserParams),
  GetUserByUidHandler
)

router.delete(
  USER_ENDPOINT + '/:uid',
  validateResource(UserParams),
  DeleteUserByUidHandler
)

router.get(USER_ENDPOINT, GetAllUsersHandler)

export = { router }

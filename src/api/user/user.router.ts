import { Router } from 'express'
import validateResource from '../../middleware/validateResource'
import { CreateUserByEmailHandler, GetAllUsersHandler } from './user.controller'
import { createUserEmailSchema } from './user.schema'

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

router.get(USER_ENDPOINT, GetAllUsersHandler)

export = { router }

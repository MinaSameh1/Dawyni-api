import { boolean, object, optional, string, TypeOf } from 'zod'

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - username
 *        - password
 *        - confirmPassword
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        username:
 *          type: string
 *          default: janedoe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        confirmPassword:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        username:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export const createUserEmailSchema = object({
  body: object({
    username: string({
      required_error: 'username is required!',
      invalid_type_error: 'username must be string'
    }),
    password: string({
      required_error: 'Password is required',
      invalid_type_error: 'Password should be a string'
    })
      .min(6, 'Password too short!')
      .max(16, 'Password is too long'),
    confirmPassword: string({
      required_error: 'confirmPassword is required!',
      invalid_type_error: 'confirmPassword must be string'
    }),
    isMale: boolean({
      required_error: 'isMale is required(Boolean)'
    }),
    dob: string({
      required_error: 'Required dob(Date of birth) as string'
    }),
    deviceToken: optional(
      string({
        invalid_type_error: 'deviceToken must be string'
      })
    ),
    phoneNumber: optional(
      string({
        invalid_type_error: 'Needs to be string format : +20115554444'
      })
    ),
    email: string({
      required_error: 'Email is required'
    }),
    role: optional(
      string({
        invalid_type_error: 'Needs to be string and only one word.'
      })
        .min(4, 'Too short')
        .max(6, 'Too Long')
    )
  }).refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match!'
  })
})

export type CreateUserEmailInput = TypeOf<
  Omit<typeof createUserEmailSchema, 'body.confirmPassword'>
>

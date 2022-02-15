const Zod = require('zod')

const UserSchema = Zod.object({
  email: Zod.string({
    required_error: 'Email is required',
    invalid_type_error: 'Must be String'
  }).email({ message: 'Invalid Email address' }),

  phone: Zod.string({
    required_error: 'Phone is required',
    invalid_type_error: 'Must be String'
  }).length(12, { message: 'Must be between 12 characters' }),

  password: Zod.string({
    required_error: 'Password is required',
    invalid_type_error: 'Must be String'
  })
    .min(4, { message: 'Password length must be within 4 characters and 16' })
    .max(16, { message: 'Password length must be within 4 characters and 16' }),
  first_name: Zod.string({
    required_error: 'First Name is required',
    invalid_type_error: 'Must be String'
  }),
  last_name: Zod.string({
    required_error: 'Last Name is required',
    invalid_type_error: 'Must be String'
  }),
  gender: Zod.enum(['male', 'female'], {
    invalid_type_error: 'Must be String',
    required_error: 'Gender is required'
  }),
  type: Zod.optional(Zod.number({
    required_error: 'Phone is required',
    invalid_type_error: 'Must be String'
  })),
  age: Zod.number({
    required_error: 'age is required',
    invalid_type_error: 'Must be String'
  })
})

module.exports = UserSchema

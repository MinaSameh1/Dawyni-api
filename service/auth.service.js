const User = require('../models/user.mode')
const { omit } = require('lodash')
/*
  todo:check if email exists
  !yes ===> errer
  ?no ===>create new account
  */

exports.createNewUser = async (UserToBeAdded) => {
  const user = await User.exists({
    $or: [{ email: UserToBeAdded.email }, { phone: UserToBeAdded.phone }]
  })
  if (user)
    return {
      error: 'email or phone number is already used',
      user: null
    }
  const newUser = await User.create({
    ...UserToBeAdded
  })
  return {
    error: null,
    user: omit(newUser, 'password')
  }
}

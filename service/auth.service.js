const User = require('../models/user.mode')
const { omit } = require('lodash')
/*
  todo:check if email exists
  !yes ===> errer
  ?no ===>create new account
  */

exports.createNewUser = (UserToBeAdded) => {
  return (async (resolve, reject) => {
    try {
          const user = await User.exists({
              $or: [{ email: UserToBeAdded.email }, { phone: UserToBeAdded.phone }]
          })
          if (user)
              reject('email or phone number is already used')
          const newUser = await User.create({
              ...UserToBeAdded
          })
          resolve(omit(newUser), 'password')
      } catch (err) {
          reject(err)
      }
  })
}

const User = require('../models/user.mode')
const { omit } = require('lodash')
/*
  todo:check if email exists
  !yes ===> errer
  ?no ===>create new account
  */

exports.createNewUser = (
  email,
  phone,
  password,
  first_name,
  last_name,
  gender,
  type,
  age
) => {
  return new Promise((resolve, reject) => {
    return User.exists({ email: email })
      .then((user) => {
        if (user) reject('email is already registered')
        return User.create({
          email,
          phone,
          password,
          first_name,
          last_name,
          gender,
          type,
          age
        })
      })
      .then((newUser) => {
        resolve(omit(newUser), 'password')
      })
      .catch((err) => {
        reject(err)
      })
  })
}

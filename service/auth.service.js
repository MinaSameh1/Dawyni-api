const User = require('../models/user.mode')
const log = require('../utils/logger')
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
    return User.findOne({ email: email })
      .then(user => {
        log.info(email)
        if (user) reject('email is already registered')
        let newUser = new User({
          email,
          phone,
          password,
          first_name,
          last_name,
          gender,
          type,
          age
        })
        return newUser.save()
      })
      .then(newUser => {
        resolve(newUser)
      })
      .catch(err => {
        reject(err)
      })
  })
}

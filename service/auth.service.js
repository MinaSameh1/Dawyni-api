const User = require('../models/user.mode')
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
        if (user) reject('email is used')
        let newUser = new User(
          email,
          phone,
          password,
          first_name,
          last_name,
          gender,
          type,
          age
        )
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

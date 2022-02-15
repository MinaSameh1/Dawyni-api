const authServer = require('../service/auth.service')

/*
requird parm
email,phone, password,first_name,last_name,gender,type,age
*/
exports.postSignUp = (req, res) => {
  authServer
    .createNewUser(req.body)
    .then((newUser) => {
      res.status(201).json(newUser)
    })
    .catch((err) => {
      res.status(400).json({
        error: true,
        message: err
      })
    })
}

const authServer = require('../service/auth.service')

/*
requird parm
email,phone, password,first_name,last_name,gender,type,age
*/
exports.postSignUp = (req, res) => {
  authServer
    .createNewUser(
      req.body.email,
      req.body.phone,
      req.body.password,
      req.body.first_name,
      req.body.last_name,
      req.body.gender,
      req.body.type,
      req.body.age
    )
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

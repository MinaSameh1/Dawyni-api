const authServer = require('../service/auth.service')

/*
requird parm
email,phone, password,first_name,last_name,gender,type,age
*/
exports.postSignUp = (req, res) => {
  authServer
    .createNewUser(
      req.email,
      req.phone,
      req.password,
      req,
      req.firs_name,
      req.last_name,
      req.gender,
      req.type,
      req.age
    )
    .then(newUser => {
      res.status(201).json(newUser.len())
    })
    .catch(err => {
      res.status(400).json({
        error: true,
        message: err
      })
    })
}

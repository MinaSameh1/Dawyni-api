const { createNewUser } = require('../service/auth.service')

/*
requird parm
email,phone, password,first_name,last_name,gender,type,age
*/
exports.postSignUp = (req, res) => {
  try {
    const newUser = createNewUser(req.body)
    if (newUser.error) return res.status(400).json(newUser.error)
    return res.status(201).json(newUser.user)
  } catch (err) {
    res.status(500).json([
      {
        message: 'INTERNAL SERVER ERROR'
      }
    ])
  }
}

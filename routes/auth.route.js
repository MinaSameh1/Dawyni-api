const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const validateSchema = require('../middleware/validateSchema')
const userSchema = require('../schema/user.schema')

router.post('/signup', validateSchema(userSchema), authController.postSignUp)

module.exports = router

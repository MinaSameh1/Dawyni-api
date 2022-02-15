const router = require('express').Router()
const authController = require('../controllers/auth.controller')

router.post('/signup', authController.postSignup)

module.exports = router

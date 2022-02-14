var express = require('express')
var router = express.Router()
const log = require('./utils/logger.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/healthcheck', function (req, res, next) {
  log.info('Recieved Health Check')
  res.json('API Is up')
})

module.exports = router

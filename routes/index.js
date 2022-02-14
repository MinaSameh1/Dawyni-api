var express = require('express')
var router = express.Router()
const log = require('../utils/logger')

/* GET home page. */
router.get('/', (_, res) => {
        log.error('Recieved NOTHINGG')
        res.status(400).json('Nothing on this endpoint')
    })

router.get('/healthcheck', (_, res) => {
        log.info('Recieved Health Check')
        res.status(200).json('API Is up')
    })

module.exports = router

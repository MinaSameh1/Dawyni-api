const pino = require('pino')
const dayjs = require('dayjs')
const config = require('config')

const log = pino({
  prettyPrint: true,
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format()}"`
})

log.level = config.get('loggingLevel')
module.exports = log

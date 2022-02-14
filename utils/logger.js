const pino = require('pino')
const dayjs = require('dayjs')

const log = pino({
  prettyPrint: true,
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format()}"`
})

module.exports = log

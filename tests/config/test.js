'use strict'
beforeAll(() => {
  process.env['NODE_CONFIG_DIR'] = './src/utils/constants/'
})
it('Server Config exists', () => {
  const config = require('config')
  expect(config.has('Port')).toBe(true)
})

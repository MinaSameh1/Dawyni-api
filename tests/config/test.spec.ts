import config from 'config'

describe('test configs', () => {
  it('Server Config exists', () => {
    expect(config.has('Port')).toBe(true)
  })
})

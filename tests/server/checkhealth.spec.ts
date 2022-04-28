import request from 'supertest'
import { connect, disconnect } from '@db'
import config from 'config'
import app from '@App/app'

describe('checks the server is running correctly', () => {
  beforeAll(async () => {
    await connect(config.get('dbUri'))
  })

  afterAll(async () => {
    await disconnect()
  })

  it('Should checkhealth return pong', () => {
    request(app)
      .get('/api/checkhealth')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return err

        expect(res.body).toMatchObject({ message: 'pong' })
        return true
      })
  })
})

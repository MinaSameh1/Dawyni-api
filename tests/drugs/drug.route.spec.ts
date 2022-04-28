import request from 'supertest'
import config from 'config'
import app from '@App/app'
import { connect, disconnect } from '@db'

describe('Test for drug route', () => {
  beforeAll(async () => {
    await connect(config.get<string>('dbUri'))
  })

  afterAll(async () => {
    await disconnect()
  })

  it('test for get route', async () => {
    const res = await request(app)
      .get('/api/drugs')
      .expect('Content-Type', /json/)

    expect(res.statusCode).toBe(200)

    expect(res.body).toEqual({
      data: expect.any(Array),
      paging: {
        total: expect.any(Number),
        page: expect.any(Number),
        pages: expect.any(Number)
      }
    })
  })

  // TODO: Post
  it('test for post route', () => {
    expect(1).toBe(1)
  })
  // TODO: Patch
  it('test for patch route', () => {
    expect(1).toBe(1)
  })
  // TODO: Put
  it('test for put route', () => {
    expect(1).toBe(1)
  })
  // TODO: Delete
  it('test for delete route', () => {
    expect(1).toBe(1)
  })
})

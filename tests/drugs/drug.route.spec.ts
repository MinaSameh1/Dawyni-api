import { createDrug, findAndDeleteDrug } from '@App/api/drug/drug.service'
import app from '@App/app'
import { connect, disconnect } from '@db'
import faker from '@faker-js/faker'
import config from 'config'
import { toNumber, toString } from 'lodash'
import request from 'supertest'

function createData() {
  return {
    drug_name: faker.commerce.productName(),
    forms: [
      {
        form: faker.name.lastName(),
        image: faker.internet.avatar()
      }
    ],
    strength: '125MG',
    active_ingredients: ['DESOXYCORTICOSTERONE ACETATE'],
    status: 'Prescription',
    price: toNumber(faker.commerce.price(100, 200, 2))
  }
}

describe('Test for drug route', () => {
  const data = createData()
  let id = ''

  beforeAll(async () => {
    await connect(config.get<string>('dbUri'))
    const Drug = await createDrug(data)
    id = Drug._id.toString()
  })

  describe('Test for get route', () => {
    describe('given the drug does not exist', () => {
      it('Should not allow an ID with bad ObjectId', async () => {
        const drugId = 'drug-123'
        await request(app).get(`/api/drugs/${drugId}`).expect(401)
      })

      it('should return a 404', async () => {
        const drugId = '924baa1a351bbd33e4c5a698'
        await request(app).get(`/api/drugs/${drugId}`).expect(404)
      })
    })

    describe('given the drug exists', () => {
      it('test for a normal get req', async () => {
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
    })

    it('test for get id', async () => {
      const res = await request(app)
        .get('/api/drugs/' + id)
        .expect('Content-Type', /json/)

      expect(res.statusCode).toBe(200)

      expect(res.body.price).toEqual(expect.any(String)) // Check that it exists
      res.body.price = toNumber(res.body.price)
      expect(res.body).toEqual({ _id: id, ...data })
    })
  })

  describe('Post Request', () => {
    it('test for normal post request', async () => {
      const toBeCreated = createData()

      const res = await request(app).post('/api/drugs').send(toBeCreated)

      expect(res.statusCode).toBe(200)
      expect(res.body.price).toEqual(expect.any(String)) // Check that it exists
      res.body.price = toNumber(res.body.price)
      expect(res.body).toEqual({
        _id: expect.any(String),
        ...toBeCreated
      })
    })
  })

  // TODO: Patch
  it('test for patch route', async () => {
    expect(1).toBe(1)
  })

  it('test for put route', async () => {
    const drugToBeUpdated = (await createDrug(createData())).toJSON()
    const drugToBeUpdatedId = toString(drugToBeUpdated._id)
    const updateData = createData()
    const res = await request(app)
      .put(`/api/drugs/${drugToBeUpdatedId}`)
      .send(updateData)

    expect(res.statusCode).toBe(200)
    expect(res.body.price).toEqual(expect.any(String)) // Check that it exists
    res.body.price = toNumber(res.body.price)
    expect(res.body).toEqual({
      _id: drugToBeUpdatedId,
      ...updateData
    })
  })

  it('test for delete route', async () => {
    const drugToBeDeleted = await createDrug(createData())
    const drugToBeDeletedId = drugToBeDeleted._id.toString()
    const res = await request(app).delete(`/api/drugs/${drugToBeDeletedId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      message: 'Successfully deleted.'
    })
  })

  afterAll(async () => {
    if (id != '') await findAndDeleteDrug({ _id: id })
    await disconnect()
  })
})

// import { createDrug } from '@App/api/drug/drug.service'
// import app from '@App/app'
// import { connect, disconnect } from '@db'
// import faker from '@faker-js/faker'
// import config from 'config'
// import { toNumber } from 'lodash'
// import request from 'supertest'

describe('Test for drug route', () => {
  // const data = {
  //   drug_name: faker.commerce.productName(),
  //   forms: [
  //     {
  //       form: 'ORAL',
  //       image: faker.internet.avatar()
  //     },
  //     {
  //       form: 'NASAL',
  //       image: faker.internet.avatar()
  //     }
  //   ],
  //   strength: '125MG',
  //   active_ingredients: ['DESOXYCORTICOSTERONE ACETATE', 'ESTRONE'],
  //   status: 'Prescription',
  //   price: toNumber(faker.commerce.price(100, 200))
  // }
  //
  // let id: string
  // beforeAll(async () => {
  //   await connect(config.get<string>('dbUri'))
  //   const drug = await createDrug(data)
  //   id = drug._id
  // })
  //
  // afterAll(async () => {
  //   await disconnect()
  // })
  //
  // describe('Test for get route', () => {
  //   describe('given the product does not exist', () => {
  //     it('should return a 404', async () => {
  //       const drugId = 'drug-123'
  //
  //       await request(app).get(`/api/products/${drugId}`).expect(404)
  //     })
  //   })
  //
  //   describe('given the product exists', () => {
  //     it('test for a normal get req', async () => {
  //       const res = await request(app)
  //         .get('/api/drugs')
  //         .expect('Content-Type', /json/)
  //
  //       expect(res.statusCode).toBe(200)
  //
  //       expect(res.body).toEqual({
  //         data: expect.any(Array),
  //         paging: {
  //           total: expect.any(Number),
  //           page: expect.any(Number),
  //           pages: expect.any(Number)
  //         }
  //       })
  //     })
  //   })
  //
  //   it('test for get id', async () => {
  //     const res = await request(app)
  //       .get('/api/drugs/' + id)
  //       .expect('Content-Type', /json/)
  //
  //     expect(res.statusCode).toBe(200)
  //
  //     expect(res.body).toEqual({
  //       data: expect.any(Array),
  //       paging: {
  //         total: expect.any(Number),
  //         page: expect.any(Number),
  //         pages: expect.any(Number)
  //       }
  //     })
  //   })
  // })
  //
  // // TODO: Post
  // describe('Post Request', () => {
  //   it('test for normal post request', async () => {
  //     const toBeCreated = {
  //       drug_name: faker.commerce.productName(),
  //       forms: [
  //         {
  //           form: faker.name.lastName(),
  //           image: faker.internet.avatar()
  //         }
  //       ],
  //       strength: '125MG',
  //       active_ingredients: ['DESOXYCORTICOSTERONE ACETATE'],
  //       status: 'Prescription',
  //       price: faker.commerce.price(100, 200)
  //     }
  //
  //     const res = await request(app).post('/api/drug').send(toBeCreated)
  //
  //     expect(res.statusCode).toBe(200)
  //     console.error(res)
  //   })
  // })

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

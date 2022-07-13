import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Singup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  
  test('sould return an account on success', async () => {
    await request(app)
    .post('/api/singup')
    .send({
      name: 'Cris',
      email: 'cris@email.com',
      password: 'password',
      passwordConfirmation: 'password'
    })
    .expect(200)
  })
})

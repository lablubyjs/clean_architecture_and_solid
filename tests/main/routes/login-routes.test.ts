import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import request from 'supertest'
import { Express } from 'express'

let accountCollection: Collection
let app: Express

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
      await request(app).post('/api/signup').send({
        name: 'Cris',
        email: 'cris@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }).expect(200)
    })
  })

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const passwordHash = await hash('password', 12)
      await accountCollection.insertOne({
        name: 'Cris',
        email: 'cris@email.com',
        password: passwordHash
      })
      await request(app).post('/api/login').send({
        email: 'cris@email.com',
        password: 'password'
      }).expect(200)
    })

    test('should return 401 on login', async () => {
      await request(app).post('/api/login').send({
        email: 'cris@email.com',
        password: 'password'
      }).expect(401)
    })
  })
})

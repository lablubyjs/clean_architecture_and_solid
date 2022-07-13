import request from 'supertest'
import app from '../config/app'

describe('Singup Routes', () => {
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

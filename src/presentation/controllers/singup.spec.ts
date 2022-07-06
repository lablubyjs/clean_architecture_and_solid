import { SingUpController } from './singup'

describe('SingUp Controller', () => {
  test('should return 400 if no name provided ', () => {
    const sut = new SingUpController()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})

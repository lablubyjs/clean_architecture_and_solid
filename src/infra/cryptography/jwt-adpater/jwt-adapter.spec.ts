import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  test('should call sing with correct values', async () => {
    const sut = makeSut()
    const singSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(singSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('should return a token on sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  test('should throw if sing throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})

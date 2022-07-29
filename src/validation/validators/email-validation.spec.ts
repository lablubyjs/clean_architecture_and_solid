import { EmailValidation } from './email-validation'
import { EmailValidator } from '@/validation/protocols'
import { mockEmailValidator } from '../test'
import { throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/errors'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email@email.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  test('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(throwError)
    expect(sut.validate).toThrow()
  })

  test('should return InvalidParamError if email not is valid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(null)
    const isValid = sut.validate({ email: 'any_email@email.com' })
    expect(isValid).toEqual(new InvalidParamError('email'))
  })

  test('should return null if EmailValidator success', () => {
    const { sut } = makeSut()
    const isValid = sut.validate({ email: 'any_email@email.com' })
    expect(isValid).toBeNull()
  })
})

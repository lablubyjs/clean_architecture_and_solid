import { makeSingUpValidation } from './signup-validation-factory'
import { RequiredFieldValidation, ValidationComposite, CompareFieldsValidation, EmailValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { mockEmailValidator } from '@/validation/test'

jest.mock('../../../../../validation/validators/validation-composite')

describe('SingUpValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSingUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})

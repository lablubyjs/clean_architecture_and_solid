import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { SingUpController } from '../../presentation/controllers/singup/singup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { BcryptAdapter } from '../../infra/cryptography/brycpt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeSingUpController = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const singUpController = new SingUpController(emailValidator, addAccount)
  return new LogControllerDecorator(singUpController)
}

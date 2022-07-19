import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepositoryStub: AddAccountRepository

  constructor (hasher: Hasher, addAccountRepositoryStub: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepositoryStub = addAccountRepositoryStub
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassoword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepositoryStub.add(Object.assign({}, accountData, { password: hashedPassoword }))
    return account
  }
}

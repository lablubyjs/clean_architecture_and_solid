import { SurveyMongoRepository, MongoHelper } from '@/infra/db'
import { mockAddSurveyParams, mockAddAccountParams } from '@/../tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'
import objectid from 'objectid'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return res.insertedId.toString()
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveysResult')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(mockAddSurveyParams())
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('should load all surveys on success', async () => {
      const accountId = await mockAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const survey = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('should load empty list', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(res.insertedId.toString())
      expect(survey).toBeTruthy()
    })

    test('should return null if survey does not exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(objectid())
      expect(survey).toBeNull()
    })
  })

  describe('checkById()', () => {
    test('should return true if survey exists', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const exists = await sut.checkById(res.insertedId.toString())
      expect(exists).toBe(true)
    })

    test('should return true if survey exists', async () => {
      await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const exists = await sut.checkById(objectid())
      expect(exists).toBe(false)
    })
  })

  describe('loadAnswers()', () => {
    test('should load answers on success', async () => {
      const survey = mockAddSurveyParams()
      const res = await surveyCollection.insertOne(survey)
      const sut = makeSut()
      const answers = await sut.loadAnswers(res.insertedId.toString())
      expect(answers).toEqual([survey.answers[0].answer, survey.answers[1].answer])
    })

    test('should empty array if survey does not exists', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(objectid())
      expect(answers).toEqual([])
    })
  })
})

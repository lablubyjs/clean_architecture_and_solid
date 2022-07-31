import { SaveSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError, ok } from '@/presentation/helpers'
import { SaveSurveyResultSpy, LoadAnswersBySurveySpy } from '@/../tests/presentation/mocks'
import { throwError } from '@/../tests/domain/mocks'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'

const mockRequest = (answer: string = null): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  answer,
  accountId: faker.datatype.uuid()
})

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurvey: LoadAnswersBySurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurvey = new LoadAnswersBySurveySpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(loadAnswersBySurvey, saveSurveyResultSpy)
  return {
    sut,
    loadAnswersBySurvey,
    saveSurveyResultSpy
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurvey } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadAnswersBySurvey.id).toBe(request.surveyId)
  })

  test('should return 403 if LoadAnswersBySurvey returns empty array', async () => {
    const { sut, loadAnswersBySurvey } = makeSut()
    loadAnswersBySurvey.result = []
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurvey } = makeSut()
    jest.spyOn(loadAnswersBySurvey, 'loadAnswers').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurvey } = makeSut()
    const request = mockRequest(loadAnswersBySurvey.result[0])
    await sut.handle(request)
    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      date: new Date(),
      answer: request.answer
    })
  })

  test('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurvey } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError)
    const request = mockRequest(loadAnswersBySurvey.result[0])
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurvey } = makeSut()
    const request = mockRequest(loadAnswersBySurvey.result[0])
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.result))
  })
})

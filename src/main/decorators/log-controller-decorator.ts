import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogErrorRepository } from '@/data/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly logErrorRespository: LogErrorRepository) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRespository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}

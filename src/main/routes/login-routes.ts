import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSingUpController } from '../factories/signup/signup-factory'

export default (router: Router): void => {
  router.post('/singup', adaptRoute(makeSingUpController()))
}

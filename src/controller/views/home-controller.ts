import {Request, Response, Router} from 'express'

import {sampleRoute} from '../../json'

const homeRouter: Router = Router({mergeParams: true})

homeRouter.get('/', async function (_: Request, res: Response) {
  res.render('Home', {route: sampleRoute})
})

export {homeRouter}

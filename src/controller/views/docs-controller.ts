import {Request, Response, Router} from 'express'

const docsRouter: Router = Router({mergeParams: true})

docsRouter.get('/', async function (_: Request, res: Response) {
  res.render('Docs')
})

export {docsRouter}

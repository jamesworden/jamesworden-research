import {Request, Response} from 'express'

const express = require('express')
const routes = express.Router({mergeParams: true})

routes.get('/', async function (_req: Request, res: Response) {
  res.render('Home')
})

routes.get('/docs', async function (_req: Request, res: Response) {
  res.render('Docs')
})

routes.get('/schedule', async function (_req: Request, res: Response) {
  res.render('Schedule')
})

export default routes

import cors from 'cors'
import { json, urlencoded } from 'express'
import compression from 'compression'
import { requestIdMiddleware } from './request-id.js'


export const configureMiddleware = app => {
  app.use(cors())
  app.use(json())
  app.use(compression())
  app.use(requestIdMiddleware)
  app.use(urlencoded({ extended: true }))
  app.set('trust proxy', true)

  app.use((req, res, next) => {
    req.feathers.req = req
    next()
  })
}

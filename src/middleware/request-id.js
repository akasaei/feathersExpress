import { v4 as uuidv4 } from 'uuid'

export const requestIdMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || req.headers['x-transaction-id'] || uuidv4()
  req.feathers.requestId = requestId
  req.headers['x-request-id'] = requestId
  res.setHeader('x-request-id', requestId)
  next()
}

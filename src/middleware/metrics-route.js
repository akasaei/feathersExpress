import { register } from '../metrics.js'

export const metricsMiddleware = (req, res) => {
  res.set('Content-Type', register.contentType)
  register.metrics().then(metrics => {
    res.end(metrics)
  })
}

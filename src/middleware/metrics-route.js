import { register,requestCounter } from '../metrics.js'

export const metricsMiddleware = (req, res) => {
  res.set('Content-Type', register.contentType)
  register.metrics().then(metrics => {
    res.end(metrics)
  })
}

export const requestMetricsMiddleware = (req, res, next) => {
  res.on('finish', () => {
    requestCounter.inc({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode
    });
  });
  next();
};
import client from 'prom-client'

export const register = new client.Registry()

// Optional: collect default metrics like memory, CPU, etc.
client.collectDefaultMetrics({ register })

// Define custom metrics
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5] // seconds
})
register.registerMetric(httpRequestDurationMicroseconds)

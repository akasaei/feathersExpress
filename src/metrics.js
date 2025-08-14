import client from 'prom-client'

export const register = new client.Registry()

// Optional: collect default metrics like memory, CPU, etc.
client.collectDefaultMetrics({ register })

export const requestCounter = new client.Counter({
  name: 'feathers_requests_total',
  help: 'Total number of HTTP requests handled by Feathers',
  labelNames: ['method', 'path', 'resultSize']
});

export const functionResultSize = new client.Histogram({
  name: 'function_result_bytes',
  help: 'Size of result returned by function in bytes',
  labelNames: ['method', 'path'],
  buckets: [100, 1024, 10 * 1024, 100 * 1024, 1024 * 1024],
  registers: [register]
})

register.registerMetric(functionResultSize)

export const serviceCallCounter = new client.Counter({
  name: 'feathers_service_calls_total',
  help: 'Total number of Feathers service method calls',
  labelNames: ['service', 'method', 'status']
});

register.registerMetric(serviceCallCounter)

export const functionDuration = new client.Histogram({
  name: 'function_call_duration_seconds',
  help: 'Execution time of Feathers service method calls in seconds',
  labelNames: ['service', 'method', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1]
});

register.registerMetric(functionDuration)



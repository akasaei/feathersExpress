import { httpRequestDurationMicroseconds } from '../metrics.js'

export const prometheusHook = async (context, next) => {
  const start = process.hrtime()

  try {
    await next()
  } finally {
    const duration = process.hrtime(start)
    const durationInSeconds = duration[0] + duration[1] / 1e9

    httpRequestDurationMicroseconds
      .labels(context.method.toUpperCase(), context.path, context.http?.status || 200)
      .observe(durationInSeconds)
  }

  return context
}

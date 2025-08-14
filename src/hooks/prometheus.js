import { serviceCallCounter, functionDuration, functionResultSize } from '../metrics.js'

export const prometheusHook = async (context, next) => {
  const start = process.hrtime()

  try {
    await next()
    serviceCallCounter.inc({
      service: context.path,
      method: context.method,
      status: 'success'
    });
  } catch (error) {
    serviceCallCounter.inc({
      service: context.path,
      method: context.method,
      status: 'error'
    })
    throw error;
  } finally {
    const duration = process.hrtime(start)
    const durationInSeconds = duration[0] + duration[1] / 1e9
    const responseSize=Buffer.byteLength(JSON.stringify(context.result));
    functionDuration
      .labels(context.path, context.method, context.http?.status || 200)
      .observe(durationInSeconds);
    functionResultSize
      .labels({
        path: context.path,
        method: context.method,
      })
      .observe(responseSize);
  }

  return context
}

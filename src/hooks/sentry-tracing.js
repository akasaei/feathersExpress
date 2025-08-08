// hooks/sentry-tracing.js
import * as Sentry from '@sentry/node'

export const sentryTracingHook = async (context, next) => {
  const transaction = Sentry.getCurrentHub().getScope()?.getTransaction()

  if (transaction) {
    const span = transaction.startChild({
      op: `${context.path}.${context.method}`,
      description: `${context.method.toUpperCase()} ${context.path}`
    })

    await next() // run the actual service call

    span.finish()
  } else {
    await next()
  }

  return context
}

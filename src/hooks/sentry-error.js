// hooks/sentry-error.js
import * as Sentry from '@sentry/node'
import { getSensitiveFields, filterSensitive } from '../utils/filterSensitive.js'

export const sentryErrorHook = async context => {
  const error = context.error
  const req = context.params?.req

  // Set context
  Sentry.withScope(scope => {
    if (context.params?.user) {
      scope.setUser({
        email: context.params.user.email,
        id: context.params.user._id
      })
    }
    const sensitiveFields = getSensitiveFields()
    const query = filterSensitive(context.params?.query, sensitiveFields)
    const headers = filterSensitive(req?.headers, sensitiveFields)
    scope.setExtras({
      ip: req?.ip,
      method: context.method,
      service: context.path,
      query: query,
      headers: headers,
      errorData: error?.data,
      errorMessage: error?.message,
      stack: error?.stack
    })
    scope.setTag('request_id', req?.feathers?.requestId)
    Sentry.captureException(error)
  })

  return context
}

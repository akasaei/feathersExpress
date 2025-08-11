import { makeLogHook } from './hooks/make-log-hook.js'
import { logger } from './logger.js'
import { prometheusHook } from './hooks/prometheus.js'
import { sentryErrorHook } from './hooks/sentry-error.js'

function levelSelector(context) {
  if (context.error) return 'error'
  if (context.method === 'find') return 'debug'
  return 'info'
}
const logHook = makeLogHook({ logger, extraSensitiveFields: ['apiKey'], levelSelector })

export const hooks = {
  around: {
    all: [prometheusHook, logHook]
  },
  before: {},
  after: {},
  error: { all: [sentryErrorHook] }
}

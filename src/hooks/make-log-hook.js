// src/hooks/make-log-hook.js
import { getSensitiveFields, filterSensitive } from '../utils/filterSensitive.js'

/**
 * Creates a Feathers around hook that logs with Winston and supports conditional log levels.
 *
 * @param {object} options
 * @param {import('winston').Logger} options.logger - Winston logger instance
 * @param {string[]} [options.extraSensitiveFields] - Additional sensitive fields to mask
 * @param {(context: any) => 'info' | 'debug' | 'error' | 'warn'} [options.levelSelector] - Function to decide log level based on context
 * @returns {function} Feathers around hook function
 */
export function makeLogHook({ logger, extraSensitiveFields = [], levelSelector = context => 'info' } = {}) {
  return async function logHook(context, next) {
    const start = Date.now()

    await next() // Proceed with service method

    const duration = Date.now() - start

    const baseSensitive = getSensitiveFields()
    const sensitiveFields = [...baseSensitive, ...extraSensitiveFields]

    const safeData = filterSensitive(context.data, sensitiveFields)
    const safeResult = filterSensitive(context.result, sensitiveFields)

    const req = context.params?.req
    const ip =
      req?.ip ||
      req?.headers?.['x-forwarded-for'] ||
      req?.connection?.remoteAddress ||
      context.params?.connection?.remoteAddress ||
      'NA'
    const requestId = context.params?.req?.feathers?.requestId || 'NA'
    const logEntry = {
      timestamp: new Date().toISOString(),
      duration,
      requestId: requestId,
      method: context.method,
      service: context.path,
      user: context.params.user?.email || 'NA',
      ip
    }
    const metaEntry = {
      query: context.id || context.params.query,
      data: safeData,
      result: safeResult
    }
    const level = levelSelector(context)

    if (typeof logger[level] === 'function') {
      logger[level](logEntry, metaEntry)
    } else {
      logger.info(logEntry) // fallback
    }

    return context
  }
}

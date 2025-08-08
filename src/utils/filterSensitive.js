// utils/filterSensitive.js
import { loggingConfig } from './config-loader.js'

const systemSensitiveFields = [
  'password',
  /^.*token$/i,
  /^authorization$/i
]

/**
 * merge configured sensitive fields with system default fields
 */
export function getSensitiveFields() {
  let userDefined = loggingConfig?.sensitiveFields.split(',')

  const normalizedUserFields = userDefined.map(field => {
    try {
      if (typeof field === 'string' && (field.startsWith('^') || field.endsWith('$'))) {
        return new RegExp(field, 'i')
      }
      return field
    } catch {
      return field
    }
  })

  return [...systemSensitiveFields, ...normalizedUserFields]
}

/**
 * mask part of the string instead of returning fixed value e.g., "ab***z"
 */
function maskValue(value) {
  if (typeof value === 'string') {
    return value.length <= 4 ? '***' : value.slice(0, Math.floor(Math.log(value.length))) + '***' + value.slice(-1)
  }
  return '***'
}

/**
 * Check if key matches a sensitive field or regex
 */
function isSensitive(key, sensitiveFields = getSensitiveFields()) {
  return sensitiveFields.some(pattern => {
    if (typeof pattern === 'string') return pattern === key
    if (pattern instanceof RegExp) return pattern.test(key)
    return false
  })
}
/**
 * Recursively mask sensitive fields in an object
 * @param {Object|Array} obj - The object to filter
 * @param {string[]} sensitiveFields - Keys to mask
 * @returns {Object|Array} - A copy of the object with sensitive fields masked
 */
export function filterSensitive(obj, sensitiveFields = getSensitiveFields()) {
  if (Array.isArray(obj)) {
    return obj.map(item => filterSensitive(item, sensitiveFields));
  }

  if (obj && typeof obj === 'object') {
    const result = {}

    for (const [key, value] of Object.entries(obj)) {
      if (isSensitive(key, sensitiveFields)) {
        result[key] = maskValue(value)
      } else if (typeof value === 'object' && value !== null) {
        result[key] = filterSensitive(value, sensitiveFields)
      } else {
        result[key] = value
      }
    }

    return result
  }

  return obj
}

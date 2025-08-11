// services/health-check.js (or wherever your health check lives)
import { getDb } from '../../database/mongo-db.js'

export async function healthCheck(app) {
  const results = await Promise.allSettled([
    // MongoDB ping
    getDb(app)
      .then(db => db.admin().ping())
      .then(() => ({ mongo: 'ok' }))
      .catch(err => ({ status: 'error', error: err.message })),
    Promise.resolve({ uptime: process.uptime() }),
    Promise.resolve({ memory: process.memoryUsage().rss })
    // Add other service pings here, e.g.,
    // someOtherService.ping().then(() => ({ other: 'ok' })),
  ])

  // Format results: fulfilled => value, rejected => error message
  const status = results.reduce((acc, res) => {
    if (res.status === 'fulfilled') {
      return { ...acc, ...res.value }
    } else {
      return { ...acc, error: res.reason?.message || 'unknown error' }
    }
  }, {})

  // add overall status
  const overallStatus = Object.values(status).every(s => s !== 'error') ? 'ok' : 'error'

  return {
    status: overallStatus,
    details: status
  }
}

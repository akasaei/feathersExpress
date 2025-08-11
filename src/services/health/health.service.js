import { HealthService } from './health.class.js'

export const health = app => {
  app.use('/health', new HealthService(app))

  app.service('health').hooks({
    before: {
      find(context) {
        // Optionally add auth, logging, etc
        return context
      }
    },
    after: {
      find(context) {
        const code = context.result?.status === 'ok' ? 200 : 500
        context.statusCode = code
        context.status = code
        return context
      }
    }
  })
}

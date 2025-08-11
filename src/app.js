// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, { serveStatic, notFound, errorHandler } from '@feathersjs/express'
import { loadAppConfig } from './config/index.js'
import { logger } from './logger.js'
import { metricsMiddleware } from './middleware/metrics-route.js'
import { configureMiddleware } from './middleware/index.js'
import { mongodb } from './database/mongodb.js'
import { authentication } from './authentication.js'
import { services } from './services/index.js'
import { hooks as globalHooks } from './app.hooks.js'
import { lifecycleHooks } from './app.lifecycle.js'
import { initSentry } from './monitoring/sentry.js'

// Core app setup
const app = express(feathers())

// monitoring
initSentry()

// App Configuration
app.configure(loadAppConfig)

// Middleware
app.configure(configureMiddleware) // Middleware configuration
app.use('/metrics', metricsMiddleware) // Prometheus service
app.use('/', serveStatic(app.get('public'))) // Public service

// 🔌 Core plugins
app.configure(express.rest())
app.configure(mongodb)
app.configure(authentication)
app.configure(services)

// Error handling
app.use(notFound())
app.use(errorHandler({ logger }))

// app hooks
app.hooks(globalHooks) // global before/after/around/error hooks
app.hooks(lifecycleHooks) // setup & teardown hooks

export { app }

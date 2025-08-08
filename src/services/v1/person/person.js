// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  personDataValidator,
  personPatchValidator,
  personQueryValidator,
  personResolver,
  personExternalResolver,
  personDataResolver,
  personPatchResolver,
  personQueryResolver
} from './person.schema.js'
import { PersonService, getOptions } from './person.class.js'

export const personPath = '/v1/person'
export const personMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './person.class.js'
export * from './person.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const person = app => {
  // Register our service on the Feathers application
  app.use(personPath, new PersonService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: personMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(personPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(personExternalResolver),
        schemaHooks.resolveResult(personResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(personQueryValidator), schemaHooks.resolveQuery(personQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(personDataValidator), schemaHooks.resolveData(personDataResolver)],
      patch: [schemaHooks.validateData(personPatchValidator), schemaHooks.resolveData(personPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

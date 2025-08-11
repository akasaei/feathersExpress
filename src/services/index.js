import { user } from './users/users.js'
import { person } from './v1/person/person.js'
import { health } from './health/health.service.js'

export const services = app => {
  app.configure(user)

  app.configure(person)

  app.configure(health)

  // All services will be registered here
}

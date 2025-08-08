import { user } from './users/users.js'
import { person } from './v1/person/person.js'
export const services = app => {
  app.configure(user)

  app.configure(person)

  // All services will be registered here
}

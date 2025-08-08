import configuration from '@feathersjs/configuration'
import { configurationValidator } from './configuration.js'

export const loadAppConfig = app => {
  app.configure(configuration(configurationValidator))
}

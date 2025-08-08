// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../../src/app.js'

describe('/v1/person service', () => {
  it('registered the service', () => {
    const service = app.service('/v1/person')

    assert.ok(service, 'Registered the service')
  })
})

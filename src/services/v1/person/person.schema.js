// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../../validators.js'

// Main data model schema
export const personSchema = {
  $id: 'Person',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'name'],
  properties: {
    _id: ObjectIdSchema(),
    text: { type: 'string' },
    name: { type: 'string' }
  }
}
export const personValidator = getValidator(personSchema, dataValidator)
export const personResolver = resolve({})

export const personExternalResolver = resolve({})

// Schema for creating new data
export const personDataSchema = {
  $id: 'PersonData',
  type: 'object',
  additionalProperties: false,
  required: ['name'],
  properties: {
    ...personSchema.properties
  }
}
export const personDataValidator = getValidator(personDataSchema, dataValidator)
export const personDataResolver = resolve({})

// Schema for updating existing data
export const personPatchSchema = {
  $id: 'PersonPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...personSchema.properties
  }
}
export const personPatchValidator = getValidator(personPatchSchema, dataValidator)
export const personPatchResolver = resolve({})

// Schema for allowed query properties
export const personQuerySchema = {
  $id: 'PersonQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(personSchema.properties)
  }
}
export const personQueryValidator = getValidator(personQuerySchema, queryValidator)
export const personQueryResolver = resolve({})

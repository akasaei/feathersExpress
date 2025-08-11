// this is db object and not a promise as configured in mongodb.js
// to do: this is parallel connection and later we need to remove one and keep the others
// database/mongodb.js
import { MongoClient } from 'mongodb'

let dbInstance

export async function getDb(app) {
  if (dbInstance) return dbInstance

  // Read connection string from config
  const connectionString = app.get('mongodb')
  console.log(connectionString)
  const databaseName = new URL(connectionString).pathname.substring(1)
  console.log(databaseName)
  const client = await MongoClient.connect(connectionString)

  dbInstance = client.db(databaseName)
  return dbInstance
}

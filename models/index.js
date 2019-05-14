const { MongoClient } = require('mongodb')

const Employee = require('./employee')

const models = {}

module.exports = {
  async connect (uri) {
    try {
      const dbClient = (await MongoClient.connect(uri, {
        useNewUrlParser: true
      })).db()

      models['employee'] = new Employee(dbClient)
    }
    catch (error) {
      console.error(error)
    }
  },
  models
}
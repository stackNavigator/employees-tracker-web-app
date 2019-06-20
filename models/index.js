const { MongoClient } = require('mongodb')

const Employee = require('./employee')
const User = require('./user')

const models = {}

module.exports = {
  async connect (uri) {
    try {
      const dbClient = (await MongoClient.connect(uri, {
        useNewUrlParser: true
      })).db()

      models['employee'] = new Employee(dbClient)
      models['user'] = new User(dbClient)
    }
    catch (error) {
      console.error(error)
    }
  },
  models
}
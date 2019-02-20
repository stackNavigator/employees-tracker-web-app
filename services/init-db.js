const { MongoClient } = require('mongodb')

module.exports = {
  async connectToDb(uri, dbName) {
    try {
      const mongoClient = await MongoClient.connect(uri, {
        useNewUrlParser: true
      })
      return mongoClient.db(dbName)
    }
    catch (err) {
      console.log(err)
    }
  }
}
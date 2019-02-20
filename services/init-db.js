const { MongoClient } = require('mongodb')

let db = null

const connect = async (uri, dbName) => {
  try {
    const mongoClient = await MongoClient.connect(uri, {
      useNewUrlParser: true
    })
    db = mongoClient.db(dbName)
  }
  catch (err) {
    console.log(err)
  }
}

const getDbInstance = () => db

module.exports = {
  getDbInstance,
  connect
}
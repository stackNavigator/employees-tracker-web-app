module.exports = class {
  constructor (dbClient, collectionName) {
    this.dbClient = dbClient
    this.collectionName = collectionName
  }

  async createIndexes(indexes) {
    try {
      return await this.dbClient.collection(this.collectionName)
        .createIndex(indexes, {
          unique: true
        })
    }
    catch (error) {
      console.log(error)
    }
  }

  async getDocs () {
    try {
      return await this.dbClient.collection(this.collectionName)
        .find()
        .toArray()
    }
    catch (error) {
      console.error(error)
    }
  }
  async addDoc (doc) {
    try {
      return (await this.dbClient.collection(this.collectionName)
        .insertOne(doc)).insertedId
    }
    catch (error) {
      console.error(error)
    }
  }
}
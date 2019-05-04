module.exports = class {
  constructor (dbClient, collectionName) {
    this.dbClient = dbClient
    this.collectionName = collectionName
  }

  async getEmployees () {
    try {
      const employees = await this.dbClient.collection('employees')
        .find()
        .toArray()
      return employees
    }
    catch (error) {
      console.error(error)
    }
  }
  async addEmployee (doc) {
    try {
      return (await this.dbClient.collection('employees')
        .insertOne(doc)).insertedId
    }
    catch (error) {
      console.error(error)
    }
  }
}
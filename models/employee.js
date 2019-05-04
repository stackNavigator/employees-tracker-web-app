module.exports = class {
  constructor (dbClient) {
    this.dbClient = dbClient.collection('employees')
  }

  async initIndexes () {
    try {
      await this.dbClient.createIndex({
        personnelName: 1 
      }, {
        unique: true
      })
    }
    catch (error) {
      console.error(error)
    }
  }

  async getEmployees () {
    try {
      return await this.dbClient.find()
        .toArray()
    }
    catch (error) {
      console.error(error)
    }
  }
}
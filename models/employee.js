module.exports = class {
  constructor (dbClient) {
    this.dbClient = dbClient.collection('employees')
  }

  async initIndexes () {
    await this.dbClient.createIndex({
      personnelName: 1 
    }, {
      unique: true
    })
  }

  async getEmployees () {
    return await this.dbClient.find()
      .toArray()
  }
}
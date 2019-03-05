module.exports = {
  async getEmployees(dbClient) {
    try {
      const employees = await dbClient.collection('employees')
        .find()
        .skip(0)
        .limit(0)
        .toArray()
      return employees
    }
    catch (err) {
      console.log(err)
    }
  },
  async addEmployee (dbClient, doc) {
    try {
      return (await dbClient.collection('employees')
        .insertOne(doc)).insertedId
    }
    catch (err) {
      console.log(err)
    }
  }
}
const { copyFile, normalizeFilePath, createFilePath } = require('../services/file-manager')

module.exports = {
  async getEmployees(dbClient) {
    try {
      const employees = await dbClient.collection('employees')
        .find()
        .skip(0)
        .limit(0)
        .toArray()
      normalizeFilePath(employees)
      return employees
    }
    catch (err) {
      console.log(err)
    }
  },
  async addEmployee (dbClient, doc) {
    try {
      const { path, name } = doc.image
      const uploadPath = createFilePath(name)
      doc.image = uploadPath
      copyFile(path, uploadPath)
      return (await dbClient.collection('employees')
        .insertOne(doc)).insertedId
    }
    catch (err) {
      console.log(err)
    }
  }
}
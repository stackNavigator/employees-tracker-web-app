const { handleError, NotFoundError } = require('../services/handle-errors')

module.exports = class {
  constructor (dbClient) {
    this.dbClient = dbClient.collection('employees')
    this.pageLimit = 20
  }

  async initIndexes () {
    await this.dbClient.createIndex({
      personnelName: 1 
    }, {
      unique: true
    })
  }

  async _getEmployees (page) {
    return await this.dbClient.find()
      .skip((page - 1) * this.pageLimit)
      .limit(this.pageLimit)
      .toArray()
  }

  getEmployees () {
    return async (req, res) => {
      try {
        const { query: { page } } = req
        return res.status(200).json({
          employees: await this._getEmployees(page)
        })
      }
      catch (error) {
        handleError(error, res)
      }
    }
  }

  async _getEmployee (query) {
    const doc = await this.dbClient.findOne(query)
    if (!doc) throw new NotFoundError('Employee was not found.')
    return doc
  }

  getEmployee() {
    return async (req, res) => {
      try {
        const { query: { query } } = req
        return res.status(200).json({
          employee: await this._getEmployee({
            $or: [
              { name: query },
              { surname: query }
            ]
          })
        })
      }
      catch (error) {
        handleError(error, res)
      }
    }
  }
}
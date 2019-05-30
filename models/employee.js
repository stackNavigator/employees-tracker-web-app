const { ObjectId } = require('mongodb')

const { NotFoundError } = require('../services/handle-errors')

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
      .sort({ personnelName: 1 })
      .toArray()
  }

  getEmployees () {
    return async (req, res, next) => {
      try {
        const { query: { page } } = req
        return res.status(200).json({
          employees: await this._getEmployees(page)
        })
      }
      catch (error) {
        next(error)
      }
    }
  }

  async _getEmployee (query) {
    const doc = await this.dbClient.findOne(query)
    if (!doc) throw new NotFoundError('Employee was not found.')
    return doc
  }

  getEmployee () {
    return async (req, res, next) => {
      try {
        const { query: { query } } = req
        return res.status(200).json({
          employee: await this._getEmployee({
            $or: [
              { name: query },
              { personnelName: query }
            ]
          })
        })
      }
      catch (error) {
        next(error)
      }
    }
  }

  async _createEmployee (payload, file) {
    const { path } = file
    const { insertedId } = await this.dbClient.insertOne({
      profilePic: path,
      ...payload
    })
    return insertedId
  }

  createEmployee () {
    return async (req, res, next) => {
      try {
        return res.status(201).json({
          message: 'Employee was successfully created.',
          id: await this._createEmployee(req.body, req.file)
        })
      }
      catch (error) {
        next(error)
      }
    }
  }

  async _updateEmployee (id, payload, file) {
    const doc = await this.dbClient.findOne({ _id: ObjectId(id) })
    if (!doc) throw new NotFoundError('Employee was not found.')
    let profilePic = null
    if (file) {
      profilePic = file.path
      //delete old file
    }
    else {
      profilePic = doc.profilePic
    }
    await this.dbClient.updateOne({
      _id: ObjectId(id)
    }, {
      $set: {
        ...payload,
        profilePic
      }
    })
    return id
  }

  updateEmployee () {
    return async (req, res, next) => {
      try {
        const { params: { id } } = req
        return res.status(200).json({
          message: 'Employee was successfully updated.',
          id: await this._updateEmployee(id, req.body, req.file)
        })
      }
      catch (error) {
        next(error)
      }
    }
  }
}
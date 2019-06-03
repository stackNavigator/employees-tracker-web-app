const { ObjectId } = require('mongodb')

const { NotFoundError, ValidationError } = require('../services/handle-errors')
const { validate } = require('../services/validator')
const employeeSchemas = {
  patch: 'employees-tracker/employee-patch'
}

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
    if (!file) throw new ValidationError('File was not included.')
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
    if (file) {
      payload.profilePic = file.path
      //delete old file
    }
    else {
      const validatedPayload = await validate(employeeSchemas.patch, payload)
      if (Array.isArray(validatedPayload)) 
        throw new ValidationError(validatedPayload)
    }
    await this.dbClient.updateOne({
      _id: ObjectId(id)
    }, {
      $set: {
        ...payload
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

  async _removeEmployee (id) {
    const doc = await this.dbClient.findOne({ _id: ObjectId(id) })
    if (!doc) throw new NotFoundError('Employee was not found.')
    //delete old file
    await this.dbClient.deleteOne({ _id: ObjectId(id) })
    return true
  }

  removeEmployee () {
    return async (req, res, next) => {
      try {
        const { params: { id } } = req
        if (await this._removeEmployee(id))
          return res.status(204).end()
      }
      catch (error) {
        next(error)
      }
    }
  }
}
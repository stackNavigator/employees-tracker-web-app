const { ObjectId } = require('mongodb')

const { NotFoundError, ValidationError } = require('../services/handle-errors')
const { deleteEmployeeImage } = require('../services/file-manager')
const { getDate } = require('../services/date-formatter')
const { validate } = require('../services/validator')
const employeeSchemas = {
  patch: 'employees-tracker/employee-patch'
}

module.exports = class {
  constructor (dbClient) {
    this.dbClient = dbClient.collection('employees')
  }

  async _getEmployees (query) {
    const docs = await this.dbClient.find(query).toArray()
    if (!docs.length) throw new NotFoundError('Employee was not found.')
    return docs
  }

  getEmployees () {
    return async (req, res, next) => {
      try {
        const { query: { query } } = req
        return res.status(200).json({
          employee: await this._getEmployees({
            $or: [
              { surname: query },
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
    const { key } = file
    const { insertedId } = await this.dbClient.insertOne({
      profilePic: `https://employees-tracker-media.s3.amazonaws.com/profilePics/${key}`,
      ...payload,
      hasArrived: null,
      effectiveSchedule: []
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
      const { key } = file
      payload.profilePic = `https://employees-tracker-media.s3.amazonaws.com/profilePics/${key}`
      const { profilePic } = doc
      await deleteEmployeeImage(profilePic.slice(profilePic.lastIndexOf('/') + 1))
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
    const { profilePic } = doc
    await deleteEmployeeImage(profilePic.slice(profilePic.lastIndexOf('/') + 1))
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

  async _updateSchedule (id) {
    const doc = await this.dbClient.findOne({ _id: ObjectId(id) })
    if (!doc) throw new NotFoundError('Employee was not found.')
    const currentDate = new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Kiev'
    })
    const { hasArrived } = doc
    const [ fieldDate ] = hasArrived ? getDate(currentDate).split(',') : []
    fieldDate
    ? await this.dbClient.updateOne({ _id: ObjectId(id) },
      { $push: { effectiveSchedule: { key: new Date(currentDate),
        range: `${hasArrived}-${getDate(currentDate)}`} },
        $set: { hasArrived: null } })
    : await this.dbClient.updateOne({ _id: ObjectId(id) }, 
      { $set: { hasArrived: getDate(currentDate) } })
    return !hasArrived
  }

  updateSchedule () {
    return async (req, res, next) => {
      try {
        const { params: { id } } = req
        return res.status(200).json({
          message: 'Schedule was successfully updated.',
          hasArrived: await this._updateSchedule(id)
        })
      }
      catch (error) {
        next(error)
      }
    }
  }

  async _checkArrival (id) {
    const doc = await this.dbClient.findOne({ _id: ObjectId(id) })
    if (!doc) throw new NotFoundError('Employee was not found.')
    const { hasArrived } = doc
    return hasArrived ? true : false
  }

  checkArrival () {
    return async (req, res, next) => {
      try {
        const { params: { id } } = req
        return res.status(200).json({
          message: 'Employee arrival was checked.',
          hasArrived: await this._checkArrival(id)
        })
      }
      catch (error) {
        next(error)
      }
    }
  }

  async _formPersonalReport (id, fromDate, toDate) {
    const doc = await this.dbClient.findOne({ _id: ObjectId(id) })
    if (!doc) throw new NotFoundError('Employee was not found.')
    const castedFromDate = new Date(fromDate)
    const castedToDate = new Date(toDate)
    const newToDate = new Date(castedToDate.setDate(castedToDate.getDate() + 1))
    return await this.dbClient.aggregate([
      { $match: { _id: ObjectId(id) } },
      { $project: {
        effectiveSchedule: {
          $filter: {
            input: '$effectiveSchedule',
            as: 'date',
            cond: { 
              $and: [{ $gte: [ '$$date.key', castedFromDate ] }, { $lte: [ '$$date.key', newToDate ] }]
            }
          }
        }
      }}
    ]).toArray()
  }

  formPersonalReport () {
    return async (req, res, next) => {
      try {
        const { params: { id } } = req
        const { query: { fromDate, toDate } } = req
        return res.status(200).json({
          message: 'Personal report was sucessfully formed.',
          reportData: await this._formPersonalReport(id, fromDate, toDate)
        })
      }
      catch (error) {
        next(error)
      }
    }
  }
}
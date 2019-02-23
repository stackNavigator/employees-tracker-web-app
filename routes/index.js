const { Router } = require('express')

const employees = require('./employees')

module.exports = db => Router()
  .use('/employees', employees(db))
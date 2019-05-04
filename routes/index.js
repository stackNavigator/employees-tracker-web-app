const { Router } = require('express')

const employees = require('./employees')

module.exports = ({ employee }) => Router()
  .use('/employees', employees(employee))
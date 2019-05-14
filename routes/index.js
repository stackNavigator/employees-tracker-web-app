const { Router } = require('express')

const { models } = require('../models')

module.exports = () => {

  return Router()
    .get('/employees', models['employee'].getEmployees())
    .get('/employee', models['employee'].getEmployee())
}
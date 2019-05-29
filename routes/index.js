const { Router } = require('express')

const { models } = require('../models')
const { uploadOne } = require('../services/file-manager')

module.exports = () => {
  return Router()
    .get('/employees', models['employee'].getEmployees())
    .get('/employee', models['employee'].getEmployee())
    .post('/employees', uploadOne('profilePic'), models['employee'].createEmployee())
    .patch('/employee/:id', uploadOne('profilePic'), models['employee'].updateEmployee())
}
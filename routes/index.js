const { Router } = require('express')

const { models } = require('../models')
const { uploadEmployeeMedia } = require('../services/file-manager')

module.exports = () => {
  return Router()
    .get('/employees', models['employee'].getEmployees())
    .get('/employee', models['employee'].getEmployee())
    .post('/employees', uploadEmployeeMedia('profilePic'), models['employee'].createEmployee())
    .patch('/employee/:id', uploadEmployeeMedia('profilePic'), models['employee'].updateEmployee())
    .delete('/employee/:id', models['employee'].removeEmployee())
}
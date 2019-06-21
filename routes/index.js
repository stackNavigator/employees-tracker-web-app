const { Router } = require('express')

const { models } = require('../models')
const { uploadEmployeeImage } = require('../services/file-manager')
const { checkAuth } = require('../services/auth-guard')

module.exports = () => {
  return Router()
    .post('/signin', models['user'].signIn())
    .use(checkAuth())
    .get('/employees', models['employee'].getEmployees())
    .post('/employees', uploadEmployeeImage('profilePic'), models['employee'].createEmployee())
    .patch('/employee/:id', uploadEmployeeImage('profilePic'), models['employee'].updateEmployee())
    .delete('/employee/:id', models['employee'].removeEmployee())
    .post('/signup', models['user'].signUp())
    .delete('/users/:id', models['user'].removeUser())
}
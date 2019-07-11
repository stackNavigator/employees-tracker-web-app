const { Router } = require('express')

const { models } = require('../models')
const { uploadEmployeeImage } = require('../services/file-manager')
const { checkAuth, checkAccess } = require('../services/auth-guard')

module.exports = () => {
  return Router()
    .post('/signin', models['user'].signIn())
    .get('/check-access', checkAccess())
    .use(checkAuth())
    .get('/employees', models['employee'].getEmployees())
    .post('/employees', uploadEmployeeImage('profilePic'), models['employee'].createEmployee())
    .patch('/employee/:id', uploadEmployeeImage('profilePic'), models['employee'].updateEmployee())
    .delete('/employee/:id', models['employee'].removeEmployee())
    .patch('/employee/:id/schedule', models['employee'].updateSchedule())
    .post('/signup', models['user'].signUp())
    .delete('/users/:id', models['user'].removeUser())
}
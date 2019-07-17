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
    .patch('/schedule/:id/', models['employee'].updateSchedule())
    .get('/schedule/:id/check-arrival', models['employee'].checkArrival())
    .get('/employee/:id/personal-report', models['employee'].formPersonalReport())
    .post('/signup', models['user'].signUp())
    .delete('/users/:id', models['user'].removeUser())
}
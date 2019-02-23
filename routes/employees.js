const { Router } = require('express')

const { getEmployees } = require('../services/crud-db')

module.exports = db => Router()
  .get('/', async (_, res) => {
    return res.status(200).json({
      employees: await getEmployees(db)
    })
  })
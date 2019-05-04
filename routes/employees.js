const { Router } = require('express')

const { handleError } = require('../services/handle-errors')

module.exports = model => Router()
  .get('/', async (_, res) => {
    try {
      return res.status(200).json({
        employees: await model.getEmployees()
      })
    }
    catch (error) {
      handleError(error, res)
    }
  })
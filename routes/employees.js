const { Router } = require('express')

const { internalServerError } = require('../services/handle-errors')

module.exports = model => Router()
  .get('/', async (_, res) => {
    try {
      return res.status(200).json({
        employees: await model.getEmployees()
      })
    }
    catch (error) {
      internalServerError(error, res)
    }
  })
  .post('/', async (req, res) => {
    const { name, surname, secondName, position, profilePic } = req.body
    return res.status(201).json({
      insertedId: await addEmployee(db, {
        name,
        surname,
        secondName,
        position
      })
    })
  })
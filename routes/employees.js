const { Router } = require('express')

const { getEmployees, addEmployee } = require('../services/crud-db')

module.exports = db => Router()
  .get('/', async (_, res) => {
    return res.status(200).json({
      employees: await getEmployees(db)
    })
  })
  .post('/', async (req, res) => {
    const { name, surname, secondName, position } = req.body
    return res.status(201).json({
      insertedId: await addEmployee(db, {
        name,
        surname,
        secondName,
        position
      })
    })
  })
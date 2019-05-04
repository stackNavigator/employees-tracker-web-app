const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const { connectToDb } = require('./services/init-db')
const initRoutes = require('./routes')
const Employee = require('./models/employee')

;(async () => {
  try {
    require('dotenv').config()
    const { PORT, DB_URI } = process.env
    const db = await connectToDb(DB_URI)
    const employee = new Employee(db)
    employee.initIndexes()

    express()
      .use(cors())
      .disable('x-powered-by')
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(initRoutes({
        employee
      }))
      .use((_, res, __) => {
        return res.status(404).json({
          message: 'Resource was not found.'
        })
      })
      .listen(PORT, () => console.log(`Server successfully runs on port ${PORT}\n`))
  }
  catch (error) {
    console.error(error)
  }
})()
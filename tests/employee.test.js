const { connectToDb } = require('../services/init-db')

const Employee = require('../models/employee')

describe('Test employees model functionality.', () => {
  let employee = null
  beforeAll(async () => {
    require('dotenv').config()
    employee = new Employee(await connectToDb(process.env.DB_URI))
  })

  it('Should get all employees.', async () => {
    await expect(employee.getEmployees()).resolves.toBeInstanceOf(Array)
  })
})
const { connect, models } = require('../models')
const { NotFoundError } = require('../services/handle-errors')

describe('Test employees model functionality.', () => {
  beforeAll(async () => {
    require('dotenv').config()
    await connect(process.env.DB_URI)
  })

  it('Should get employees based on page.', async () => {
    await expect(models['employee']._getEmployees(1)).resolves.toHaveLength(1)
  })

  it('Tries to get employee by name or surname. Should throw not found error.', async () => {
    await expect(models['employee']._getEmployee({
      $or: [
        { name: 'Fake name' },
        { surname: 'Fake surname' }
      ]
    })).rejects.toThrowError(NotFoundError)
  })

  it('Should get employee by name or surname.', async () => {
    await expect(models['employee']._getEmployee({
      $or: [
        { name: 'Іван' },
        { surname: 'Петренко' }
      ]
    })).resolves.toBeInstanceOf(Object)
  })
})
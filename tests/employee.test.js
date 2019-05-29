const { ObjectId } = require('mongodb')

const { connect, models } = require('../models')
const { NotFoundError } = require('../services/handle-errors')

describe('Test employees model functionality.', () => {
  beforeAll(async () => {
    require('dotenv').config()
    await connect(process.env.DB_URI)
    await models['employee'].initIndexes()
    await models['employee'].dbClient.deleteMany()
  })

  it('Should create employee with given payload.', async () => {
    await expect(models['employee']._createEmployee({
       name: 'Семпл',
       surname: 'Семпленко',
       secondName: 'Семплович',
       position: 'Оператор семплів',
       personnelName: '1'
    }, {
      path: 'profilePics/pic1.jpg'
    })).resolves.toBeInstanceOf(ObjectId)
  })

  it('Tries to duplicate unique index on employee creation. Should throw error.', async () => {
    await expect(models['employee']._createEmployee({
      name: 'Рофл',
      surname: 'Рофланенко',
      secondName: 'Рофланович',
      position: 'Оператор мемів',
      personnelName: '1'
    }, {
      path: 'profilePics/pic2.jpg'
    })).rejects.toThrowError()
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
        { name: 'Семпл' },
        { personnelName: '1' }
      ]
    })).resolves.toBeInstanceOf(Object)
  })
})
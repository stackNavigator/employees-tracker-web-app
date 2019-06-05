const { ObjectId } = require('mongodb')

const { connect, models } = require('../models')
const { NotFoundError } = require('../services/handle-errors')

let idToUpdate = null

describe('Test employees model functionality.', () => {
  beforeAll(async () => {
    require('dotenv').config()
    await connect(process.env.DB_URI)
    await models['employee'].dbClient.deleteMany()
  })

  it('Should create employee with given payload.', async () => {
    idToUpdate = await models['employee']._createEmployee({
       name: 'Семпл',
       surname: 'Семпленко',
       secondName: 'Семплович',
       position: 'Оператор семплів',
       personnelName: '1'
    }, {
      path: 'profilePics/pic1.jpg'
    })
    expect(idToUpdate).toBeInstanceOf(ObjectId)
  })

  it('Should get employees based on page.', async () => {
    await expect(models['employee']._getEmployees(1)).resolves.toHaveLength(1)
  })

  it('Tries to get employee by surname or personnel name. Should throw not found error.', async () => {
    await expect(models['employee']._getEmployee({
      $or: [
        { surname: 'Fake name' },
        { personnelName: 'Fake personnel' }
      ]
    })).rejects.toThrowError(NotFoundError)
  })

  it('Should get employee by surname or personnel name.', async () => {
    await models['employee']._createEmployee({
      name: 'Рофл',
      surname: 'Семпленко',
      secondName: 'Рофлович',
      position: 'Оператор рофл',
      personnelName: '1'
    }, {
      path: 'profilePics/pic2.jpg'
    })
    await expect(models['employee']._getEmployee({
      $or: [
        { surname: 'Семпленко' },
        { personnelName: '1' }
      ]
    })).resolves.toBeInstanceOf(Object)
  })

  it ('Should update employee by payload and optionally by file.', async () => {
    await expect(models['employee']._updateEmployee(idToUpdate, {
      position: 'Змінена позиція'
    }, null)).resolves.toBeInstanceOf(ObjectId)
  })

  it('Should remove employee by id.', async () => {
    await expect(models['employee']._removeEmployee(idToUpdate))
      .resolves.toBe(true)
  })
})
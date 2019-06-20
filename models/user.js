const { ObjectId } = require('mongodb')

const { NotFoundError, ValidationError } = require('../services/handle-errors')

module.exports = class {
  constructor (dbClient) {
    this.dbClient = dbClient.collection('users')
  }

  async _signIn (payload) {
    const { username, password } = payload
  }

  signIn () {
    return async (req, res, next) => {
      try {
        const { body } = req
        return res.status(200).json({
          message: 'Sign in was successfull.',
          role: await _signIn(body)
        })
      }
      catch (error) {
        next(error)
      }
    }
  }
}
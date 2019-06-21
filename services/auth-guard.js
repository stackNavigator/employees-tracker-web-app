const jwt = require('jsonwebtoken')

const { models } = require('../models')
const { AuthorizationError } = require('../services/handle-errors')

module.exports = {
  checkAuth () {
    return async (req, _, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const { _id } = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        const role = await models['user'].getUserRole(_id)
        switch (true) {
          case role === 'guard' && req.path === '/employees' && req.method === 'GET':
            break;
          case role === 'hr' && req.path.startsWith('/employee'):
            break;
          case role === 'admin':
            break;
          default:
            throw new AuthorizationError()
        }
        next()
      }
      catch (error) {
        next(error)
      }
    }
  }
}
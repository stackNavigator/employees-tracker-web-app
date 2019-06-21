const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')

const { NotFoundError, ValidationError, UnprocessableEntity, 
  AuthorizationError } = require('../services/handle-errors')
const { validate } = require('../services/validator')
const userSchemas = {
  signUp: 'employees-tracker/user-signup',
  signIn: 'employees-tracker/user-signin'
}

module.exports = class {
  constructor (dbClient) {
    this.dbClient = dbClient.collection('users')
  }

  async _signUp (payload) {
    const validatedPayload = await validate(userSchemas.signUp, payload)
    if (Array.isArray(validatedPayload))
      throw new ValidationError(validatedPayload)
    const { username } = payload
    const existingUser = await this.dbClient.findOne({ username })
    if (existingUser) throw new UnprocessableEntity('Such user already exists.')
    const { password } = payload
    const hashedPassword = await bcrypt.hashSync(password, 10)
    payload.password = hashedPassword
    const { insertedId } = await this.dbClient.insertOne({
      ...payload
    })
    return insertedId
  }

  signUp () {
    return async (req, res, next) => {
      try {
        const { body } = req
        return res.status(201).json({
          message: 'User was successfully signed up.',
          id: await this._signUp(body)
        })
      }
      catch (error) {
        next(error)
      }
    }
  }

  async _signIn (payload) {
    const validatedPayload = await validate(userSchemas.signIn, payload)
    if (Array.isArray(validatedPayload))
      throw new ValidationError(validatedPayload)
    const { username } = payload
    const existingUser = await this.dbClient.findOne({ username })
    if (!existingUser) throw new NotFoundError('User was not found.')
    const { password } = payload
    if (!bcrypt.compareSync(password, existingUser.password)) throw new AuthorizationError()
    const { _id, role } = existingUser
    return {
      token: await jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: 60 }),
      role
    }
  }

  signIn () {
    return async (req, res, next) => {
      try {
        const { body } = req
        const { token, role } = await this._signIn(body)
        return res.status(200).json({
          message: 'User was successfully signed in.',
          token,
          role
        })
      }
      catch (error) {
        next(error)
      }
    }
  }

  async _removeUser (id) {
    const doc = await this.dbClient.findOne({ _id: ObjectId(id) })
    if (!doc) throw new NotFoundError('User was not found.')
    await this.dbClient.deleteOne({ _id: ObjectId(id) })
    return true
  }

  removeUser () {
    return async (req, res, next) => {
      try {
        const { params: { id } } = req
        if (await this._removeUser(id))
          return res.status(204).end()
      }
      catch (error) {
        next(error)
      }
    }
  }

  async getUserRole (id) {
    const user = await this.dbClient.findOne({ _id: ObjectId(id) })
    if (!user) throw new NotFoundError('User was not found.')
    const { role } = user
    return role
  }
}
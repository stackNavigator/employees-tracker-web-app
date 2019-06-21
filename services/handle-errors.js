class ValidationError extends Error {
  constructor (details) {
    super(JSON.stringify(details))
  }
}

class NotFoundError extends Error {
  constructor (details) {
    super(JSON.stringify(details))
  }
}

class UnsupportedMedia extends Error {
  constructor (details) {
    super(JSON.stringify(details))
  }
}

class UnprocessableEntity extends Error {
  constructor (details) {
    super(JSON.stringify(details))
  }
}

class AuthorizationError extends Error {
  constructor () {
    super(JSON.stringify('Authorization was failed.'))
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  UnsupportedMedia,
  UnprocessableEntity,
  AuthorizationError,
  handleErrors () {
    return (err, _, res, __) => {
      if (err instanceof ValidationError)
        return res.status(400).json({
          message: err.message
        })
      if (err instanceof NotFoundError)
        return res.status(404).json({
          message: err.message
        })
      if (err instanceof UnsupportedMedia)
        return res.status(415).json({
          message: err.message
        })
      if (err instanceof UnprocessableEntity)
        return res.status(422).json({
          message: err.message
        })
      if (err instanceof AuthorizationError)
        return res.status(401).json({
          message: err.message
        })
      if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
        return res.status(401).json({
          message: err.message
        })
      const { stack } = err
      return res.status(500).json({
        message: stack
      })
    }
  }
}
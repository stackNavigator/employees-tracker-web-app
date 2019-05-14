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

module.exports = {
  ValidationError,
  NotFoundError,
  handleError (err, res) {
    if (err instanceof ValidationError)
      return res.status(400).json({
        message: err.message
      })
    if (err instanceof NotFoundError)
      return res.status(404).json({
        message: err.message
      })
    const { stack } = err
    return res.status(500).json({
      message: stack
    })
  }
}
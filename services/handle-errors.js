class ValidationError extends Error {
  constructor (details) {
    super(JSON.stringify(details))
  }
}

module.exports = {
  ValidationError,
  handleError (err, res) {
    if (err instanceof ValidationError)
      return res.status(400).json({
        message: err
      })
    const { name, message } = err
    return res.status(500).json({
      message: `${name} occured with following message: ${message}`
    })
  }
}
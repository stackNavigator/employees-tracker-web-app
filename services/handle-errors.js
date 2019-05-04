module.exports = {
  internalServerError (err, res) {
    const { name, message } = err
    return res.status(500).json({
      message: `${name} occured with following message: ${message}`
    })
  }
}
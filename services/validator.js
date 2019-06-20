const ajv = require('ajv')()

ajv.addSchema([
  ...require('../validation/employee'),
  ...require('../validation/user')
])

module.exports = {
  async validate (path, doc) {
    const valid = await ajv.validate(path, doc)
    if (!valid) return ajv.errors
    return true
  }
}
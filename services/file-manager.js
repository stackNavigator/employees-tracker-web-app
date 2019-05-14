const awsMock = require('mock-aws-s3')

awsMock.config.basePath = './testMedia/buckets'
const params = { Bucket: 'testBucket' }
let s3 = null

module.exports = {
  async init() {
    try {
      s3 = awsMock.S3({
        params
      })
      await s3.createBucket(params)
    }
    catch (error) {
      console.error(error)
    }
  },
  s3
}
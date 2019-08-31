const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const bcrypt = require('bcrypt')

const { validate } = require('./validator')
const { ValidationError, UnsupportedMedia } = require('./handle-errors')
const employeeSchemas = {
  add: 'employees-tracker/employee-add',
  patch: 'employees-tracker/employee-patch'
}

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})
const employeeStorage = multerS3({
  s3,
  bucket: `${process.env.BUCKET_NAME}/profilePics`,
  acl: 'public-read',
  cacheControl: 'max-age=10',
  key: (_, file, cb) => {
    const { mimetype, originalname } = file
    const [ __, ext ] = mimetype.split('/')
    cb(null, `${bcrypt.hashSync(`${originalname}${Date.now()}`, 10).replace(/\//g, '')}.${ext}`)
  }
})
const employeeLimits = {
  fileSize: 1024 * 1024 * 3
}
const employeeFileFilter = async (req, file, cb) => {
  const { path, body, params: { id } } = req
  let payload = null
  if (path === '/employees')
    payload = await validate(employeeSchemas.add, body)
  if (path === `/employee/${id}`)
    payload = await validate(employeeSchemas.patch, body)
  if (Array.isArray(payload))
    return cb(new ValidationError(payload))
  const { mimetype } = file
  if (mimetype === 'image/jpg' || mimetype === 'image/jpeg' || mimetype === 'image/png')
    return cb(null, true)
  return cb(new UnsupportedMedia('Incorrect image format. You should use only .jpg, .jpeg or .png'))
}
const employeeImgUploader = multer({
  storage: employeeStorage,
  limits: employeeLimits,
  fileFilter: employeeFileFilter
})

module.exports = {
  uploadEmployeeImage (field) {
    return employeeImgUploader.single(field)
  },
  async deleteEmployeeImage (name) {
    await s3.deleteObject({
      Bucket: `${process.env.BUCKET_NAME}`,
      Key: `profilePics/${name}`
    }).promise()
  }
}
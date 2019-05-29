const multer = require('multer')
const bcrypt = require('bcrypt')

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, './profilePics')
  },
  filename: (_, file, cb) => {
    const { mimetype, originalname } = file
    const [ __, ext ] = mimetype.split('/')
    cb(null, `${bcrypt.hashSync(`${originalname}${Date.now()}`, 10).replace(/\//g, '')}.${ext}`)
  }
})
const limits = {
  fileSize: 3 * 1024 * 1024
}
const fileFilter = (_, file, cb) => {
  const { mimetype } = file
  if (mimetype === 'image/jpg' || mimetype === 'image/jpeg' || mimetype === 'image/png')
    cb(null, true)
  cb(null, false)
}
const imgUploader = multer({
  storage,
  limits,
  fileFilter
})

module.exports = {
  uploadOne (field) {
    return imgUploader.single(field)
  }
}
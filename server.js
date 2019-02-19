const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()
const { PORT } = process.env

express()
  .use(morgan('dev'))
  .use(cors())
  .disable('x-powered-by')
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true}))
  .use('/home', (_, res) => res.status(200).json({ message: 'nice!'}))
  .use((_, res, __) => {
    return res.status(404).json({
      message: 'Resource was not found.'
    })
  })
  .listen(PORT, err => {
    if (!err) {
      console.profile('rofl')
      console.log(`Server successfully runs on port ${PORT}\n`)
    }
  })

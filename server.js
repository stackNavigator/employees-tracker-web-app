const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const initRoutes = require('./routes')
const { connect, models } = require('./models')
const { init } = require('./services/file-manager')

;(async () => {
  try {
    require('dotenv').config()
    const { PORT, DB_URI } = process.env
    await connect(DB_URI)
    await init()
    await models['employee'].initIndexes()

    express()
      .use(cors())
      .disable('x-powered-by')
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(initRoutes())
      .use((_, res) => {
        return res.status(404).json({
          message: 'Resource was not found.'
        })
      })
      .listen(PORT, () => console.log(`Server successfully runs on port ${PORT}\n`))
  }
  catch (error) {
    console.error(error)
  }
})()
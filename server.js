const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const { connectToDb } = require('./services/init-db')
const initRoutes = require('./routes')

;(async () => {
  try {
    require('dotenv').config()
    const { PORT, DB_URI } = process.env
    const db = await connectToDb(DB_URI)
    
    express()
      .use(cors())
      .disable('x-powered-by')
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(initRoutes(db))
      .use((_, res, __) => {
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
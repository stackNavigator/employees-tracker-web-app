const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const { connectToDb } = require('./services/init-db')

;(async () => {
  try {
    const { PORT, DB_URI, DB_NAME } = process.env
    const db = await connectToDb(DB_URI, DB_NAME)
    const rofl = await db.collection('employees').countDocuments()

    express()
      .use(cors())
      .disable('x-powered-by')
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .get('/', (_, res) => res.status(200).json({ rofl }))
      .use((_, res, __) => {
        return res.status(404).json({
          message: 'Resource was not found.'
        })
      })
      .listen(PORT, err => {
        if (!err) {
          console.log(`Server successfully runs on port ${PORT}\n`)
        }
      })
  }
  catch (err) {
    console.log(err)
  }
})()
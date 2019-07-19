const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { join } = require('path')

const initRoutes = require('./routes')
const { connect } = require('./models')
const { handleErrors } = require('./services/handle-errors')

;(async () => {
  try {
    const { DB_URI, PORT } = process.env
    await connect(DB_URI)
    
    express()
      .use(cors())
      .disable('x-powered-by')
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }))
      .use('/api', initRoutes())
      .use(handleErrors())
      .use('/static', express.static(join(__dirname, 'frontend', 'built')))
      .use((_, res) => res.sendFile(join(__dirname, 'frontend', 'built', 'index.html')))
      .listen(PORT, () => console.log(`Server successfully runs on port ${PORT}\n`))
  }
  catch (error) {
    console.error(error)
  }
})()
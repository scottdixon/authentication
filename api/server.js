// Bring in our environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const { initialize, requireJWT, verifyAdmin } = require('./middleware/auth')

const app = express()

// Plugins
app.use(cors())
app.use(bodyParser.json()) // Allows me to have JSON uploads (POST/PUT)
app.use(initialize)

// Routes
app.use([
  require('./routes/products'),
  require('./routes/auth')
])

app.get('/admin', requireJWT, verifyAdmin, (req, res) => {
  res.send('Hello admin!')
})

// JSON error handling
app.use((error, req, res, next) => {
  res.status(500).send({ error: error.message })
})
app.use((req, res, next) => {
  // No other routes left, must be a 404!
  res.status(404).send({
    error: `No route found for ${req.method} ${req.url}`
  })
})

app.listen(7000, (error) => {
  if (error) {
    console.log('There was a problem starting the server', error)
  } else {
    console.log('Server is listening on http://localhost:7000/')
  }
})

module.exports = app

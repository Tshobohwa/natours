const express = require('express')
const morgan = require('morgan')

const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes')

const app = express()

app.use(express.json())

app.use(express.static(`${__dirname}/public/`))

app.use(morgan('dev'))

app.use((req, res, next) => {
  req.createdAt = new Date().toISOString()
  next()
})

app.use('/api/v1/users', userRouter)
app.use('/api/v1/tours', tourRouter)

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`,
  })
  next()
})

module.exports = app

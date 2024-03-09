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
  const err = new Error(`Route ${req.originalUrl} not found`)
  err.statusCode = 404
  err.status = 'fail'
  next(err)
})

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })
  next(err)
})

module.exports = app

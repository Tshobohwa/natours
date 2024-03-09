const express = require('express')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

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
  const err = new AppError(`Route ${req.originalUrl} not found`, 404)
  next(err)
})

app.use(globalErrorHandler)

module.exports = app

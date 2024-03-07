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

module.exports = app

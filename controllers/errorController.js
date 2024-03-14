const AppError = require('./../utils/appError')

const handleCastErrorBD = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  console.error(message)
  return new AppError(message, 400)
}

const handleErrorInProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    console.error('Error 💥', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }
}

const handleJsonWebTokenError = (err) =>
  new AppError('Invalid token! Please login again.', 401)
const handleTokenExpiredError = (err) =>
  new AppError('Your token has expired! please login again')

const handleErrorInDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  const NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV.trim() // Use process.env.NODE_ENV consistently

  if (NODE_ENV === 'development') {
    handleErrorInDevelopment(err, res, next)
  } else if (NODE_ENV === 'production') {
    let error = { ...err }
    console.log(typeof error)
    if (error.name === 'CastError') error = handleCastErrorBD(error)
    if (error.name === 'jsonWebTokenError')
      error = handleJsonWebTokenError(error)
    if (error.name === 'tokenExpiredError')
      error = handleTokenExpiredError(error)

    // handleErrorInProduction(error, res)
  }
  handleErrorInProduction(err, res)
}

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

const handleErrorInDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
  res.status(err.statusCode).json({
    status: err.status,
    message: 'Something went wrong!',
  })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'production') handleErrorInProduction(err, res)
  else handleErrorInDevelopment(err, res)
  next(err)
}

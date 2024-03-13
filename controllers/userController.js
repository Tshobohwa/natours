const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()
  console.log(users)
  res.status(200).json({
    status: 'success',
    data: { users },
  })
})

exports.postUser = (_, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  })
}

exports.getUser = (_, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  })
}

exports.updateUser = (_, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  })
}

exports.deleteUser = (_, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  })
}

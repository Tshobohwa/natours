const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })

  const token = signToken(newUser._id)
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser,
    },
  })
})

exports.login = async (req, res, next) => {
  const { email, password } = req.body
  // 1) check if the email and password exists!
  if (!email || !password)
    return next(new AppError('Please provide an email and password!', 400))

  // 2) Verify if user exists and password is correct!
  const user = await User.findOne({ email }).select('+password')

  if (!user || !user.correctPassword(password, user.password)) {
    return next(new AppError('Invalid email or password'))
  }

  // 3) If everyting is ok, send response to client with token
  const token = signToken(user._id)
  res.status(200).json({
    status: 'success',
    token,
  })
}

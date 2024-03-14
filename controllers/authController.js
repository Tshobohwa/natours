const { promisify } = require('util')
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
    return next(new AppError('Invalid email or password', 401))
  }

  // 3) If everyting is ok, send response to client with token
  const token = signToken(user._id)
  res.status(200).json({
    status: 'success',
    token,
  })
}

exports.protect = catchAsync(async (req, res, next) => {
  // Verify token availability
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token)
    return next(
      new AppError('You are not logged in. Please log in to get access', 401),
    )

  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)

  // 3) Verify if the user still exists
  const freshUser = await User.findById(decoded.id)

  if (!freshUser)
    return next(new AppError('The user of this token no longer exists!'))

  // 4) Check if the password was changed after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed passsword! Please login again.', 401),
    )
  }
  // GRANT ACCESS TO THE CURRENT USER
  req.currentUser = freshUser
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role))
      return next(
        new AppError('You do not have permission to perform this action', 403),
      )
    next()
  }
}

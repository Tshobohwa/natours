const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must have at least 8 characters'],
    maxlength: [32, 'Password must have at most 32 characters'],
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (val) {
        return this.password === val
      },
      message: 'password are not the same',
    },
  },
})

userSchema.pre('save', async function (next) {
  console.log(this)
  //Only run this function if password was modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12 (how CPU intesive the operation will be)
  this.password = await bcrypt.hash(this.password, 12)

  // delete the password confirmed field
  this.passwordConfirm = undefined

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User

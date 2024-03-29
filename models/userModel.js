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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must have at least 8 characters'],
    maxlength: [32, 'Password must have at most 32 characters'],
    select: false,
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
  passwordChangedAt: Date,
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

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (!this.passwordChangedAt) {
    const changedAtTimeStamp = this.passwordChangedAt.getTime() / 1000
    return changedAtTimeStamp < jwtTimeStamp
  }
  return false
}

const User = mongoose.model('User', userSchema)

module.exports = User

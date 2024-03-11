const mongoose = require('mongoose')
const validator = require('validator')

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
  passordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return this.password === val
      },
      message: 'password confirm must be equal to password',
    },
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User

const Tour = require('../models/tourModel')

exports.checkBody = (req, res, next) => {
  const { name, price } = req.body
  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid tour',
    })
  }
  next()
}

exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {},
  })
}

exports.postTour = (req, res) => {
  res.status(201).json({})
}

exports.getTour = (req, res) => {}

exports.updateTour = (req, res) => {}

exports.deleteTour = (req, res) => {}

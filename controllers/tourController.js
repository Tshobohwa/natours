const Tour = require('../models/tourModel')

exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {},
  })
}

exports.postTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'created',
      data: {
        tour: newTour,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'rejected',
      message: err,
    })
  }
}

exports.getTour = (req, res) => {}

exports.updateTour = (req, res) => {}

exports.deleteTour = (req, res) => {}

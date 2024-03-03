const Tour = require('../models/tourModel')

exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find()
    res.status(200).json({
      status: 'ok',
      data: {
        tours,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail to fetch',
      message: err,
    })
  }
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

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: 'ok',
      data: {
        tour,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Not found',
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: '',
      data: null,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

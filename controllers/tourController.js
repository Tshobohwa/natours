const Tour = require('../models/tourModel')

exports.getTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1) Getting query object
    const queryObj = { ...req.query }
    const excludeFileds = ['page', 'limit', 'sort', 'fields']
    excludeFileds.forEach((el) => delete queryObj[el])

    // 2) Advanced filtering
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(
      /\b(lt|lte|gt|gte)\b/g,
      (match) => `$${match}`,
    )

    let query = Tour.find(JSON.parse(queryString))

    // 3) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    }

    // EXECUTE QUERY
    const tours = await query

    // SEND RESPONSE
    res.status(200).json({
      status: 'ok',
      results: tours.length,
      data: {
        tours,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
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

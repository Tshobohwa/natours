const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/ApiFeatures')

exports.aliasTopFiveTours = async (req, _, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1) Getting query object

    // 3) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ')
    //   query = query.sort(sortBy)
    // } else {
    //   query.sort('-createdAt')
    // }

    // 4) Limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ')
    //   query = query.select(fields)
    // } else {
    //   query = query.select('-__v')
    // }

    // 5) pagination
    // const page = +req.query.page || 1
    // const limit = +req.query.limit || 100
    // const skip = (page - 1) * limit
    // console.log(page, limit)

    // if (req.query.page) {
    //   const documentsNumber = await Tour.countDocuments()
    //   if (documentsNumber <= skip) throw new Error("This page doesn't exist.")
    // }

    // query = query.skip(skip).limit(limit)

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limiting()
      .paginate()
    const tours = await features.query

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

exports.getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$ratingsAverage',
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $match: { _id: { $ne: 'easy' } } },
    ])

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: {
        stats,
      },
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })
  }
}

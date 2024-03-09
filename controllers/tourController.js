const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/ApiFeatures')
const catchAsync = require('../utils/catchAsync')

exports.aliasTopFiveTours = async (req, _, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getTours = catchAsync(async (req, res, next) => {
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

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  })
})

exports.postTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: 'created',
    data: {
      tour: newTour,
    },
  })
})

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id)

  res.status(200).json({
    status: 'ok',
    data: {
      tour,
    },
  })
})

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id)
  res.status(204).json({
    status: '',
    data: null,
  })
})

exports.getToursStats = catchAsync(async (req, res, next) => {
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
})

exports.getMonthyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year
  console.log('year ' + year)
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '_id' } },
    { $project: {} },
  ])

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  })
})

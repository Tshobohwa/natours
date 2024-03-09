const mongoose = require('mongoose')
const { default: slugify } = require('slugify')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    secret: {
      type: Boolean,
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

tourSchema.virtual('weeksDuration').get(function () {
  return this.duration / 7
})

tourSchema.post('save', function (next) {
  console.log(this)
  // next()
})

tourSchema.pre(/^find/, function (next) {
  this.start = Date.now()
  this.find({ secret: { $ne: true } })
  next()
})

tourSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start} ms`)
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour

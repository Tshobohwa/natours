const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE_URL.replace('<PASSWORD>', process.env.PASSWORD)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('database connected'))
  .catch((err) => console.log(err))

const port = 8000

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  ranking: {
    type: Number,
    default: 4.5,
  },
})

const Tour = mongoose.model('Tour', tourSchema)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

const testTour = new Tour({
  name: 'Tour du Kasai',
  price: 250,
})

testTour
  .save()
  .then((res) => console.log(res))
  .catch((err) => console.log(err))

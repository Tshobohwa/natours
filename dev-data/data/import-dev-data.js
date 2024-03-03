const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE_URL.replace('<PASSWORD>', process.env.PASSWORD)

const data = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
const tours = JSON.parse(data)

console.log(process.argv)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('database connected'))
  .catch((err) => console.log(err))

const importData = async () => {
  try {
    console.log(tours)
    await Tour.create(tours)
    console.log('Tours successfully uploaded')
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Tours successfully deleted')
    process.exit()
  } catch (error) {
    console.log("Couldn't delete tours")
  }
}

if (process.argv[2] === '--import') {
  importData()
}

if (process.argv[2] === '--delete') {
  deleteData()
}

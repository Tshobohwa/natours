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
    // useUnifiedTopology: true,
  })
  .then(() => console.log('database connected'))
  .catch((err) => console.log(err))

const port = 3000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

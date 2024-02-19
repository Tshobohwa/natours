const express = require('express');
const fs = require('fs');

const app = express();

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours.json'));

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'natours' });
// });

// app.post('/', (req, res) => {
//   res.status(201).json('You can post here...');
// });

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});

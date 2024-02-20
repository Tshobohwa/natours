const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from middle ware');
  next();
});

app.use((req, res, next) => {
  req.createdAt = new Date().toISOString();
  next();
});

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'natours' });
// });

// app.post('/', (req, res) => {
//   res.status(201).json('You can post here...');
// });

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const postTour = (req, res) => {
  const newId = tours[tours.length - 1]._id + 1;
  const newTour = { ...req.body, _id: newId, createdAt: req.createdAt };

  tours.push(newTour);
  fs.writeFile('./dev-data/data/tours.json', JSON.stringify(tours), (err) => {
    console.log(err.message);
  });

  res.status(201).json({});
};

const getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({ status: 'success', data: { tour } });
};

const updateTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour goes here...>',
    },
  });
};

const deleteTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  if (!tour)
    return res.status(404).json({ status: 'fail', message: 'Invalid id' });
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};

const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  });
};

const postUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Internal Server error',
  });
};

app.route('/api/v1/tours').get(getTours).post(postTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getUsers).post(postUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;

app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});

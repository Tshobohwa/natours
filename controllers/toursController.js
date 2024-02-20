const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.postTour = (req, res) => {
  const newId = tours[tours.length - 1]._id + 1;
  const newTour = { ...req.body, _id: newId, createdAt: req.createdAt };

  tours.push(newTour);
  fs.writeFile('./dev-data/data/tours.json', JSON.stringify(tours), (err) => {
    console.log(err.message);
  });

  res.status(201).json({});
};

exports.getTour = (req, res) => {
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

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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

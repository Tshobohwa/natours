const express = require('express');

const toursController = require('../controllers/toursController');

const router = express.Router();

router.route('/').get(toursController.getTours).post(toursController.postTour);

router
  .route('/:id')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;

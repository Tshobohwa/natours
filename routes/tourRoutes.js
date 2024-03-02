const express = require('express')

const toursController = require('../controllers/tourController')

const router = express.Router()

router.param('id', toursController.checkID)

router
  .route('/home')
  .get(toursController.getTours)
  .post(toursController.checkBody, toursController.postTour)

router
  .route('/:id')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour)

module.exports = router

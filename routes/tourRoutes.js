const express = require('express')

const toursController = require('../controllers/tourController')

const router = express.Router()

router
  .route('/top-5-cheap')
  .get(toursController.aliasTopFiveTours, toursController.getTours)

router.route('/tours-stats').get(toursController.getToursStats)
router.route('/monthly-plan/:year').get(toursController.getMonthyPlan)

router.route('/').get(toursController.getTours).post(toursController.postTour)

router
  .route('/:id')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour)

module.exports = router

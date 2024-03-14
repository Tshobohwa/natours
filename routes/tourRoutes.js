const express = require('express')
const authController = require('../controllers/authController')
const toursController = require('../controllers/tourController')

const router = express.Router()

router
  .route('/top-5-cheap')
  .get(toursController.aliasTopFiveTours, toursController.getTours)

router.route('/tours-stats').get(toursController.getToursStats)
router.route('/monthly-plan/:year').get(toursController.getMonthyPlan)

router
  .route('/')
  .get(authController.protect, toursController.getTours)
  .post(toursController.postTour)

router
  .route('/:id')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.deleteTour,
  )

module.exports = router

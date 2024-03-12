const express = require('express')

const authController = require('../controllers/authController')

const usersController = require('../controllers/userController')

const router = express.Router()

router.route('/signup').post(authController.signUp)

router.route('/').get(usersController.getUsers).post(usersController.postUser)

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

module.exports = router

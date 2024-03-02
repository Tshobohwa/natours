const express = require('express')

const usersController = require('../controllers/userController')

const router = express.Router()

router.route('/').get(usersController.getUsers).post(usersController.postUser)

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

module.exports = router

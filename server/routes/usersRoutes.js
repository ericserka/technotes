import express from 'express'
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from '../controllers/usersController.js'

export const usersRouter = express.Router()

usersRouter
  .route('/')
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser)

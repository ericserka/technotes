import express from 'express'
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from '../controllers/usersController.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

export const usersRouter = express.Router()

usersRouter.use(verifyJWT)

usersRouter
  .route('/')
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser)

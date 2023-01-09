import express from 'express'
import { login, logout, refresh } from '../controllers/authController.js'
import { loginLimiter } from '../middleware/loginLimiter.js'

export const authRouter = express.Router()

authRouter.route('/').post(loginLimiter, login)

authRouter.route('/refresh').get(refresh)

authRouter.route('/logout').post(logout)

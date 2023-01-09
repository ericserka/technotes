import express from 'express'
import {
  createNewNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from '../controllers/notesController.js'
import { verifyJWT } from '../middleware/verifyJWT.js'

export const notesRouter = express.Router()

notesRouter.use(verifyJWT)

notesRouter
  .route('/')
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote)

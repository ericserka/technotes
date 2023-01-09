import express from 'express'
import {
  createNewNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from '../controllers/notesController.js'

export const notesRouter = express.Router()

notesRouter
  .route('/')
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote)

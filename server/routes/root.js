import express from 'express'
import { URL } from 'url'

export const rootRouter = express.Router()

rootRouter.get('^/$|/index(.html)?', (_req, res) => {
  res.sendFile(new URL('../views/index.html', import.meta.url).pathname)
})

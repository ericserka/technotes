import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { URL } from 'url'
import { corsOptions } from './config/corsOptions.js'
import { connectDB } from './config/dbConn.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logger } from './middleware/logger.js'
import { notesRouter } from './routes/notesRoutes.js'
import { rootRouter } from './routes/root.js'
import { usersRouter } from './routes/usersRoutes.js'

const app = express()
const PORT = process.env.PORT || 3500

config()
connectDB()

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(new URL('./public', import.meta.url).pathname))

app.use('/', rootRouter)
app.use('/users', usersRouter)
app.use('/notes', notesRouter)

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(new URL('./views/404.html', import.meta.url).pathname)
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', (err) => {
  console.log(err)
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  )
})

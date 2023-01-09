import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { URL } from 'url'
import { corsOptions } from './config/corsOptions.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logger } from './middleware/logger.js'
import { router } from './routes/root.js'

const app = express()
const PORT = process.env.PORT || 3500

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(new URL('./public', import.meta.url).pathname))

app.use('/', router)

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

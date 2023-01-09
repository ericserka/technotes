import express from 'express'
import morgan from 'morgan'
import { URL } from 'url'
import { router } from './routes/root.js'

const app = express()
const PORT = process.env.PORT || 3500

app.use(morgan('dev'))

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

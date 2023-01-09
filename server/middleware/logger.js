import { format } from 'date-fns'
import { randomUUID } from 'crypto'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { URL } from 'url'

export const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
  const logItem = `${dateTime}\t${randomUUID()}\t${message}\n`
  const logsPath = new URL('../logs', import.meta.url).pathname

  try {
    if (!fs.existsSync(logsPath)) {
      await fsPromises.mkdir(logsPath)
    }
    await fsPromises.appendFile(
      new URL(`../logs/${logFileName}`, import.meta.url).pathname,
      logItem
    )
  } catch (err) {
    console.log(err)
  }
}

export const logger = (req, _res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  console.log(`${req.method} ${req.path}`)
  next()
}

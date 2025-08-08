// For more information about this file see https://dove.feathersjs.com/guides/cli/logging.html
import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'


const dailyRotateTransport = new transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',  // output pattern
  datePattern: 'YYYY-MM-DD HH',                // rotation frequency
  zippedArchive: true,                      // compress old logs
  maxSize: '20m',                           // max file size before rotate
  maxFiles: '14d',                          // keep logs for 14 days
  level: 'info',                            // log level
  format: format.combine(
    format.timestamp(),
    format.json()
  )
})
// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level:  'debug',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [new transports.Console(),dailyRotateTransport]
})

export const errorLogger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'error',
  format: format.combine(
    format.splat(),
    format.errors({ stack: true }),
    format.colorize({ colors: { error: 'red' } })
  ),
  transports: [new transports.Console()]
})

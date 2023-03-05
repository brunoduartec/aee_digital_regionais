const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const DailyRotateFile = require('winston-daily-rotate-file');
const service_name = 'aee_digital_regionais'

const myFormat = printf(({ level, message, label, timestamp, ...metadata }) => {
  const log = {
    '@timestamp': timestamp,
    level,
    message,
    ...metadata
  };
  return JSON.stringify(log);
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  defaultMeta: { service: service_name },
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: `logs/${service_name}/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '90d'
    })
  ]
});

module.exports = logger;
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const DailyRotateFile = require('winston-daily-rotate-file');

// module.exports = logger;

module.exports = class Logger{
  constructor(service_name="aee_digital_regionais"){
    const instance = this
    const myFormat = printf(({ level, message, label, timestamp, ...metadata }) => {
      const log = {
        '@timestamp': timestamp,
        level,
        correlationId:instance.correlationId,
        message,
        metadata:{...metadata}
      };
      return JSON.stringify(log);
    });
    this.logger = createLogger({
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
  }

  setCorrelation(correlationId){
    this.correlationId = correlationId
  }

  info(data, ...metadata){
    this.logger.info(data, ...metadata);
  }
  debug(data, ...metadata){
    this.logger.debug(data, ...metadata)
  }
  error(data, ...metadata){
    this.logger.error(data, ...metadata)
  }
}
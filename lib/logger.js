import winston from 'winston';

export default winston.createLogger({
  level: 'debug',
  format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.json()),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'log/audits.log' })]
});

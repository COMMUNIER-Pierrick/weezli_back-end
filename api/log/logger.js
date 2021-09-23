const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({format:'DD-MM-YYYY HH:mm:ss'}),
        myFormat,
    ),
    transports: [
        new winston.transports.File({ filename: 'log/logger.log', level: 'error'})
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        level: 'debug',
        prettyPrint : true,
        colorize    : true,
        silent      : false,
        timestamp   : false,
        json        : false
    }));
}

module.exports = logger;

import winston from 'winston';
const { combine, timestamp, printf, colorize, align } = winston.format;
import { logLevel } from './global_config';

const logger = winston.createLogger({
    level: logLevel(),
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [new winston.transports.Console()],
});

export default logger;

// export { logEvents };
//wiston
//webpack

//class
// route
//centralized env config
//healtcheck

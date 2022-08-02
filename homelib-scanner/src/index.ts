// todo: make a single point for run scripts here
import logger from './logger';
import { start } from "./file_scanner";

try {
    start();
} catch(e) {
    logger.error('Scanner critical error');
    logger.error(e);
}

const handleError = (err) => {
    // handle the error safely
    logger.error('UNCAUGHT');
    logger.error(err);
}

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);
process.on('uncaughtExceptionMonitor', handleError);
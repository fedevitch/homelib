// todo: make a single point for run scripts here
import logger from './logger';
import { start } from "./file_scanner";

try {
    start();
} catch(e) {
    logger.error('Scanner critical error');
    logger.error(e);
}

process.on('uncaughtException', function handleError(err) {
    // handle the error safely
    logger.error('UNCAUGHT exception');
    logger.error(err);
});
process.on('unhandledRejection', function handleError(err) {
    // handle the error safely
    logger.error('UNCAUGHT rejection');
    logger.error(err);
});
process.on('uncaughtExceptionMonitor', function handleError(err) {
    // handle the error safely
    logger.error('UNCAUGHT exception monitor');
    logger.error(err);
});
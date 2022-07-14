// todo: make a single point for run scripts here
import logger from './logger';
import { start } from "./file_scanner";

try {
    start();
} catch(e) {
    logger.error('Scanner critical error');
    logger.error(e);
}
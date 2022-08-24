import https from 'https';
import { GoogleBookAPIResponse } from "./models/volumeInfo";
import { FileData } from "./models/fileData";
import logger from './logger';

export const getVolumeInfo = async (data: FileData): Promise<GoogleBookAPIResponse> => {
    const isbnData = data.getIsbn();
    const name = data.entry.fileNameWithoutExt;
    const q = isbnData ? isbnData.isbn : name;
    logger.info(`Getting info from ${name}`);
    return new Promise((resolve, reject) => {
        const responseHandler = (response) => {
            logger.info('Started parsing')
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                logger.info(`Info for ${name} parsed`);
                resolve(JSON.parse(data) as GoogleBookAPIResponse);
            });
        }
        const request = https.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`, responseHandler);
        request.on('error', (err) => {
            logger.error(`Volume Info Parser error`);
            logger.error(err);
            reject(err);
        });
    });
}
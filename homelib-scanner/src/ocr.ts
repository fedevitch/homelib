import { createWorker } from 'tesseract.js';
import logger from './logger';
import { FileData } from './models/fileData';
import { stat } from 'fs/promises';
import scanConfig from './scanConfig';

const worker = createWorker({
    logger: m => {
        if(m.status === 'recognizing text'){
            logger.debug(`Recognizing: ${m.progress}`);
        }
        // logger.debug(m)
    },
    //langPath: './ocr', gzip: false
});

export const initOCR = async() => {
    try {
        await worker.load();
        await worker.loadLanguage('eng+ukr');
        await worker.initialize('eng+ukr');
    } catch(e) {
        logger.error('OCR init failed');
        logger.error(e);
    }
}

export const endWorkOCR = async() => {
    try {
        await worker.terminate();
    } catch(e) {
        logger.error('OCR terminate failed');
        logger.error(e);
    }
}

export const recognizePages = async(fileData: FileData): Promise<string> => {
    let result = "";
    if(!fileData.pagesListToOCR) return result;
    for(const page of fileData.pagesListToOCR){
        logger.debug(`OCR for page ${page} started`);
        try {
            //const { size } = await stat(page.toString());
            //if(size > scanConfig.OCR_MAX_FILE_SIZE) continue;
            const { data: { text } } = await worker.recognize(page);
            result += text;
            logger.debug(`OCR for page ${page} complete`);
        } catch(e) {
            logger.error(`OCR failed for page ${page}`);
            logger.error(e);
            continue;
        }
    }

    return result;
}
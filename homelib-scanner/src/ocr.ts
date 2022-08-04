import { createWorker } from 'tesseract.js';
import logger from './logger';
import { FileData } from './models/fileData';

const timeout = 3 * 60 * 1000;
const workerOptions = {
    logger: m => {
        if(m.status === 'recognizing text'){
            logger.debug(`Recognizing: ${m.progress}`);
        }
        // logger.debug(m)
    },
    //langPath: './ocr', gzip: false
};


const initOCR = async(worker) => {
    try {
        await worker.load();
        await worker.loadLanguage('eng+ukr');
        await worker.initialize('eng+ukr');
    } catch(e) {
        logger.error('OCR init failed');
        logger.error(e);
    }
}

const endWorkOCR = async(worker) => {
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
        logger.debug(`OCR for page in ${fileData.entry.name} started`);
        const worker = createWorker(workerOptions);
        try {            
            await initOCR(worker);
            const recognize = worker.recognize(page);
            const timer = new Promise(resolve => setTimeout(resolve, timeout, { data: { text: "" } }));
            // @ts-ignore
            const { data: { text } } = await Promise.race([recognize, timer]);
            result += text;
            logger.debug(`OCR for page in ${fileData.entry.name} complete`);
            await endWorkOCR(worker);
        } catch(e) {
            logger.error(`OCR failed for page in ${fileData.entry.name}`);
            logger.error(e);
            await endWorkOCR(worker);
            continue;
        }
    }

    return result;
}
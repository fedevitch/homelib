import logger from './logger';
import { FileData } from './models/fileData';
import { spawn } from "child_process";
const timeout = 3 * 60 * 1000;


export const recognizePages = async(fileData: FileData): Promise<string> => {
    try {
        let result = "", tasks = Array<Promise<string>>();
        if(!fileData.pagesListToOCR) return result;
        logger.debug(`Running Tesseract OCR for file ${fileData.entry.name}`);
        for(const page of fileData.pagesListToOCR){
            const timer = new Promise(resolve => setTimeout(resolve, timeout, ""));
            const ocrTask = new Promise((resolve) => {
                logger.debug(`OCR for file ${page}`);    
                let taskResult = "";
                const ocrProcess = spawn('tesseract', [page.toString(), '-', '-l', 'eng+ukr']);
                ocrProcess.stdout.on('data', data => taskResult += data);
                ocrProcess.on('close', () => {
                    logger.debug(`OCR completed for ${page}`);
                    resolve(taskResult)
                });
                ocrProcess.on('error', e => {
                    logger.error(`OCR error for ${page} ${e}`);
                    resolve(taskResult);
                });
                ocrProcess.stderr.on('data', err => {
                    logger.error(err.toString());
                    resolve(taskResult);
                });           
            });
            const pageResult = await Promise.race([ocrTask, timer]);
            result += pageResult;        
        }
        //const recognized = await Promise(tasks);
        return result;
    } catch(e) {
        logger.error(e);
        return "";
    }    
}
import logger from './logger';
import { FileData } from './models/fileData';
import { spawn } from "child_process";


export const recognizePages = async(fileData: FileData): Promise<string> => {
    logger.debug(`Running Tesseract OCR for file ${fileData.entry.name}`);

    try {
        let result = "", tasks = Array<Promise<string>>();
        if(!fileData.pagesListToOCR) return result;
        for(const page of fileData.pagesListToOCR){
            const pageResult = await new Promise((resolve, reject) => {
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
            result += pageResult;        
        }
        //const recognized = await Promise(tasks);
        return result;
    } catch(e) {
        logger.error(e);
        return "";
    }    
}
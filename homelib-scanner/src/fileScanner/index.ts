
import { stat } from 'fs/promises';
import _ from 'lodash';
import logger from '../logger';
import { FileEntry } from '../directoryScanner/fileEntry';
import fileProcessor from './processor';
import { FileData } from '../models/fileData';



const scan = async (file: FileEntry): Promise<FileData> => {

    logger.debug(`scanning file: ${file.getFullName()}`);

    const fileData = new FileData(file);

    try {
        const stats = await stat(file.getFullName());
        fileData.setStats(stats);

        const processResult = await fileProcessor(fileData);
        fileData.setSummary(processResult.rawText);
        fileData.setMeta(processResult.meta);
        fileData.pages = processResult.pages;
        if(processResult.preview) {
            fileData.preview = processResult.preview;
        }
        if(processResult.pagesToOCR) {
            fileData.pagesListToOCR = processResult.pagesToOCR;
        }
        
    } catch (e) {
        logger.error('Scanner error');
        logger.error(e);
        if(Buffer.isBuffer(e)){
            logger.error(e.toString());
        }
    }

    return fileData;
}

export default scan;
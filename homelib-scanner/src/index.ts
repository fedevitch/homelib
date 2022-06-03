import logger from './logger';
import scanDirectories from './directoryScanner';
import scanFile from './fileScanner';

logger.info('starting scanner...');
const start = async () => {

    const fileList = await scanDirectories('/media/lyubomyr/Data/Файли/Бібліотека');

    for await (const file of fileList) {
        const fileInfo = await scanFile(file);
    }

}

start();
import logger from './logger';
import scanDirectories from './directoryScanner';
import scanFile from './fileScanner';
import db from './database';

logger.info('starting scanner...');
const start = async () => {

    const fileList = await scanDirectories('/home/lyubomyr/Документи/Книги');

    let counter = 1, size = fileList.length;
    for await (const file of fileList) {
        logger.info(`Processing ${counter} of ${size} (${(counter / (size / 100)).toFixed(0)}%)`);
        const fullName = file.getFullName();
        const alreadyPresent = await db.book.findFirst({ select: { id: true }, where: { fullName } });
        if(alreadyPresent) {
            logger.debug(`${fullName} is already scanned, skipping`);
            counter++;
            continue;
        }

        const fileData = await scanFile(file);
        try {
            await db.book.create({
                data: {
                    name: fileData.entry.name,
                    fullName: fileData.entry.getFullName(),
                    format: fileData.entry.format || "",
                    meta: fileData.meta || {},
                    summary: fileData.summary || "",
                    createdOnDisk: fileData.createdOnDisk,
                    size: fileData.size,
                    pages: fileData.pages               
                }
            });
        } catch (e) {
            logger.error('Database error', e);
        }        
        counter++;
    }

}

try {
    start();
} catch(e) {
    logger.error('Unhandled error');
    logger.error(e);
}
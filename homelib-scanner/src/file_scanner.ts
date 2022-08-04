import logger from './logger';
import scanConfig from './scanConfig';
import scanDirectories from './directoryScanner';
import scanFile from './fileScanner';
import db from './database';
import { recognizePages } from './ocr';

logger.info('starting scanner...');
export const start = async () => {

    const fileList = await scanDirectories(scanConfig.SCAN_PATH);

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

        try {
            // 1 - scan file
            const scannedObject = await scanFile(file);
            const data: any = {
                name: scannedObject.entry.name,
                fullName: scannedObject.entry.getFullName(),
                format: scannedObject.entry.format || "",
                meta: scannedObject.meta || {},
                createdOnDisk: scannedObject.createdOnDisk,
                size: scannedObject.size,
                pages: scannedObject.pages               
            };
            // IMAGE EXTRACTOR
            // 2 - extract preview (if possible) and write it to db
            if(scannedObject.preview){
                data.coverImage = {
                    create: {
                        data: scannedObject.preview
                    }
                }
            }
            // 3 - extract pages for OCR (if needed)
            // 4 - OCR summary (if needed) and parse ISBN if possible
            if(scannedObject.pagesListToOCR) {
                const ocrText = await recognizePages(scannedObject);
                scannedObject.setSummary(ocrText);                   
            }
            data.summary = scannedObject.summary || "";            
            const isbnData = scannedObject.getIsbn();
            if(isbnData) {
                data.isbn = isbnData.isbn;
                data.isbn10 = isbnData.isbn10;
                data.isbn13 = isbnData.isbn13;
            }
            try {            
                await db.book.create({ data });
            } catch (e) {
                logger.error('Database error', e);
            }
            // 5 - delete images on disk from steps 2-4
            await scannedObject.deleteTempFiles();
        } catch(e) {
            logger.error("Scan File error");
            logger.error(e);
        }

        counter++;
    }
}
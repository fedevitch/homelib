"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const logger_1 = __importDefault(require("./logger"));
const scanConfig_1 = __importDefault(require("./scanConfig"));
const directoryScanner_1 = __importDefault(require("./directoryScanner"));
const fileScanner_1 = __importDefault(require("./fileScanner"));
const database_1 = __importDefault(require("./database"));
logger_1.default.info('starting scanner...');
const start = async () => {
    const fileList = await (0, directoryScanner_1.default)(scanConfig_1.default.SCAN_PATH);
    let counter = 1, size = fileList.length;
    for await (const file of fileList) {
        logger_1.default.info(`Processing ${counter} of ${size} (${(counter / (size / 100)).toFixed(0)}%)`);
        const fullName = file.getFullName();
        const alreadyPresent = await database_1.default.book.findFirst({ select: { id: true }, where: { fullName } });
        if (alreadyPresent) {
            logger_1.default.debug(`${fullName} is already scanned, skipping`);
            counter++;
            continue;
        }
        try {
            // 1 - scan file
            const scannedObject = await (0, fileScanner_1.default)(file);
            const data = {
                name: scannedObject.entry.name,
                fullName: scannedObject.entry.getFullName(),
                format: scannedObject.entry.format || "",
                meta: scannedObject.meta || {},
                summary: scannedObject.summary || "",
                createdOnDisk: scannedObject.createdOnDisk,
                size: scannedObject.size,
                pages: scannedObject.pages
            };
            const isbnData = scannedObject.getIsbn();
            if (isbnData) {
                data.isbn = isbnData.isbn;
                data.isbn10 = isbnData.isbn10;
                data.isbn13 = isbnData.isbn13;
            }
            if (scannedObject.preview) {
                data.previewImage = {
                    create: {
                        data: scannedObject.preview
                    }
                };
            }
            try {
                await database_1.default.book.create({ data });
            }
            catch (e) {
                logger_1.default.error('Database error', e);
            }
            // IMAGE EXTRACTOR
            // 2 - extract preview (if possible) and write it to db
            // 3 - extract pages for OCR (if needed)
            // ---
            // 4 - OCR summary (if needed) and parse ISBN if possible
            // 5 - delete images on disk from steps 2-4
            await scannedObject.deleteTempFiles();
        }
        catch (e) {
            logger_1.default.error("Scan File error");
            logger_1.default.error(e);
        }
        counter++;
    }
};
exports.start = start;

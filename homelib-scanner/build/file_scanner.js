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
const ocr_1 = require("./ocr");
const googleBooks_1 = require("./googleBooks");
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
                createdOnDisk: scannedObject.createdOnDisk,
                size: scannedObject.size,
                pages: scannedObject.pages
            };
            // IMAGE EXTRACTOR
            // 2 - extract preview (if possible) and write it to db
            if (scannedObject.preview) {
                data.coverImage = {
                    create: {
                        data: scannedObject.preview
                    }
                };
            }
            // 3 - extract pages for OCR (if needed)
            // 4 - OCR summary (if needed) and parse ISBN if possible
            if (scannedObject.pagesListToOCR) {
                const ocrText = await (0, ocr_1.recognizePages)(scannedObject);
                scannedObject.setSummary(ocrText);
            }
            data.summary = scannedObject.summary || "";
            const isbnData = scannedObject.getIsbn();
            if (isbnData) {
                data.isbn = isbnData.isbn;
                data.isbn10 = isbnData.isbn10;
                data.isbn13 = isbnData.isbn13;
            }
            // 4.1 get additional info from Google Book API
            const googleBookApiResponse = await (0, googleBooks_1.getVolumeInfo)(scannedObject);
            if (googleBookApiResponse.items) {
                const volumeData = googleBookApiResponse.items[0];
                const jsonDump = { items: googleBookApiResponse.items };
                const { title, authors, publisher, publishedDate, industryIdentifiers, description, pageCount, categories, maturityRating, language, imageLinks, previewLink, selfLink, canonicalVolumeLink } = volumeData.volumeInfo;
                const previewLinks = [imageLinks.thumbnail, previewLink, selfLink, canonicalVolumeLink].filter(l => !!l);
                data.volumeInfo = {
                    create: {
                        jsonDump,
                        title,
                        authors, description, pageCount,
                        publisher, publishedDate,
                        categories, maturityRating, language,
                        industryIdentifiers, previewLinks
                    }
                };
                if (industryIdentifiers) {
                    const isbn10 = industryIdentifiers.find(iid => iid.type === 'ISBN_10');
                    const isbn13 = industryIdentifiers.find(iid => iid.type === 'ISBN_13');
                    if (!data.isbn)
                        data.isbn = isbn13 || isbn10;
                    if (!data.isbn10)
                        data.isbn10 = isbn10;
                    if (!data.isbn13)
                        data.isbn13 = isbn13;
                }
            }
            try {
                await database_1.default.book.create({ data });
            }
            catch (e) {
                logger_1.default.error('Database error', e);
            }
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

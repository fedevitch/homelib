"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const logger_1 = __importDefault(require("./logger"));
const directoryScanner_1 = __importDefault(require("./directoryScanner"));
const fileScanner_1 = __importDefault(require("./fileScanner"));
const database_1 = __importDefault(require("./database"));
logger_1.default.info('starting scanner...');
const start = async () => {
    const fileList = await (0, directoryScanner_1.default)('/home/lyubomyr/Документи/Книги');
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
        const fileData = await (0, fileScanner_1.default)(file);
        try {
            const data = {
                name: fileData.entry.name,
                fullName: fileData.entry.getFullName(),
                format: fileData.entry.format || "",
                meta: fileData.meta || {},
                summary: fileData.summary || "",
                createdOnDisk: fileData.createdOnDisk,
                size: fileData.size,
                pages: fileData.pages
            };
            const isbnData = fileData.getIsbn();
            if (isbnData) {
                data.isbn = isbnData.isbn;
                data.isbn10 = isbnData.isbn10;
                data.isbn13 = isbnData.isbn13;
            }
            await database_1.default.book.create({ data });
        }
        catch (e) {
            logger_1.default.error('Database error', e);
        }
        counter++;
    }
};
exports.start = start;
try {
    (0, exports.start)();
}
catch (e) {
    logger_1.default.error('Unhandled error');
    logger_1.default.error(e);
}

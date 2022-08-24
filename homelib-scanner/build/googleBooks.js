"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVolumeInfo = void 0;
const https_1 = __importDefault(require("https"));
const logger_1 = __importDefault(require("./logger"));
const getVolumeInfo = async (data) => {
    const isbnData = data.getIsbn();
    const name = data.entry.fileNameWithoutExt;
    const q = isbnData ? isbnData.isbn : name;
    logger_1.default.info(`Getting info from ${name}`);
    return new Promise((resolve, reject) => {
        const responseHandler = (response) => {
            logger_1.default.info('Started parsing');
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                logger_1.default.info(`Info for ${name} parsed`);
                resolve(JSON.parse(data));
            });
        };
        const request = https_1.default.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`, responseHandler);
        request.on('error', (err) => {
            logger_1.default.error(`Volume Info Parser error`);
            logger_1.default.error(err);
            reject(err);
        });
    });
};
exports.getVolumeInfo = getVolumeInfo;

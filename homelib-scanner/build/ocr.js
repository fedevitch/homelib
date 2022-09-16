"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recognizePages = void 0;
const logger_1 = __importDefault(require("./logger"));
const child_process_1 = require("child_process");
const recognizePages = async (fileData) => {
    logger_1.default.debug(`Running Tesseract OCR for file ${fileData.entry.name}`);
    try {
        let result = "", tasks = Array();
        if (!fileData.pagesListToOCR)
            return result;
        for (const page of fileData.pagesListToOCR) {
            const pageResult = await new Promise((resolve, reject) => {
                logger_1.default.debug(`OCR for file ${page}`);
                let taskResult = "";
                const ocrProcess = (0, child_process_1.spawn)('tesseract', [page.toString(), '-', '-l', 'eng+ukr']);
                ocrProcess.stdout.on('data', data => taskResult += data);
                ocrProcess.on('close', () => {
                    logger_1.default.debug(`OCR completed for ${page}`);
                    resolve(taskResult);
                });
                ocrProcess.on('error', reject);
                ocrProcess.stderr.on('data', err => reject(err.toString()));
            });
            result += pageResult;
        }
        //const recognized = await Promise(tasks);
        return result;
    }
    catch (e) {
        logger_1.default.error(e);
        return "";
    }
};
exports.recognizePages = recognizePages;

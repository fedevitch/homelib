"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recognizePages = void 0;
const tesseract_js_1 = require("tesseract.js");
const logger_1 = __importDefault(require("./logger"));
const timeout = 3 * 60 * 1000;
const workerOptions = {
    logger: m => {
        if (m.status === 'recognizing text') {
            logger_1.default.debug(`Recognizing: ${m.progress}`);
        }
        // logger.debug(m)
    },
    //langPath: './ocr', gzip: false
};
const initOCR = async (worker) => {
    try {
        await worker.load();
        await worker.loadLanguage('eng+ukr');
        await worker.initialize('eng+ukr');
    }
    catch (e) {
        logger_1.default.error('OCR init failed');
        logger_1.default.error(e);
    }
};
const endWorkOCR = async (worker) => {
    try {
        await worker.terminate();
    }
    catch (e) {
        logger_1.default.error('OCR terminate failed');
        logger_1.default.error(e);
    }
};
const recognizePages = async (fileData) => {
    let result = "";
    if (!fileData.pagesListToOCR)
        return result;
    for (const page of fileData.pagesListToOCR) {
        logger_1.default.debug(`OCR for page ${page} started`);
        try {
            const worker = (0, tesseract_js_1.createWorker)(workerOptions);
            await initOCR(worker);
            const recognize = worker.recognize(page);
            const timer = new Promise(resolve => setTimeout(resolve, timeout, { data: { text: "" } }));
            // @ts-ignore
            const { data: { text } } = await Promise.race([recognize, timer]);
            result += text;
            logger_1.default.debug(`OCR for page ${page} complete`);
            await endWorkOCR(worker);
        }
        catch (e) {
            logger_1.default.error(`OCR failed for page ${page}`);
            logger_1.default.error(e);
            continue;
        }
    }
    return result;
};
exports.recognizePages = recognizePages;

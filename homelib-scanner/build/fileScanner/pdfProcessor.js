"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagesOCR = exports.extractPreview = void 0;
const lodash_1 = __importDefault(require("lodash"));
const child_process_1 = require("child_process");
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const logger_1 = __importDefault(require("../logger"));
const scanConfig_1 = __importDefault(require("../scanConfig"));
const extractPreview = async (fileName) => {
    return new Promise((resolve, reject) => {
        let previewFileName = `/tmp/${(0, crypto_1.randomUUID)().replaceAll('-', '')}`;
        const convertProcess = (0, child_process_1.spawn)('pdftopng', ['-f', '1', '-l', '1', '-r', '5', fileName, previewFileName]);
        convertProcess.on('error', reject);
        convertProcess.stderr.on('data', reject);
        convertProcess.stderr.on('error', reject);
        convertProcess.on('close', async () => {
            previewFileName += '-000001.png';
            const blob = await (0, promises_1.readFile)(previewFileName);
            await (0, promises_1.rm)(previewFileName);
            resolve(blob);
        });
    });
};
exports.extractPreview = extractPreview;
const getPagesOCR = async (fileName, firstPage, lastPage) => {
    return new Promise((resolve, reject) => {
        const fileNames = Array();
        const prefix = `/tmp/${(0, crypto_1.randomUUID)().replaceAll('-', '')}`;
        for (let i = firstPage; i <= lastPage; i++) {
            const fileName = `${prefix}-${lodash_1.default.padStart(i.toString(), 6, '0')}.png`;
            fileNames.push(fileName);
        }
        const convertProcess = (0, child_process_1.spawn)('pdftopng', ['-f', firstPage.toString(), '-l', lastPage.toString(), '-r', '5', fileName, prefix]);
        convertProcess.on('error', reject);
        convertProcess.stderr.on('data', reject);
        convertProcess.stderr.on('error', reject);
        convertProcess.on('close', async () => {
            resolve(fileNames);
        });
    });
};
exports.getPagesOCR = getPagesOCR;
const getPdfInfo = async (fileName) => {
    return new Promise((resolve, reject) => {
        const dumpProcess = (0, child_process_1.spawn)('pdfinfo', [fileName]);
        let infoDump = "";
        dumpProcess.stdout.on('data', data => infoDump += data);
        dumpProcess.on('close', () => {
            const info = { infoDump };
            infoDump.split('\n')
                .forEach(v => {
                const name = v.split(':')[0];
                const value = v.substring(v.indexOf(':') + 1).trim();
                info[name] = value;
            });
            resolve(info);
        });
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', err => reject(err.toString()));
    });
};
const getPdfText = async (fileName, startPage, endPage) => {
    return new Promise((resolve, reject) => {
        const dumpProcess = (0, child_process_1.spawn)('pdftotext', ['-f', startPage.toString(), '-l', endPage.toString(), fileName, '-']);
        let text = "";
        dumpProcess.stdout.on('data', data => text += data);
        dumpProcess.on('close', () => resolve(text));
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', err => reject(err.toString()));
    });
};
const parsePdf = async (fileName) => {
    const meta = await getPdfInfo(fileName);
    const pages = Number.parseInt(lodash_1.default.get(meta, 'Pages', '0'));
    const bookIndex = await getPdfText(fileName, 1, scanConfig_1.default.TAKE_START_PAGES);
    const bookAppendix = await getPdfText(fileName, pages - scanConfig_1.default.TAKE_END_PAGES, pages);
    const preview = await (0, exports.extractPreview)(fileName);
    let pagesToOCR = Array();
    if (!bookIndex && !bookAppendix && scanConfig_1.default.OCR) {
        const firstPages = await (0, exports.getPagesOCR)(fileName, 1, scanConfig_1.default.TAKE_START_PAGES);
        const lastPages = await (0, exports.getPagesOCR)(fileName, pages - scanConfig_1.default.TAKE_END_PAGES, pages);
        pagesToOCR = [...firstPages, ...lastPages];
    }
    return { rawText: bookIndex + bookAppendix, meta, pages, preview, pagesToOCR };
};
const processPDF = async (fileName) => {
    logger_1.default.debug(`Parsing pdf ${fileName}`);
    return parsePdf(fileName);
};
exports.default = processPDF;

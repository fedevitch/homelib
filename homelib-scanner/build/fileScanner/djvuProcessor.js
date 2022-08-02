"use strict";
// djvudump <filename>
// djvutxt -page=1-5 <filename>
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const scanConfig_1 = __importDefault(require("../scanConfig"));
const child_process_1 = require("child_process");
const lodash_1 = __importDefault(require("lodash"));
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const pdfProcessor_1 = require("./pdfProcessor");
const djvuExtractPreview = async (fileName) => {
    return new Promise((resolve, reject) => {
        const previewPdfImageFileName = `/tmp/${(0, crypto_1.randomUUID)().replaceAll('-', '')}.pdf`;
        const dumpProcess = (0, child_process_1.spawn)('ddjvu', ['-format=pdf', '-page=1', fileName, previewPdfImageFileName]);
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
        dumpProcess.stderr.on('error', reject);
        dumpProcess.stdout.on('error', reject);
        dumpProcess.on('close', async () => {
            const buffer = await (0, pdfProcessor_1.extractPreview)(previewPdfImageFileName, 25);
            await (0, promises_1.rm)(previewPdfImageFileName);
            resolve(buffer);
        });
    });
};
const djvuGetPagesOCR = async (fileName, pages) => {
    return new Promise((resolve, reject) => {
        const previewPdfImageFileName = `/tmp/${(0, crypto_1.randomUUID)().replaceAll('-', '')}.pdf`;
        const dumpProcess = (0, child_process_1.spawn)('ddjvu', ['-format=pdf',
            `-page=1-${scanConfig_1.default.TAKE_START_PAGES},${pages - scanConfig_1.default.TAKE_END_PAGES}-${pages}`,
            '-mode=black',
            fileName, previewPdfImageFileName]);
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
        dumpProcess.stderr.on('error', reject);
        dumpProcess.on('close', async () => {
            const fileNames = await (0, pdfProcessor_1.getPagesOCR)(previewPdfImageFileName, 1, scanConfig_1.default.TAKE_START_PAGES + scanConfig_1.default.TAKE_END_PAGES);
            await (0, promises_1.rm)(previewPdfImageFileName);
            resolve(fileNames);
        });
    });
};
const djvuDump = async (fileName) => {
    return new Promise((resolve, reject) => {
        const dumpProcess = (0, child_process_1.spawn)('djvudump', [fileName]);
        let dump = "";
        dumpProcess.stdout.on('data', data => dump += data);
        dumpProcess.on('close', () => resolve(dump));
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
    });
};
const djvuTxt = async (fileName, pages) => {
    return new Promise((resolve, reject) => {
        const dumpProcess = (0, child_process_1.spawn)('djvutxt', [`-page=1-${scanConfig_1.default.TAKE_START_PAGES},${pages - scanConfig_1.default.TAKE_END_PAGES}-${pages}`, fileName]);
        let text = "";
        dumpProcess.stdout.on('data', data => text += data);
        dumpProcess.on('close', () => resolve(text));
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
    });
};
const parseDjvu = async (fileName) => {
    const dump = await djvuDump(fileName);
    const numbers = dump.match(/([0-9])\w+/g);
    const pages = Number.parseInt(lodash_1.default.get(numbers, '3', 0));
    const meta = { pages, files: Number.parseInt(lodash_1.default.get(numbers, '2', 0)), dump: dump.substring(0, 300) };
    const rawText = await djvuTxt(fileName, pages);
    const preview = await djvuExtractPreview(fileName);
    let pagesToOCR = Array();
    if (!rawText && scanConfig_1.default.OCR) {
        pagesToOCR = await djvuGetPagesOCR(fileName, pages);
    }
    return { rawText, meta, pages, preview, pagesToOCR };
};
const processDjvu = async (fileName) => {
    logger_1.default.debug(`Parsing djvu ${fileName}`);
    return parseDjvu(fileName);
};
exports.default = processDjvu;

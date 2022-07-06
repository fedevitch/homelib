"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const logger_1 = __importDefault(require("../logger"));
const scanConfig_1 = __importDefault(require("../scanConfig"));
const getPdfInfo = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
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
});
const getPdfText = (fileName, startPage, endPage) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const dumpProcess = (0, child_process_1.spawn)('pdftotext', ['-f', startPage.toString(), '-l', endPage.toString(), fileName, '-']);
        let text = "";
        dumpProcess.stdout.on('data', data => text += data);
        dumpProcess.on('close', () => resolve(text));
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', err => reject(err.toString()));
    });
});
const parsePdf = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    let pages = 0;
    const meta = yield getPdfInfo(fileName);
    if (meta['Pages']) {
        pages = Number.parseInt(meta['Pages']);
    }
    const bookIndex = yield getPdfText(fileName, 1, scanConfig_1.default.TAKE_START_PAGES);
    const bookAppendix = yield getPdfText(fileName, pages - scanConfig_1.default.TAKE_END_PAGES, pages);
    return { rawText: bookIndex + bookAppendix, meta, pages };
});
const processPDF = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.debug(`Parsing pdf ${fileName}`);
    return parsePdf(fileName);
});
exports.default = processPDF;

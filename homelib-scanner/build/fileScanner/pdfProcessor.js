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
const lodash_1 = __importDefault(require("lodash"));
const PDFparser = require("pdf2json");
const logger_1 = __importDefault(require("../logger"));
const TAKE_START_PAGES = 5;
const TAKE_END_PAGES = 3;
const parsePdf = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let rawText = "", meta = {};
        const pdfParserStream = new PDFparser();
        pdfParserStream.on("pdfParser_dataError", reject);
        pdfParserStream.on("pdfParser_dataReady", (rawData) => {
            logger_1.default.info(`Done parsing data from ${fileName}`);
            meta = lodash_1.default.get(rawData, "Meta");
            const pages = lodash_1.default.get(rawData, "Pages", []);
            const selectedPages = [...lodash_1.default.take(pages, TAKE_START_PAGES), ...lodash_1.default.takeRight(pages, TAKE_END_PAGES)];
            lodash_1.default.forEach(selectedPages, page => {
                lodash_1.default.forEach(lodash_1.default.get(page, "Texts"), textItem => {
                    lodash_1.default.forEach(lodash_1.default.get(textItem, "R"), fragment => rawText += lodash_1.default.get(fragment, "T"));
                });
            });
            resolve([decodeURIComponent(rawText), meta]);
        });
        pdfParserStream.loadPDF(fileName);
    });
});
const processPDF = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const [rawText, meta] = yield parsePdf(fileName);
    // logger.info(rawText);
    // logger.info(meta);
    return { rawText, meta };
});
exports.default = processPDF;

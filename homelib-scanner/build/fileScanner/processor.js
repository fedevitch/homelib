"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const fileExtensions_1 = require("../directoryScanner/fileExtensions");
const pdfProcessor_1 = __importDefault(require("./pdfProcessor"));
const djvuProcessor_1 = __importDefault(require("./djvuProcessor"));
const fb2Processor_1 = __importDefault(require("./fb2Processor"));
const epubProcessor_1 = __importDefault(require("./epubProcessor"));
const fileProcessor = async (fileData) => {
    const format = fileExtensions_1.FileExtensions.getFormat(fileData.entry.name);
    const fullName = fileData.entry.getFullName();
    switch (format) {
        case fileExtensions_1.FileExtensions.Formats.pdf:
            logger_1.default.debug("pdf");
            return (0, pdfProcessor_1.default)(fullName);
        case fileExtensions_1.FileExtensions.Formats.djvu:
        case fileExtensions_1.FileExtensions.Formats.djv:
            logger_1.default.debug("djvu");
            return (0, djvuProcessor_1.default)(fullName);
        case fileExtensions_1.FileExtensions.Formats.fb2:
            logger_1.default.debug("fb2");
            return (0, fb2Processor_1.default)(fullName);
        case fileExtensions_1.FileExtensions.Formats.epub:
            logger_1.default.debug("epub");
            return (0, epubProcessor_1.default)(fullName);
        default:
            logger_1.default.error("Unknown format");
            return {};
    }
};
exports.default = fileProcessor;

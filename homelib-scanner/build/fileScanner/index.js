"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const logger_1 = __importDefault(require("../logger"));
const processor_1 = __importDefault(require("./processor"));
const fileData_1 = require("../models/fileData");
const scan = async (file) => {
    logger_1.default.debug(`scanning file: ${file.getFullName()}`);
    const fileData = new fileData_1.FileData(file);
    try {
        const stats = await (0, promises_1.stat)(file.getFullName());
        fileData.setStats(stats);
        const processResult = await (0, processor_1.default)(fileData);
        fileData.setSummary(processResult.rawText);
        fileData.setMeta(processResult.meta);
        fileData.pages = processResult.pages;
        if (processResult.preview) {
            fileData.preview = processResult.preview;
        }
        if (processResult.pagesToOCR) {
            fileData.pagesListToOCR = processResult.pagesToOCR;
        }
    }
    catch (e) {
        logger_1.default.error('Scanner error');
        logger_1.default.error(e);
        if (Buffer.isBuffer(e)) {
            logger_1.default.error(e.toString());
        }
    }
    return fileData;
};
exports.default = scan;

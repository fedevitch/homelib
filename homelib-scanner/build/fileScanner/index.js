"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileData = void 0;
const promises_1 = require("fs/promises");
const logger_1 = __importDefault(require("../logger"));
const processor_1 = __importDefault(require("./processor"));
class FileData {
    constructor(fileEntry) {
        this.setStats = (stats) => {
            this.size = stats.size;
            this.createdOnDisk = stats.ctime;
        };
        this.setMeta = (meta) => {
            this.meta = meta;
        };
        this.setSummary = (summary) => this.summary = summary;
        this.size = 0;
        this.pages = 0;
        this.createdOnDisk = new Date();
        this.meta = {};
        this.summary = "";
        this.entry = fileEntry;
    }
}
exports.FileData = FileData;
const scan = async (file) => {
    logger_1.default.debug(`scanning file: ${file.getFullName()}`);
    const fileData = new FileData(file);
    try {
        const stats = await (0, promises_1.stat)(file.getFullName());
        fileData.setStats(stats);
        const processResult = await (0, processor_1.default)(fileData);
        fileData.setSummary(processResult.rawText);
        fileData.setMeta(processResult.meta);
        fileData.pages = processResult.pages;
    }
    catch (e) {
        logger_1.default.error('Scanner error');
        logger_1.default.error(e);
    }
    return fileData;
};
exports.default = scan;

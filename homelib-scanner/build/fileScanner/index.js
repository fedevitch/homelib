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
const scan = (file) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`scanning file: ${file.getFullName()}`);
    const fileData = new FileData(file);
    try {
        const stats = yield (0, promises_1.stat)(file.getFullName());
        fileData.setStats(stats);
        const processResult = yield (0, processor_1.default)(fileData);
        fileData.setSummary(processResult.rawText);
        fileData.setMeta(processResult.meta);
        fileData.pages = processResult.pages;
    }
    catch (e) {
        logger_1.default.error('Scanner error');
        logger_1.default.error(e);
    }
    return fileData;
});
exports.default = scan;

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
class FileData {
    constructor(fileEntry) {
        this.setStats = (stats) => {
            this.size = stats.size;
            this.createdOnDisk = stats.ctime;
        };
        this.size = 0;
        this.createdOnDisk = new Date();
        this.entry = fileEntry;
    }
}
exports.FileData = FileData;
const scan = (file) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`scanning file: ${file.getFullName()}`);
    const fileData = new FileData(file);
    const stats = yield (0, promises_1.stat)(file.getFullName());
    fileData.setStats(stats);
    return Promise.resolve(fileData);
});
exports.default = scan;

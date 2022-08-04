"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileData = void 0;
const promises_1 = require("fs/promises");
const lodash_1 = __importDefault(require("lodash"));
const fileExtensions_1 = require("../directoryScanner/fileExtensions");
const logger_1 = __importDefault(require("../logger"));
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
        this.preview = null;
        this.pagesListToOCR = null;
        this.getIsbn = () => {
            if (this.entry.format === fileExtensions_1.FileExtensions.Formats.fb2) {
                return lodash_1.default.get(this.meta, 'isbn', null);
            }
            if (this.summary && this.summary !== "") {
                const idx = this.summary.indexOf('ISBN');
                if (idx === -1)
                    return null;
                const isbn13 = this.summary.substring(idx, idx + 23);
                return {
                    isbn: isbn13.replaceAll(/\D/gim, ''),
                    isbn10: isbn13.substring(0, 18),
                    isbn13
                };
            }
            return null;
        };
        this.deleteTempFiles = async () => {
            if (this.pagesListToOCR) {
                for (const file of this.pagesListToOCR) {
                    if (typeof file === 'string') {
                        try {
                            await (0, promises_1.rm)(file.toString());
                        }
                        catch (e) {
                            logger_1.default.error("delete temp files error");
                            logger_1.default.error(e);
                        }
                    }
                }
                this.pagesListToOCR = null;
            }
        };
        this.entry = fileEntry;
    }
}
exports.FileData = FileData;

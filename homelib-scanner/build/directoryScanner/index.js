"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const logger_1 = __importDefault(require("../logger"));
const fileEntry_1 = require("./fileEntry");
const processDir = async (directory) => {
    const files = [];
    try {
        const dir = await (0, promises_1.opendir)(directory);
        for await (const dirent of dir) {
            if (dirent.isFile()) {
                const fileEntry = new fileEntry_1.FileEntry(dirent, dir.path);
                if (fileEntry.supported) {
                    files.push(fileEntry);
                }
            }
            if (dirent.isDirectory()) {
                const subDirFiles = await processDir(`${directory}/${dirent.name}`);
                files.push(...subDirFiles);
            }
        }
    }
    catch (err) {
        logger_1.default.error(err);
    }
    return Promise.resolve(files);
};
const scan = async (directory) => {
    logger_1.default.info('Scanning folders...');
    const fileList = await processDir(directory);
    logger_1.default.info(`Scanning folders done. Found ${fileList.length} files.`);
    return fileList;
};
exports.default = scan;

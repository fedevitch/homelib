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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const logger_1 = __importDefault(require("../logger"));
const fileEntry_1 = require("./fileEntry");
const processDir = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const files = [];
    try {
        const dir = yield (0, promises_1.opendir)(directory);
        try {
            for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
                const dirent = dir_1_1.value;
                if (dirent.isFile()) {
                    const fileEntry = new fileEntry_1.FileEntry(dirent, dir.path);
                    if (fileEntry.supported) {
                        files.push(fileEntry);
                    }
                }
                if (dirent.isDirectory()) {
                    const subDirFiles = yield processDir(`${directory}/${dirent.name}`);
                    files.push(...subDirFiles);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (dir_1_1 && !dir_1_1.done && (_a = dir_1.return)) yield _a.call(dir_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (err) {
        logger_1.default.error(err);
    }
    return Promise.resolve(files);
});
const scan = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Scanning folders...');
    const fileList = yield processDir(directory);
    logger_1.default.info(`Scanning folders done. Found ${fileList.length} files.`);
    return fileList;
});
exports.default = scan;

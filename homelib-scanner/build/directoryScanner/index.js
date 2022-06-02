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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEntry = void 0;
const promises_1 = require("fs/promises");
class FileEntry {
    constructor(_dirent, _path) {
        this.getFullName = () => `${this.path}${this.name}`;
        this.name = _dirent.name;
        this.path = _path;
    }
}
exports.FileEntry = FileEntry;
const processDir = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const files = [];
    try {
        const dir = yield (0, promises_1.opendir)(directory);
        try {
            for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
                const dirent = dir_1_1.value;
                if (dirent.isFile()) {
                    files.push(new FileEntry(dirent, dir.path));
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
        console.error(err);
    }
    return Promise.resolve(files);
});
const scan = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('scanning directories');
    const fileList = yield processDir(directory);
    return Promise.resolve(fileList);
});
exports.default = scan;

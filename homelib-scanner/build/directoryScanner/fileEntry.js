"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEntry = void 0;
const path_1 = require("path");
const fileExtensions_1 = require("./fileExtensions");
class FileEntry {
    constructor(_dirent, _path) {
        this.getFullName = () => `${this.path}${path_1.sep}${this.name}`;
        this.name = _dirent.name;
        this.path = _path.replaceAll('/', path_1.sep);
        this.format = fileExtensions_1.FileExtensions.getFormat(this.name);
        this.supported = this.format !== null;
        this.fileNameWithoutExt = this.name.replace(`.${this.format}`, '');
    }
}
exports.FileEntry = FileEntry;

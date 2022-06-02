"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEntry = void 0;
const fileExtensions_1 = require("./fileExtensions");
class FileEntry {
    constructor(_dirent, _path) {
        this.getFullName = () => `${this.path}/${this.name}`;
        this.name = _dirent.name;
        this.path = _path;
        this.format = fileExtensions_1.FileExtensions.getFormat(this.name);
        this.supported = this.format !== null;
    }
}
exports.FileEntry = FileEntry;

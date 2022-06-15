"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileExtensions = void 0;
class FileExtensions {
}
exports.FileExtensions = FileExtensions;
_a = FileExtensions;
FileExtensions.Formats = {
    pdf: "pdf",
    djvu: "djvu",
    fb2: "fb2"
};
FileExtensions.getFormat = (fileName) => {
    for (const format in _a.Formats) {
        const isThisFormat = new RegExp(`\.${format}$`).test(fileName);
        if (isThisFormat)
            return format;
    }
    return null;
};
FileExtensions.getPureName = (fileName) => fileName.substring(0, fileName.lastIndexOf('.'));

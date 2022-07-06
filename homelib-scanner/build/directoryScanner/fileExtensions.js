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
    djv: "djv",
    fb2: "fb2",
    epub: "epub",
    doc: "doc",
    docx: "docx",
    rtf: "rtf",
    chm: "chm",
    cbr: "cbr",
    cbz: "cbz"
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

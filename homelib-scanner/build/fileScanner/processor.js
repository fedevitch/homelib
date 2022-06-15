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
const logger_1 = __importDefault(require("../logger"));
const fileExtensions_1 = require("../directoryScanner/fileExtensions");
const pdfProcessor_1 = __importDefault(require("./pdfProcessor"));
const fileProcessor = (fileData) => __awaiter(void 0, void 0, void 0, function* () {
    const format = fileExtensions_1.FileExtensions.getFormat(fileData.entry.name);
    const fullName = fileData.entry.getFullName();
    switch (format) {
        case fileExtensions_1.FileExtensions.Formats.pdf:
            logger_1.default.debug("pdf");
            return (0, pdfProcessor_1.default)(fullName);
        case fileExtensions_1.FileExtensions.Formats.djvu:
            return {};
        case fileExtensions_1.FileExtensions.Formats.fb2:
            return {};
        default:
            logger_1.default.error("Unknown format");
            return {};
    }
});
exports.default = fileProcessor;

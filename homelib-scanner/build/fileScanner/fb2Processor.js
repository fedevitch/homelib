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
const lodash_1 = __importDefault(require("lodash"));
const promises_1 = require("fs/promises");
const vivaParserFb2 = require('viva-parser-fb2');
const logger_1 = __importDefault(require("../logger"));
const parseFb2 = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield (0, promises_1.readFile)(fileName, 'utf-8');
    const parser = new vivaParserFb2();
    const fb2 = parser.parse(file);
    if (!fb2) {
        logger_1.default.error('Incorrect format');
    }
    const meta = lodash_1.default.omit(parser.book, 'text', 'link', 'binary', 'annotation');
    meta['annotation'] = parser.get_formatted_annotation({ format: 'plain' });
    const text = parser.get_formatted_text({ format: 'plain' });
    const pages = parser.book.text.length;
    return { rawText: lodash_1.default.take(text, 500).join(), meta, pages };
});
const processFb2 = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.debug(`Parsing fb2 ${fileName}`);
    return parseFb2(fileName);
});
exports.default = processFb2;

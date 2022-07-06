"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const promises_1 = require("fs/promises");
const vivaParserFb2 = require('viva-parser-fb2');
const logger_1 = __importDefault(require("../logger"));
const parseFb2 = async (fileName) => {
    const file = await (0, promises_1.readFile)(fileName, 'utf-8');
    const parser = new vivaParserFb2();
    const fb2 = parser.parse(file);
    if (!fb2) {
        logger_1.default.error('Incorrect format');
    }
    const meta = lodash_1.default.omit(parser.book, 'text', 'link', 'binary', 'annotation');
    meta['annotation'] = parser.get_formatted_annotation({ format: 'plain' });
    const text = parser.get_formatted_text({ format: 'plain' });
    const pages = 0;
    return { rawText: lodash_1.default.take(text, 3000).join(''), meta, pages };
};
const processFb2 = async (fileName) => {
    logger_1.default.debug(`Parsing fb2 ${fileName}`);
    return parseFb2(fileName);
};
exports.default = processFb2;

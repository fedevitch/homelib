"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = __importDefault(require("../logger"));
const promises_1 = require("fs/promises");
const word_extractor_1 = __importDefault(require("word-extractor"));
const getDocumentProperties = require('office-document-properties');
const parseMeta = (file) => new Promise((resolve, reject) => {
    getDocumentProperties.fromBuffer(file, (err, meta) => {
        if (err)
            reject(err);
        resolve(meta);
    });
});
const parseWord = async (fileName) => {
    const file = await (0, promises_1.readFile)(fileName);
    const meta = await parseMeta(file);
    const wordExtractor = new word_extractor_1.default();
    const extracted = await wordExtractor.extract(file);
    const text = extracted.getBody();
    return { rawText: lodash_1.default.take(text, 3000).join(''), meta, pages: Number.parseInt(lodash_1.default.get(meta, 'pages', '0')) };
};
const processWord = async (fileName) => {
    logger_1.default.debug(`Parsing Word ${fileName}`);
    return parseWord(fileName);
};
exports.default = processWord;

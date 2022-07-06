"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = __importDefault(require("../logger"));
const comic = require('comic-info');
const parseComicBook = async (fileName) => {
    const _meta = await comic({ path: fileName });
    return { rawText: '', meta: lodash_1.default.omit(_meta, 'dir'), pages: Number.parseInt(lodash_1.default.get(_meta, 'pages', '0')) };
};
const processComicBook = async (fileName) => {
    logger_1.default.debug(`Parsing comic book ${fileName}`);
    return parseComicBook(fileName);
};
exports.default = processComicBook;

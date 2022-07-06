"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = __importDefault(require("../logger"));
const promises_1 = require("fs/promises");
const parseRTF = require('rtf-parser');
const parseRtf = async (file) => {
    return new Promise((resolve, reject) => {
        parseRTF.string(file, (err, doc) => {
            if (err)
                reject(err);
            console.log(doc);
            // @ts-ignore           
            const rawText = lodash_1.default.take(doc.content, 100).map((c) => c.value).join('');
            resolve({ rawText, meta: {}, pages: 0 });
        });
    });
};
const processRtf = async (fileName) => {
    logger_1.default.debug(`Parsing RTF ${fileName}`);
    const file = await (0, promises_1.readFile)(fileName);
    return parseRtf(file.toString());
};
exports.default = processRtf;

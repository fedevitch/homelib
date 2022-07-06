"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const epub_1 = __importDefault(require("epub"));
const logger_1 = __importDefault(require("../logger"));
const parseEpub = async (fileName) => {
    return new Promise((resolve, reject) => {
        const epub = new epub_1.default(fileName);
        epub.on('end', () => {
            const meta = lodash_1.default.pick(epub, 'metadata', 'manifest', 'flow', 'toc');
            epub.getChapter(lodash_1.default.get(epub, 'flow[0].id'), (err, chapterText) => {
                if (err)
                    reject(err);
                resolve({ rawText: chapterText.replaceAll(/(<([^>]+)>)/ig, ''), meta, pages: 0 });
            });
        });
        epub.parse();
    });
};
const processEpub = async (fileName) => {
    logger_1.default.debug(`Parsing epub ${fileName}`);
    return parseEpub(fileName);
};
exports.default = processEpub;

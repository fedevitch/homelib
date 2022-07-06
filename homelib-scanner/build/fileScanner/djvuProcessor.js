"use strict";
// djvudump <filename>
// djvutxt -page=1-5 <filename>
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const scanConfig_1 = __importDefault(require("../scanConfig"));
const child_process_1 = require("child_process");
const lodash_1 = __importDefault(require("lodash"));
const djvuDump = async (fileName) => {
    return new Promise((resolve, reject) => {
        const dumpProcess = (0, child_process_1.spawn)('djvudump', [fileName]);
        let dump = "";
        dumpProcess.stdout.on('data', data => dump += data);
        dumpProcess.on('close', () => resolve(dump));
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
    });
};
const djvuTxt = async (fileName, pages) => {
    return new Promise((resolve, reject) => {
        const dumpProcess = (0, child_process_1.spawn)('djvutxt', [`-page=1-${scanConfig_1.default.TAKE_START_PAGES},${pages - scanConfig_1.default.TAKE_END_PAGES}-${pages}`, fileName]);
        let text = "";
        dumpProcess.stdout.on('data', data => text += data);
        dumpProcess.on('close', () => resolve(text));
        dumpProcess.on('error', reject);
        dumpProcess.stderr.on('data', reject);
    });
};
const parseDjvu = async (fileName) => {
    const dump = await djvuDump(fileName);
    const numbers = dump.match(/([0-9])\w+/g);
    const pages = Number.parseInt(lodash_1.default.get(numbers, '3', 0));
    const meta = { pages, files: Number.parseInt(lodash_1.default.get(numbers, '2', 0)), dump: dump.substring(0, 300) };
    const rawText = await djvuTxt(fileName, pages);
    return { rawText, meta, pages };
};
const processDjvu = async (fileName) => {
    logger_1.default.debug(`Parsing djvu ${fileName}`);
    return parseDjvu(fileName);
};
exports.default = processDjvu;

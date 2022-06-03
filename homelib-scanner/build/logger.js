"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
log4js_1.default.configure({
    appenders: { 'out': { type: 'stdout', layout: { type: 'coloured' } } },
    categories: { default: { appenders: ['out'], level: 'info' } }
});
const logger = log4js_1.default.getLogger("Library Scanner");
logger.level = "debug";
exports.default = logger;

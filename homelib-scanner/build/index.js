"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// todo: make a single point for run scripts here
const logger_1 = __importDefault(require("./logger"));
const file_scanner_1 = require("./file_scanner");
try {
    (0, file_scanner_1.start)();
}
catch (e) {
    logger_1.default.error('Scanner critical error');
    logger_1.default.error(e);
}
const handleError = (err) => {
    // handle the error safely
    logger_1.default.error('UNCAUGHT');
    logger_1.default.error(err);
};
process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);
process.on('uncaughtExceptionMonitor', handleError);

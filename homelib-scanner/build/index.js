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
process.on('uncaughtException', function handleError(err) {
    // handle the error safely
    logger_1.default.error('UNCAUGHT exception');
    logger_1.default.error(err);
    logger_1.default.error(err.stack);
});
process.on('unhandledRejection', function handleError(err) {
    // handle the error safely
    logger_1.default.error('UNCAUGHT rejection');
    logger_1.default.error(err);
});
process.on('uncaughtExceptionMonitor', function handleError(err) {
    // handle the error safely
    logger_1.default.error('UNCAUGHT exception monitor');
    logger_1.default.error(err);
});

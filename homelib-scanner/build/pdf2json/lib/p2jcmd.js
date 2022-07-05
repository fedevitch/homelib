"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PDFProcessor_instances, _PDFProcessor_continue, _PDFProcessor_onPdfParserError, _PDFProcessor_generateMergedTextBlocksStream, _PDFProcessor_generateRawTextContentStream, _PDFProcessor_generateFieldsTypesStream, _PDFProcessor_processAdditionalStreams, _PDFProcessor_onPrimarySuccess, _PDFProcessor_onPrimaryError, _PDFProcessor_parseOnePDFStream, _PDFProcessor_parseOnePDF;
const nodeUtil = require("util"), fs = require("fs"), path = require("path"), { ParserStream, StringifyStream } = require("./parserstream"), pkInfo = require("../package.json"), PDFParser = require("../pdfparser");
const _PRO_TIMER = `${pkInfo.name}@${pkInfo.version} [${pkInfo.homepage}]`;
const yargs = require('./p2jcmdarg')
    .usage(`\n${_PRO_TIMER}\n\nUsage: ${pkInfo.name} -f|--file [-o|output_dir]`)
    .alias('v', 'version', 'Display version.')
    .alias('h', 'help', 'Display brief help information.')
    .alias('f', 'file', '(required) Full path of input PDF file or a directory to scan for all PDF files.\n\t\t When specifying a PDF file name, it must end with .PDF, otherwise it would be treated as a input directory.')
    .alias('o', 'output', '(optional) Full path of output directory, must already exist.\n\t\t Current JSON file in the output folder will be replaced when file name is same.')
    .alias('s', 'silent', '(optional) when specified, will only log errors, otherwise verbose.')
    .alias('t', 'fieldTypes', '(optional) when specified, will generate .fields.json that includes fields ids and types.')
    .alias('c', 'content', '(optional) when specified, will generate .content.txt that includes text content from PDF.')
    .alias('m', 'merge', '(optional) when specified, will generate .merged.json that includes auto-merged broken text blocks from PDF.')
    .alias('r', 'stream', '(optional) when specified, will process and parse with buffer/object transform stream rather than file system.');
const argv = yargs.argv;
const ONLY_SHOW_VERSION = ('v' in argv);
const ONLY_SHOW_HELP = ('h' in argv);
const VERBOSITY_LEVEL = (('s' in argv) ? 0 : 5);
const HAS_INPUT_DIR_OR_FILE = ('f' in argv);
const PROCESS_RAW_TEXT_CONTENT = ('c' in argv);
const PROCESS_FIELDS_CONTENT = ('t' in argv);
const PROCESS_MERGE_BROKEN_TEXT_BLOCKS = ('m' in argv);
const PROCESS_WITH_STREAM = ('r' in argv);
const INPUT_DIR_OR_FILE = argv.f;
class PDFProcessor {
    // constructor
    constructor(inputDir, inputFile, curCLI) {
        _PDFProcessor_instances.add(this);
        this.inputDir = null;
        this.inputFile = null;
        this.inputPath = null;
        this.outputDir = null;
        this.outputFile = null;
        this.outputPath = null;
        this.pdfParser = null;
        this.curCLI = null;
        this.getOutputFile = function () {
            return path.join(this.outputDir, this.outputFile);
        };
        // public, this instance copies
        this.inputDir = path.normalize(inputDir);
        this.inputFile = inputFile;
        this.inputPath = path.join(this.inputDir, this.inputFile);
        this.outputDir = path.normalize(argv.o || inputDir);
        this.outputFile = null;
        this.outputPath = null;
        this.pdfParser = null;
        this.curCLI = curCLI;
    }
    ;
    //public methods
    validateParams() {
        let retVal = null;
        if (!fs.existsSync(this.inputDir))
            retVal = "Input error: input directory doesn't exist - " + this.inputDir + ".";
        else if (!fs.existsSync(this.inputPath))
            retVal = "Input error: input file doesn't exist - " + this.inputPath + ".";
        else if (!fs.existsSync(this.outputDir))
            retVal = "Input error: output directory doesn't exist - " + this.outputDir + ".";
        if (retVal != null) {
            this.curCLI.addResultCount(retVal);
            return retVal;
        }
        const inExtName = path.extname(this.inputFile).toLowerCase();
        if (inExtName !== '.pdf')
            retVal = "Input error: input file name doesn't have pdf extention  - " + this.inputFile + ".";
        else {
            this.outputFile = path.basename(this.inputPath, inExtName) + ".json";
            this.outputPath = path.normalize(this.outputDir + "/" + this.outputFile);
            if (fs.existsSync(this.outputPath))
                nodeUtil.p2jwarn("Output file will be replaced - " + this.outputPath);
            else {
                let fod = fs.openSync(this.outputPath, "wx");
                if (!fod)
                    retVal = "Input error: can not write to " + this.outputPath;
                else {
                    fs.closeSync(fod);
                    fs.unlinkSync(this.outputPath);
                }
            }
        }
        return retVal;
    }
    destroy() {
        this.inputDir = null;
        this.inputFile = null;
        this.inputPath = null;
        this.outputDir = null;
        this.outputPath = null;
        if (this.pdfParser) {
            this.pdfParser.destroy();
        }
        this.pdfParser = null;
        this.curCLI = null;
    }
    processFile(callback) {
        let validateMsg = this.validateParams();
        if (!!validateMsg) {
            __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_continue).call(this, callback, validateMsg);
        }
        else if (PROCESS_WITH_STREAM) {
            __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_parseOnePDFStream).call(this, callback);
        }
        else {
            __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_parseOnePDF).call(this, callback);
        }
    }
}
_PDFProcessor_instances = new WeakSet(), _PDFProcessor_continue = function _PDFProcessor_continue(callback, err) {
    if (typeof callback === "function")
        callback(err);
}, _PDFProcessor_onPdfParserError = function _PDFProcessor_onPdfParserError(evtData, callback) {
    this.curCLI.addResultCount(evtData.parserError);
    __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_continue).call(this, callback, evtData.parserError);
}, _PDFProcessor_generateMergedTextBlocksStream = function _PDFProcessor_generateMergedTextBlocksStream(callback) {
    const outputStream = ParserStream.createOutputStream(this.outputPath.replace(".json", ".merged.json"), callback);
    this.pdfParser.getMergedTextBlocksStream().pipe(new StringifyStream()).pipe(outputStream);
}, _PDFProcessor_generateRawTextContentStream = function _PDFProcessor_generateRawTextContentStream(callback) {
    const outputStream = ParserStream.createOutputStream(this.outputPath.replace(".json", ".content.txt"), callback);
    this.pdfParser.getRawTextContentStream().pipe(outputStream);
}, _PDFProcessor_generateFieldsTypesStream = function _PDFProcessor_generateFieldsTypesStream(callback) {
    const outputStream = ParserStream.createOutputStream(this.outputPath.replace(".json", ".fields.json"), callback);
    this.pdfParser.getAllFieldsTypesStream().pipe(new StringifyStream()).pipe(outputStream);
}, _PDFProcessor_processAdditionalStreams = function _PDFProcessor_processAdditionalStreams(callback) {
    const outputTasks = [];
    if (PROCESS_FIELDS_CONTENT) { //needs to generate fields.json file
        outputTasks.push(cbFunc => __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_generateFieldsTypesStream).call(this, cbFunc));
    }
    if (PROCESS_RAW_TEXT_CONTENT) { //needs to generate content.txt file
        outputTasks.push(cbFunc => __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_generateRawTextContentStream).call(this, cbFunc));
    }
    if (PROCESS_MERGE_BROKEN_TEXT_BLOCKS) { //needs to generate json file with merged broken text blocks
        outputTasks.push(cbFunc => __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_generateMergedTextBlocksStream).call(this, cbFunc));
    }
    let taskId = 0;
    function sequenceTask() {
        if (taskId < outputTasks.length) {
            outputTasks[taskId]((err, ret) => {
                this.curCLI.addStatusMsg(err, `[+]=> ${ret}`);
                taskId++;
                sequenceTask.call(this);
            });
        }
        else
            __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_continue).call(this, callback);
    }
    sequenceTask.call(this);
}, _PDFProcessor_onPrimarySuccess = function _PDFProcessor_onPrimarySuccess(callback) {
    this.curCLI.addResultCount();
    __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_processAdditionalStreams).call(this, callback);
}, _PDFProcessor_onPrimaryError = function _PDFProcessor_onPrimaryError(err, callback) {
    this.curCLI.addResultCount(err);
    callback(err);
}, _PDFProcessor_parseOnePDFStream = function _PDFProcessor_parseOnePDFStream(callback) {
    this.pdfParser = new PDFParser(null, PROCESS_RAW_TEXT_CONTENT);
    this.pdfParser.on("pdfParser_dataError", evtData => __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_onPdfParserError).call(this, evtData, callback));
    const outputStream = fs.createWriteStream(this.outputPath);
    outputStream.on('finish', () => __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_onPrimarySuccess).call(this, callback));
    outputStream.on('error', err => __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_onPrimaryError).call(this, err, callback));
    nodeUtil.p2jinfo("Transcoding Stream " + this.inputFile + " to - " + this.outputPath);
    let inputStream = fs.createReadStream(this.inputPath, { bufferSize: 64 * 1024 });
    inputStream.pipe(this.pdfParser.createParserStream()).pipe(new StringifyStream()).pipe(outputStream);
}, _PDFProcessor_parseOnePDF = function _PDFProcessor_parseOnePDF(callback) {
    this.pdfParser = new PDFParser(null, PROCESS_RAW_TEXT_CONTENT);
    this.pdfParser.on("pdfParser_dataError", evtData => __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_onPdfParserError).call(this, evtData, callback));
    this.pdfParser.on("pdfParser_dataReady", evtData => {
        fs.writeFile(this.outputPath, JSON.stringify(evtData), err => {
            if (err) {
                __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_onPrimaryError).call(this, err, callback);
            }
            else {
                __classPrivateFieldGet(this, _PDFProcessor_instances, "m", _PDFProcessor_onPrimarySuccess).call(this, callback);
            }
        });
    });
    nodeUtil.p2jinfo("Transcoding File " + this.inputFile + " to - " + this.outputPath);
    this.pdfParser.loadPDF(this.inputPath, VERBOSITY_LEVEL);
};
class PDFCLI {
    // constructor
    constructor() {
        this.inputCount = 0;
        this.successCount = 0;
        this.failedCount = 0;
        this.warningCount = 0;
        this.statusMsgs = [];
        this.inputCount = 0;
        this.successCount = 0;
        this.failedCount = 0;
        this.warningCount = 0;
        this.statusMsgs = [];
        this.p2j = null;
    }
    initialize() {
        console.time(_PRO_TIMER);
        nodeUtil.verbosity(VERBOSITY_LEVEL);
        let retVal = true;
        try {
            if (ONLY_SHOW_VERSION) {
                console.log(pkInfo.version);
                retVal = false;
            }
            else if (ONLY_SHOW_HELP) {
                yargs.showHelp();
                retVal = false;
            }
            else if (!HAS_INPUT_DIR_OR_FILE) {
                yargs.showHelp();
                console.error("-f is required to specify input directory or file.");
                retVal = false;
            }
        }
        catch (e) {
            console.error("Exception: " + e.message);
            retVal = false;
        }
        return retVal;
    }
    start() {
        if (!this.initialize()) {
            console.timeEnd(_PRO_TIMER);
            return;
        }
        try {
            console.log("\n" + _PRO_TIMER);
            const inputStatus = fs.statSync(INPUT_DIR_OR_FILE);
            if (inputStatus.isFile()) {
                this.processOneFile();
            }
            else if (inputStatus.isDirectory()) {
                this.processOneDirectory();
            }
        }
        catch (e) {
            console.error("Exception: " + e.message);
            console.timeEnd(_PRO_TIMER);
        }
    }
    complete() {
        if (this.statusMsgs.length > 0)
            console.log(this.statusMsgs);
        console.log(`${this.inputCount} input files\t${this.successCount} success\t${this.failedCount} fail\t${this.warningCount} warning`);
        process.nextTick(() => {
            console.timeEnd(_PRO_TIMER);
            // process.exit((this.inputCount === this.successCount) ? 0 : 1);
        });
    }
    processOneFile() {
        const inputDir = path.dirname(INPUT_DIR_OR_FILE);
        const inputFile = path.basename(INPUT_DIR_OR_FILE);
        this.inputCount = 1;
        this.p2j = new PDFProcessor(inputDir, inputFile, this);
        this.p2j.processFile(err => {
            this.addStatusMsg(err, `${path.join(inputDir, inputFile)} => ${err !== null && err !== void 0 ? err : this.p2j.getOutputFile()}`);
            this.complete();
        });
    }
    processFiles(inputDir, files) {
        let fId = 0;
        this.p2j = new PDFProcessor(inputDir, files[fId], this);
        this.p2j.processFile(function processPDFFile(err) {
            this.addStatusMsg(err, `${path.join(inputDir, files[fId])} => ${err !== null && err !== void 0 ? err : this.p2j.getOutputFile()}`);
            fId++;
            if (fId >= this.inputCount) {
                this.complete();
            }
            else {
                if (this.p2j) {
                    this.p2j.destroy();
                    this.p2j = null;
                }
                this.p2j = new PDFProcessor(inputDir, files[fId], this);
                this.p2j.processFile(processPDFFile.bind(this));
            }
        }.bind(this));
    }
    processOneDirectory() {
        let inputDir = path.normalize(INPUT_DIR_OR_FILE);
        fs.readdir(inputDir, (err, files) => {
            if (err) {
                this.addStatusMsg(true, `[${inputDir}] - ${err.toString()}`);
                this.complete();
            }
            else {
                const _iChars = "!@#$%^&*()+=[]\\\';,/{}|\":<>?~`.-_  ";
                const pdfFiles = files.filter(file => file.substr(-4).toLowerCase() === '.pdf' && _iChars.indexOf(file.substr(0, 1)) < 0);
                this.inputCount = pdfFiles.length;
                if (this.inputCount > 0) {
                    this.processFiles(inputDir, pdfFiles);
                }
                else {
                    this.addStatusMsg(true, `[${inputDir}] - No PDF files found`);
                    this.complete();
                }
            }
        });
    }
    addStatusMsg(error, oneMsg) {
        this.statusMsgs.push(error ? `✗ Error - ${oneMsg}` : `✓ Success - ${oneMsg}`);
    }
    addResultCount(error) {
        (error ? this.failedCount++ : this.successCount++);
    }
}
module.exports = PDFCLI;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PDFParser_instances, _a, _PDFParser_maxBinBufferCount, _PDFParser_binBuffer, _PDFParser_password, _PDFParser_context, _PDFParser_pdfFilePath, _PDFParser_pdfFileMTime, _PDFParser_data, _PDFParser_PDFJS, _PDFParser_processFieldInfoXML, _PDFParser_onPDFJSParseDataReady, _PDFParser_onPDFJSParserDataError, _PDFParser_startParsingPDF, _PDFParser_processBinaryCache;
const fs = require("fs"), { readFile } = require("fs/promises"), { EventEmitter } = require("events"), nodeUtil = require("util"), PDFJS = require("./lib/pdf"), { ParserStream } = require("./lib/parserstream"), { kColors, kFontFaces, kFontStyles } = require("./lib/pdfconst");
class PDFParser extends EventEmitter {
    // constructor
    constructor(context, needRawText, password) {
        //call constructor for super class
        super();
        _PDFParser_instances.add(this);
        //private 
        _PDFParser_password.set(this, "");
        _PDFParser_context.set(this, null); // service context object, only used in Web Service project; null in command line
        _PDFParser_pdfFilePath.set(this, null); //current PDF file to load and parse, null means loading/parsing not started
        _PDFParser_pdfFileMTime.set(this, null); // last time the current pdf was modified, used to recognize changes and ignore cache
        _PDFParser_data.set(this, null); //if file read success, data is PDF content; if failed, data is "err" object
        _PDFParser_PDFJS.set(this, null); //will be initialized in constructor
        _PDFParser_processFieldInfoXML.set(this, false); //disable additional _fieldInfo.xml parsing and merging (do NOT set to true)
        // private
        // service context object, only used in Web Service project; null in command line
        __classPrivateFieldSet(this, _PDFParser_context, context, "f");
        __classPrivateFieldSet(this, _PDFParser_pdfFilePath, null, "f"); //current PDF file to load and parse, null means loading/parsing not started
        __classPrivateFieldSet(this, _PDFParser_pdfFileMTime, null, "f"); // last time the current pdf was modified, used to recognize changes and ignore cache
        __classPrivateFieldSet(this, _PDFParser_data, null, "f"); //if file read success, data is PDF content; if failed, data is "err" object
        __classPrivateFieldSet(this, _PDFParser_processFieldInfoXML, false, "f"); //disable additional _fieldInfo.xml parsing and merging (do NOT set to true)
        __classPrivateFieldSet(this, _PDFParser_PDFJS, new PDFJS(needRawText), "f");
        __classPrivateFieldSet(this, _PDFParser_password, password, "f");
    }
    //public static
    static get colorDict() { return kColors; }
    static get fontFaceDict() { return kFontFaces; }
    static get fontStyleDict() { return kFontStyles; }
    //public getter
    get data() { return __classPrivateFieldGet(this, _PDFParser_data, "f"); }
    get binBufferKey() { return __classPrivateFieldGet(this, _PDFParser_pdfFilePath, "f") + __classPrivateFieldGet(this, _PDFParser_pdfFileMTime, "f"); }
    //public APIs
    createParserStream() {
        return new ParserStream(this, { objectMode: true, bufferSize: 64 * 1024 });
    }
    loadPDF(pdfFilePath, verbosity) {
        return __awaiter(this, void 0, void 0, function* () {
            nodeUtil.verbosity(verbosity || 0);
            nodeUtil.p2jinfo("about to load PDF file " + pdfFilePath);
            __classPrivateFieldSet(this, _PDFParser_pdfFilePath, pdfFilePath, "f");
            try {
                __classPrivateFieldSet(this, _PDFParser_pdfFileMTime, fs.statSync(pdfFilePath).mtimeMs, "f");
                if (__classPrivateFieldGet(this, _PDFParser_processFieldInfoXML, "f")) {
                    __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").tryLoadFieldInfoXML(pdfFilePath);
                }
                if (__classPrivateFieldGet(this, _PDFParser_instances, "m", _PDFParser_processBinaryCache).call(this))
                    return;
                __classPrivateFieldGet(PDFParser, _a, "f", _PDFParser_binBuffer)[this.binBufferKey] = yield readFile(pdfFilePath);
                nodeUtil.p2jinfo(`Load OK: ${pdfFilePath}`);
                __classPrivateFieldGet(this, _PDFParser_instances, "m", _PDFParser_startParsingPDF).call(this);
            }
            catch (err) {
                nodeUtil.p2jerror(`Load Failed: ${pdfFilePath} - ${err}`);
                this.emit("pdfParser_dataError", err);
            }
        });
    }
    // Introduce a way to directly process buffers without the need to write it to a temporary file
    parseBuffer(pdfBuffer) {
        __classPrivateFieldGet(this, _PDFParser_instances, "m", _PDFParser_startParsingPDF).call(this, pdfBuffer);
    }
    getRawTextContent() { return __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").getRawTextContent(); }
    getRawTextContentStream() { return ParserStream.createContentStream(this.getRawTextContent()); }
    getAllFieldsTypes() { return __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").getAllFieldsTypes(); }
    ;
    getAllFieldsTypesStream() { return ParserStream.createContentStream(this.getAllFieldsTypes()); }
    getMergedTextBlocksIfNeeded() { return __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").getMergedTextBlocksIfNeeded(); }
    getMergedTextBlocksStream() { return ParserStream.createContentStream(this.getMergedTextBlocksIfNeeded()); }
    destroy() {
        super.removeAllListeners();
        //context object will be set in Web Service project, but not in command line utility
        if (__classPrivateFieldGet(this, _PDFParser_context, "f")) {
            __classPrivateFieldGet(this, _PDFParser_context, "f").destroy();
            __classPrivateFieldSet(this, _PDFParser_context, null, "f");
        }
        __classPrivateFieldSet(this, _PDFParser_pdfFilePath, null, "f");
        __classPrivateFieldSet(this, _PDFParser_pdfFileMTime, null, "f");
        __classPrivateFieldSet(this, _PDFParser_data, null, "f");
        __classPrivateFieldSet(this, _PDFParser_processFieldInfoXML, false, "f"); //disable additional _fieldInfo.xml parsing and merging (do NOT set to true)
        __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").destroy();
        __classPrivateFieldSet(this, _PDFParser_PDFJS, null, "f");
    }
}
_a = PDFParser, _PDFParser_password = new WeakMap(), _PDFParser_context = new WeakMap(), _PDFParser_pdfFilePath = new WeakMap(), _PDFParser_pdfFileMTime = new WeakMap(), _PDFParser_data = new WeakMap(), _PDFParser_PDFJS = new WeakMap(), _PDFParser_processFieldInfoXML = new WeakMap(), _PDFParser_instances = new WeakSet(), _PDFParser_onPDFJSParseDataReady = function _PDFParser_onPDFJSParseDataReady(data) {
    if (!data) { //v1.1.2: data===null means end of parsed data
        nodeUtil.p2jinfo("PDF parsing completed.");
        this.emit("pdfParser_dataReady", __classPrivateFieldGet(this, _PDFParser_data, "f"));
    }
    else {
        __classPrivateFieldSet(this, _PDFParser_data, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _PDFParser_data, "f")), data), "f");
    }
}, _PDFParser_onPDFJSParserDataError = function _PDFParser_onPDFJSParserDataError(err) {
    __classPrivateFieldSet(this, _PDFParser_data, null, "f");
    this.emit("pdfParser_dataError", { "parserError": err });
    // this.emit("error", err);
}, _PDFParser_startParsingPDF = function _PDFParser_startParsingPDF(buffer) {
    __classPrivateFieldSet(this, _PDFParser_data, {}, "f");
    __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").on("pdfjs_parseDataReady", data => __classPrivateFieldGet(this, _PDFParser_instances, "m", _PDFParser_onPDFJSParseDataReady).call(this, data));
    __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").on("pdfjs_parseDataError", err => __classPrivateFieldGet(this, _PDFParser_instances, "m", _PDFParser_onPDFJSParserDataError).call(this, err));
    //v1.3.0 the following Readable Stream-like events are replacement for the top two custom events
    __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").on("readable", meta => this.emit("readable", meta));
    __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").on("data", data => this.emit("data", data));
    __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").on("error", err => __classPrivateFieldGet(this, _PDFParser_instances, "m", _PDFParser_onPDFJSParserDataError).call(this, err));
    __classPrivateFieldGet(this, _PDFParser_PDFJS, "f").parsePDFData(buffer || __classPrivateFieldGet(PDFParser, _a, "f", _PDFParser_binBuffer)[this.binBufferKey], __classPrivateFieldGet(this, _PDFParser_password, "f"));
}, _PDFParser_processBinaryCache = function _PDFParser_processBinaryCache() {
    if (this.binBufferKey in __classPrivateFieldGet(PDFParser, _a, "f", _PDFParser_binBuffer)) {
        __classPrivateFieldGet(this, _PDFParser_instances, "m", _PDFParser_startParsingPDF).call(this);
        return true;
    }
    const allKeys = Object.keys(__classPrivateFieldGet(PDFParser, _a, "f", _PDFParser_binBuffer));
    if (allKeys.length > __classPrivateFieldGet(PDFParser, _a, "f", _PDFParser_maxBinBufferCount)) {
        const idx = this.id % __classPrivateFieldGet(PDFParser, _a, "f", _PDFParser_maxBinBufferCount);
        const key = allKeys[idx];
        __classPrivateFieldGet(PDFParser, _a, "f", _PDFParser_binBuffer)[key] = null;
        delete __classPrivateFieldGet(PDFParser, _a, "f", _PDFParser_binBuffer)[key];
        nodeUtil.p2jinfo("re-cycled cache for " + key);
    }
    return false;
};
//private static    
_PDFParser_maxBinBufferCount = { value: 10 };
_PDFParser_binBuffer = { value: {} };
module.exports = PDFParser;

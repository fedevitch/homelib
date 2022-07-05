"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PDFPageParser_instances, _PDFPageParser__addField;
const nodeUtil = require("util"), { EventEmitter } = require("events"), { Blob } = require("buffer"), fs = require("fs"), DOMParser = require("@xmldom/xmldom").DOMParser, PDFCanvas = require("./pdfcanvas"), PDFUnit = require("./pdfunit"), PDFField = require("./pdffield"), PDFAnno = require("./pdfanno"), Image = require("./pdfimage"), pkInfo = require("../package.json"), PDFFont = require("./pdffont");
const _pdfjsFiles = [
    'shared/util.js',
    'shared/colorspace.js',
    'shared/pattern.js',
    'shared/function.js',
    'shared/annotation.js',
    'core/core.js',
    'core/obj.js',
    'core/charsets.js',
    'core/crypto.js',
    'core/evaluator.js',
    'core/fonts.js',
    'core/font_renderer.js',
    'core/glyphlist.js',
    'core/image.js',
    'core/metrics.js',
    'core/parser.js',
    'core/stream.js',
    'core/worker.js',
    'core/jpx.js',
    'core/jbig2.js',
    'core/bidi.js',
    'core/jpg.js',
    'core/chunked_stream.js',
    'core/pdf_manager.js',
    'core/cmap.js',
    'core/cidmaps.js',
    'display/canvas.js',
    'display/font_loader.js',
    'display/metadata.js',
    'display/api.js'
];
const _PARSER_SIG = `${pkInfo.name}@${pkInfo.version} [${pkInfo.homepage}]`;
//////replacing HTML5 canvas with PDFCanvas (in-memory canvas)
function createScratchCanvas(width, height) { return new PDFCanvas({}, width, height); }
const PDFJS = {};
const globalScope = { console };
const _basePath = __dirname + "/../base/";
let _fileContent = '';
_pdfjsFiles.forEach((fieldName, idx, arr) => _fileContent += fs.readFileSync(_basePath + fieldName, 'utf8'));
eval(_fileContent);
const scanConfig = require("../../scanConfig");
////////////////////////////////start of helper classes
class PDFPageParser {
    // constructor
    constructor(pdfPage, id, scale, ptiParser) {
        _PDFPageParser_instances.add(this);
        //public
        this.id = -1;
        this.pdfPage = null;
        this.ptiParser = null;
        this.scale = 0;
        this.viewport = null;
        this.renderingState = -1;
        this.Fields = null;
        this.Boxsets = null;
        this.ctxCanvas = null;
        // public, this instance copies
        this.id = id;
        this.pdfPage = pdfPage;
        this.ptiParser = ptiParser;
        this.scale = scale || 1.0;
        //leave out the 2nd parameter in order to use page's default rotation (for both portrait and landscape form)
        this.viewport = this.pdfPage.getViewport(this.scale);
        this.renderingState = PDFPageParser.RenderingStates.INITIAL;
        //form elements other than radio buttons and check boxes
        this.Fields = [];
        //form elements: radio buttons and check boxes
        this.Boxsets = [];
        this.ctxCanvas = {};
    }
    get width() { return PDFUnit.toFormX(this.viewport.width); }
    get height() { return PDFUnit.toFormY(this.viewport.height); }
    get HLines() { return this.ctxCanvas.HLines; }
    get VLines() { return this.ctxCanvas.VLines; }
    get Fills() { return this.ctxCanvas.Fills; }
    get Texts() { return this.ctxCanvas.Texts; }
    destroy() {
        this.pdfPage.destroy();
        this.pdfPage = null;
        this.ptiParser = null;
        this.Fields = null;
        this.Boxsets = null;
        this.ctxCanvas = null;
    }
    getPagePoint(x, y) {
        return this.viewport.convertToPdfPoint(x, y);
    }
    parsePage(callback, errorCallBack) {
        if (this.renderingState !== PDFPageParser.RenderingStates.INITIAL) {
            errorCallBack('Must be in new state before drawing');
            return;
        }
        this.renderingState = PDFPageParser.RenderingStates.RUNNING;
        const canvas = createScratchCanvas(1, 1);
        const ctx = canvas.getContext('2d');
        function pageViewDrawCallback(error) {
            this.renderingState = PDFPageParser.RenderingStates.FINISHED;
            if (error) {
                console.error(error);
                errorCallBack(`Error: Page ${this.id + 1}: ${error.message}`);
            }
            else {
                if (this.ptiParser) {
                    const extraFields = this.ptiParser.getFields(parseInt(this.id) + 1);
                    extraFields.forEach(field => __classPrivateFieldGet(this, _PDFPageParser_instances, "m", _PDFPageParser__addField).call(this, field));
                }
                this.ctxCanvas = ctx.canvas;
                this.stats = this.pdfPage.stats;
                nodeUtil.p2jinfo(`Success: Page ${this.id + 1}`);
                callback();
            }
        }
        const renderContext = {
            canvasContext: ctx,
            viewport: this.viewport
        };
        this.pdfPage.render(renderContext).then(data => {
            this.pdfPage.getAnnotations().then(fields => {
                fields.forEach(field => __classPrivateFieldGet(this, _PDFPageParser_instances, "m", _PDFPageParser__addField).call(this, field));
                pageViewDrawCallback.call(this, null);
            }, err => errorCallBack("pdfPage.getAnnotations error:" + err));
        }, err => pageViewDrawCallback.call(this, err));
    }
}
_PDFPageParser_instances = new WeakSet(), _PDFPageParser__addField = function _PDFPageParser__addField(field) {
    if (!PDFField.isFormElement(field)) {
        nodeUtil.p2jwarn("NOT valid form element", field);
        return;
    }
    const oneField = new PDFField(field, this.viewport, this.Fields, this.Boxsets);
    oneField.processField();
};
//static
PDFPageParser.RenderingStates = {
    INITIAL: 0,
    RUNNING: 1,
    PAUSED: 2,
    FINISHED: 3
};
////////////////////////////////Start of Node.js Module
class PDFJSClass extends EventEmitter {
    // constructor
    constructor(needRawText) {
        super();
        this.pdfDocument = null;
        this.pages = null;
        this.rawTextContents = null;
        this.needRawText = null;
        // public, this instance copies
        this.pdfDocument = null;
        this.pages = [];
        this.rawTextContents = [];
        this.needRawText = needRawText;
    }
    raiseErrorEvent(errMsg) {
        console.error(errMsg);
        process.nextTick(() => this.emit("pdfjs_parseDataError", errMsg));
        // this.emit("error", errMsg);
        return errMsg;
    }
    raiseReadyEvent(data) {
        process.nextTick(() => this.emit("pdfjs_parseDataReady", data));
        return data;
    }
    parsePDFData(arrayBuffer, password) {
        this.pdfDocument = null;
        const parameters = { password: password, data: arrayBuffer };
        PDFJS.getDocument(parameters).then(pdfDocument => this.load(pdfDocument, 1), error => this.raiseErrorEvent(error));
    }
    ;
    tryLoadFieldInfoXML(pdfFilePath) {
        const _sufInfo = "_fieldInfo.xml";
        const fieldInfoXMLPath = pdfFilePath.replace(".pdf", _sufInfo);
        if ((fieldInfoXMLPath.indexOf(_sufInfo) < 1) || (!fs.existsSync(fieldInfoXMLPath))) {
            return;
        }
        nodeUtil.p2jinfo("About to load fieldInfo XML : " + fieldInfoXMLPath);
        let PTIXmlParser = require('./ptixmlinject');
        this.ptiParser = new PTIXmlParser();
        this.ptiParser.parseXml(fieldInfoXMLPath, err => {
            if (err) {
                nodeUtil.p2jwarn("fieldInfo XML Error: " + JSON.stringify(err));
                this.ptiParser = null;
            }
            else {
                nodeUtil.p2jinfo("fieldInfo XML loaded.");
            }
        });
    }
    load(pdfDocument, scale) {
        this.pdfDocument = pdfDocument;
        return this.loadMetaData().then(() => this.loadPages(), error => this.raiseErrorEvent("loadMetaData error: " + error));
    }
    loadMetaData() {
        return this.pdfDocument.getMetadata().then(data => {
            var _a, _b;
            this.documentInfo = data.info;
            this.metadata = (_b = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.metadata) !== null && _b !== void 0 ? _b : {};
            this.parseMetaData();
        }, error => this.raiseErrorEvent("pdfDocument.getMetadata error: " + error));
    }
    parseMetaData() {
        const meta = { Transcoder: _PARSER_SIG, Meta: Object.assign(Object.assign({}, this.documentInfo), { Metadata: this.metadata }) };
        this.raiseReadyEvent(meta);
        this.emit("readable", meta);
    }
    loadPages() {
        try {
            const pagesCount = this.pdfDocument.numPages;
            const pagePromises = [];
            // load only first and last pages here
            for (let i = 1; i <= pagesCount; i++) {
                if (i <= scanConfig.default.TAKE_START_PAGES || i >= scanConfig.default.TAKE_END_PAGES) {
                    pagePromises.push(this.pdfDocument.getPage(i));
                }
            }
            const pagesPromise = PDFJS.Promise.all(pagePromises);
            nodeUtil.p2jinfo("PDF loaded. pagesCount = " + pagesCount);
            return pagesPromise.then(promisedPages => this.parsePage(promisedPages, 0, 1.5), error => {
                console.error(error);
                this.raiseErrorEvent("pagesPromise error: " + error);
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    parsePage(promisedPages, id, scale) {
        nodeUtil.p2jinfo("start to parse page:" + (id + 1));
        const pdfPage = promisedPages[id];
        const pageParser = new PDFPageParser(pdfPage, id, scale, this.ptiParser);
        function continueOnNextPage() {
            nodeUtil.p2jinfo("complete parsing page:" + (id + 1));
            if (id === (this.pdfDocument.numPages - 1)) {
                this.raiseReadyEvent({ Pages: this.pages });
                //v1.1.2: signal end of parsed data with null
                process.nextTick(() => this.raiseReadyEvent(null));
                this.emit("data", null);
            }
            else {
                process.nextTick(() => this.parsePage(promisedPages, ++id, scale));
            }
        }
        pageParser.parsePage(data => {
            const page = {
                Width: pageParser.width,
                Height: pageParser.height,
                HLines: pageParser.HLines,
                VLines: pageParser.VLines,
                Fills: pageParser.Fills,
                //needs to keep current default output format, text content will output to a separate file if '-c' command line argument is set
                //                Content:pdfPage.getTextContent(),
                Texts: pageParser.Texts,
                Fields: pageParser.Fields,
                Boxsets: pageParser.Boxsets
            };
            this.pages.push(page);
            this.emit("data", page);
            if (this.needRawText) {
                pdfPage.getTextContent().then(textContent => {
                    this.rawTextContents.push(textContent);
                    nodeUtil.p2jinfo("complete parsing raw text content:" + (id + 1));
                    continueOnNextPage.call(this);
                }, error => this.raiseErrorEvent("pdfPage.getTextContent error: " + error));
            }
            else {
                continueOnNextPage.call(this);
            }
        }, errMsg => this.raiseErrorEvent(errMsg));
    }
    getRawTextContent() {
        let retVal = "";
        if (!this.needRawText)
            return retVal;
        this.rawTextContents.forEach((textContent, index) => {
            let prevText = null;
            textContent.bidiTexts.forEach((textObj, idx) => {
                if (prevText) {
                    if (Math.abs(textObj.y - prevText.y) <= 9) {
                        prevText.str += textObj.str;
                    }
                    else {
                        retVal += prevText.str + "\r\n";
                        prevText = textObj;
                    }
                }
                else {
                    prevText = textObj;
                }
            });
            if (prevText) {
                retVal += prevText.str;
            }
            retVal += "\r\n----------------Page (" + index + ") Break----------------\r\n";
        });
        return retVal;
    }
    getAllFieldsTypes() {
        return PDFField.getAllFieldsTypes({ Pages: this.pages || [] });
    }
    getMergedTextBlocksIfNeeded() {
        for (let p = 0; p < this.pages.length; p++) {
            let prevText = null;
            let page = this.pages[p];
            page.Texts.sort(PDFFont.compareBlockPos);
            page.Texts = page.Texts.filter((t, j) => {
                let isDup = (j > 0) && PDFFont.areDuplicateBlocks(page.Texts[j - 1], t);
                if (isDup) {
                    nodeUtil.p2jinfo("skipped: dup text block: " + decodeURIComponent(t.R[0].T));
                }
                return !isDup;
            });
            for (let i = 0; i < page.Texts.length; i++) {
                let text = page.Texts[i];
                if (prevText) {
                    if (PDFFont.areAdjacentBlocks(prevText, text) && PDFFont.haveSameStyle(prevText, text)) {
                        let preT = decodeURIComponent(prevText.R[0].T);
                        let curT = decodeURIComponent(text.R[0].T);
                        prevText.R[0].T += text.R[0].T;
                        prevText.w += text.w;
                        text.merged = true;
                        let mergedText = decodeURIComponent(prevText.R[0].T);
                        nodeUtil.p2jinfo(`merged text block: ${preT} + ${curT} => ${mergedText}`);
                        prevText = null; //yeah, only merge two blocks for now
                    }
                    else {
                        prevText = text;
                    }
                }
                else {
                    prevText = text;
                }
            }
            page.Texts = page.Texts.filter(t => !t.merged);
        }
        return { Pages: this.pages };
    }
    destroy() {
        this.removeAllListeners();
        if (this.pdfDocument)
            this.pdfDocument.destroy();
        this.pdfDocument = null;
        this.pages = null;
        this.rawTextContents = null;
    }
}
module.exports = PDFJSClass;

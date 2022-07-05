"use strict";
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
var _ParserStream_pdfParser, _ParserStream_chunks, _ParserStream_parsedData, _ParserStream__flush_callback;
const { Transform, Readable } = require("stream"), fs = require('fs');
class ParserStream extends Transform {
    constructor(pdfParser, options) {
        super(options);
        _ParserStream_pdfParser.set(this, null);
        _ParserStream_chunks.set(this, []);
        _ParserStream_parsedData.set(this, { Pages: [] });
        _ParserStream__flush_callback.set(this, null);
        __classPrivateFieldSet(this, _ParserStream_pdfParser, pdfParser, "f");
        __classPrivateFieldSet(this, _ParserStream_chunks, [], "f");
        // this.#pdfParser.on("pdfParser_dataReady", evtData => {
        //     this.push(evtData);
        //     this.#_flush_callback();
        //     this.emit('end', null);
        // });
        __classPrivateFieldGet(this, _ParserStream_pdfParser, "f").on("readable", meta => __classPrivateFieldSet(this, _ParserStream_parsedData, Object.assign(Object.assign({}, meta), { Pages: [] }), "f"));
        __classPrivateFieldGet(this, _ParserStream_pdfParser, "f").on("data", page => {
            if (!page) {
                this.push(__classPrivateFieldGet(this, _ParserStream_parsedData, "f"));
                __classPrivateFieldGet(this, _ParserStream__flush_callback, "f").call(this);
            }
            else
                __classPrivateFieldGet(this, _ParserStream_parsedData, "f").Pages.push(page);
        });
    }
    static createContentStream(jsonObj) {
        const rStream = new Readable({ objectMode: true });
        rStream.push(jsonObj);
        rStream.push(null);
        return rStream;
    }
    static createOutputStream(outputPath, callback) {
        const outputStream = fs.createWriteStream(outputPath);
        outputStream.on('finish', () => {
            callback(null, outputPath);
        });
        outputStream.on('error', err => {
            callback({ "streamError": err }, outputPath);
        });
        return outputStream;
    }
    //implements transform stream
    _transform(chunk, enc, callback) {
        __classPrivateFieldGet(this, _ParserStream_chunks, "f").push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc));
        callback();
    }
    _flush(callback) {
        __classPrivateFieldSet(this, _ParserStream__flush_callback, callback, "f");
        __classPrivateFieldGet(this, _ParserStream_pdfParser, "f").parseBuffer(Buffer.concat(__classPrivateFieldGet(this, _ParserStream_chunks, "f")));
    }
    _destroy() {
        super.removeAllListeners();
        __classPrivateFieldSet(this, _ParserStream_pdfParser, null, "f");
        __classPrivateFieldSet(this, _ParserStream_chunks, [], "f");
    }
}
_ParserStream_pdfParser = new WeakMap(), _ParserStream_chunks = new WeakMap(), _ParserStream_parsedData = new WeakMap(), _ParserStream__flush_callback = new WeakMap();
class StringifyStream extends Transform {
    constructor(options) {
        super(options);
        this._readableState.objectMode = false;
        this._writableState.objectMode = true;
    }
    _transform(obj, encoding, callback) {
        this.push(JSON.stringify(obj));
        callback();
    }
}
module.exports = { ParserStream, StringifyStream };

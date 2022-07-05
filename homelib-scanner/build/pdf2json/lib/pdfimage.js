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
var _PDFImage__src, _PDFImage__onload;
class PDFImage {
    constructor() {
        _PDFImage__src.set(this, '');
        _PDFImage__onload.set(this, null);
    }
    set onload(val) {
        __classPrivateFieldSet(this, _PDFImage__onload, typeof val === 'function' ? val : null, "f");
    }
    get onload() {
        return __classPrivateFieldGet(this, _PDFImage__onload, "f");
    }
    set src(val) {
        __classPrivateFieldSet(this, _PDFImage__src, val, "f");
        if (__classPrivateFieldGet(this, _PDFImage__onload, "f"))
            __classPrivateFieldGet(this, _PDFImage__onload, "f").call(this);
    }
    get src() {
        return __classPrivateFieldGet(this, _PDFImage__src, "f");
    }
    btoa(val) {
        if (typeof window === 'undefined') {
            return (new Buffer.from(val, 'ascii')).toString('base64');
        }
        else if (typeof window.btoa === 'function')
            return window.btoa(val);
        return "";
    }
}
_PDFImage__src = new WeakMap(), _PDFImage__onload = new WeakMap();
module.exports = PDFImage;

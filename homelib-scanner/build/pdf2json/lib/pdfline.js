"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PDFLine_instances, _PDFLine_setStartPoint;
const nodeUtil = require("util"), PDFUnit = require("./pdfunit");
class PDFLine {
    constructor(x1, y1, x2, y2, lineWidth, color, dashed) {
        _PDFLine_instances.add(this);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.lineWidth = lineWidth || 1.0;
        this.color = color;
        this.dashed = dashed;
    }
    processLine(targetData) {
        const xDelta = Math.abs(this.x2 - this.x1);
        const yDelta = Math.abs(this.y2 - this.y1);
        const minDelta = this.lineWidth;
        let oneLine = { x: 0, y: 0, w: PDFUnit.toFixedFloat(this.lineWidth), l: 0 };
        //MQZ Aug.28.2013, adding color support, using color dictionary and default to black
        const clrId = PDFUnit.findColorIndex(this.color);
        const colorObj = (clrId > 0 && clrId < PDFUnit.colorCount()) ? { clr: clrId } : { oc: this.color };
        oneLine = Object.assign(Object.assign({}, oneLine), colorObj);
        //MQZ Aug.29 dashed line support
        if (this.dashed) {
            oneLine = oneLine = Object.assign(Object.assign({}, oneLine), { dsh: 1 });
        }
        if ((yDelta < this.lineWidth) && (xDelta > minDelta)) { //HLine
            if (this.lineWidth < 4 && (xDelta / this.lineWidth < 4)) {
                nodeUtil.p2jinfo("Skipped: short thick HLine: lineWidth = " + this.lineWidth + ", xDelta = " + xDelta);
                return; //skip short thick lines, like PA SPP lines behinds checkbox
            }
            oneLine.l = PDFUnit.toFormX(xDelta);
            if (this.x1 > this.x2)
                __classPrivateFieldGet(this, _PDFLine_instances, "m", _PDFLine_setStartPoint).call(this, oneLine, this.x2, this.y2);
            else
                __classPrivateFieldGet(this, _PDFLine_instances, "m", _PDFLine_setStartPoint).call(this, oneLine, this.x1, this.y1);
            targetData.HLines.push(oneLine);
        }
        else if ((xDelta < this.lineWidth) && (yDelta > minDelta)) { //VLine
            if (this.lineWidth < 4 && (yDelta / this.lineWidth < 4)) {
                nodeUtil.p2jinfo("Skipped: short thick VLine: lineWidth = " + this.lineWidth + ", yDelta = " + yDelta);
                return; //skip short think lines, like PA SPP lines behinds checkbox
            }
            oneLine.l = PDFUnit.toFormY(yDelta);
            if (this.y1 > this.y2)
                __classPrivateFieldGet(this, _PDFLine_instances, "m", _PDFLine_setStartPoint).call(this, oneLine, this.x2, this.y2);
            else
                __classPrivateFieldGet(this, _PDFLine_instances, "m", _PDFLine_setStartPoint).call(this, oneLine, this.x1, this.y1);
            targetData.VLines.push(oneLine);
        }
    }
}
_PDFLine_instances = new WeakSet(), _PDFLine_setStartPoint = function _PDFLine_setStartPoint(oneLine, x, y) {
    oneLine.x = PDFUnit.toFormX(x);
    oneLine.y = PDFUnit.toFormY(y);
};
module.exports = PDFLine;

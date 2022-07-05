"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PDFField_instances, _a, _PDFField_normalizeRect, _PDFField_getFieldPosition, _PDFField_getFieldBaseData, _PDFField_addAlpha, _PDFField_addCheckBox, _PDFField_addRadioButton, _PDFField_addLinkButton, _PDFField_addSelect, _PDFField_addSignature;
const nodeUtil = require("util"), PDFUnit = require("./pdfunit");
const kFBANotOverridable = 0x00000400; // indicates the field is read only by the user
const kFBARequired = 0x00000010; // indicates the field is required
const kMinHeight = 20;
class PDFField {
    // constructor
    constructor(field, viewport, Fields, Boxsets) {
        _PDFField_instances.add(this);
        this.field = field;
        this.viewport = viewport;
        this.Fields = Fields;
        this.Boxsets = Boxsets;
    }
    static isWidgetSupported(field) {
        let retVal = false;
        switch (field.fieldType) {
            case 'Tx':
                retVal = true;
                break; //text input
            case 'Btn':
                if (field.fieldFlags & 32768) {
                    field.fieldType = 'Rd'; //radio button
                }
                else if (field.fieldFlags & 65536) {
                    field.fieldType = 'Btn'; //push button
                }
                else {
                    field.fieldType = 'Cb'; //checkbox
                }
                retVal = true;
                break;
            case 'Ch':
                retVal = true;
                break; //drop down
            case 'Sig':
                retVal = true;
                break; //signature
            default:
                nodeUtil.p2jwarn("Unsupported: field.fieldType of " + field.fieldType);
                break;
        }
        return retVal;
    }
    static isFormElement(field) {
        let retVal = false;
        switch (field.subtype) {
            case 'Widget':
                retVal = PDFField.isWidgetSupported(field);
                break;
            default:
                nodeUtil.p2jwarn("Unsupported: field.type of " + field.subtype);
                break;
        }
        return retVal;
    }
    ;
    // public instance methods
    processField() {
        this.field.TI = PDFField.tabIndex++;
        switch (this.field.fieldType) {
            case 'Tx':
                __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_addAlpha).call(this, this.field);
                break;
            case 'Cb':
                __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_addCheckBox).call(this, this.field);
                break;
            case 'Rd':
                __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_addRadioButton).call(this, this.field);
                break;
            case 'Btn':
                __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_addLinkButton).call(this, this.field);
                break;
            case 'Ch':
                __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_addSelect).call(this, this.field);
                break;
            case 'Sig':
                __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_addSignature).call(this, this.field);
                break;
        }
        this.clean();
    }
    clean() {
        delete this.field;
        delete this.viewport;
        delete this.Fields;
        delete this.Boxsets;
    }
    //static public method to generate fieldsType object based on parser result
    static getAllFieldsTypes(data) {
        const isFieldReadOnly = field => {
            return (field.AM & kFBANotOverridable) ? true : false;
        };
        const getFieldBase = field => {
            return { id: field.id.Id, type: field.T.Name, calc: isFieldReadOnly(field), value: field.V || "" };
        };
        let retVal = [];
        data.Pages.forEach(page => {
            page.Boxsets.forEach(boxsets => {
                if (boxsets.boxes.length > 1) { //radio button
                    boxsets.boxes.forEach(box => {
                        retVal.push({ id: boxsets.id.Id, type: "radio", calc: isFieldReadOnly(box), value: box.id.Id });
                    });
                }
                else { //checkbox
                    retVal.push(getFieldBase(boxsets.boxes[0]));
                }
            });
            page.Fields.forEach(field => retVal.push(getFieldBase(field)));
        });
        return retVal;
    }
}
_a = PDFField, _PDFField_instances = new WeakSet(), _PDFField_normalizeRect = function _PDFField_normalizeRect(rect) {
    const r = rect.slice(0); // clone rect
    if (rect[0] > rect[2]) {
        r[0] = rect[2];
        r[2] = rect[0];
    }
    if (rect[1] > rect[3]) {
        r[1] = rect[3];
        r[3] = rect[1];
    }
    return r;
}, _PDFField_getFieldPosition = function _PDFField_getFieldPosition(field) {
    let viewPort = this.viewport;
    let fieldRect = viewPort.convertToViewportRectangle(field.rect);
    let rect = __classPrivateFieldGet(PDFField, _a, "m", _PDFField_normalizeRect).call(PDFField, fieldRect);
    let height = rect[3] - rect[1];
    if (field.fieldType === 'Tx') {
        if (height > kMinHeight + 2) {
            rect[1] += 2;
            height -= 2;
        }
    }
    else if (field.fieldType !== 'Ch') { //checkbox, radio button, and link button
        rect[1] -= 3;
    }
    height = (height >= kMinHeight) ? height : kMinHeight;
    return {
        x: PDFUnit.toFormX(rect[0]),
        y: PDFUnit.toFormY(rect[1]),
        w: PDFUnit.toFormX(rect[2] - rect[0]),
        h: PDFUnit.toFormY(height)
    };
}, _PDFField_getFieldBaseData = function _PDFField_getFieldBaseData(field) {
    let attributeMask = 0;
    //PDF Spec p.676 TABLE 8.70 Field flags common to all field types
    if (field.fieldFlags & 0x00000001) {
        attributeMask |= kFBANotOverridable;
    }
    if (field.fieldFlags & 0x00000002) {
        attributeMask |= kFBARequired;
    }
    let anData = {
        id: { Id: field.fullName, EN: 0 },
        TI: field.TI,
        AM: attributeMask
    };
    //PDF Spec p.675: add TU (AlternativeText) fields to provide accessibility info
    if (field.alternativeText && field.alternativeText.length > 1) {
        anData.TU = field.alternativeText;
    }
    if (field.alternativeID && field.alternativeID.length > 1) {
        anData.TM = field.alternativeID;
    }
    return Object.assign(anData, __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_getFieldPosition).call(this, field));
}, _PDFField_addAlpha = function _PDFField_addAlpha(field) {
    const anData = Object.assign({
        style: 48,
        T: {
            Name: field.TName || "alpha",
            TypeInfo: {}
        }
    }, __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_getFieldBaseData).call(this, field));
    if (field.MV) { //field attributes: arbitrary mask value
        anData.MV = field.MV;
    }
    if (field.fieldValue) {
        anData.V = field.fieldValue; //read-only field value, like "self-prepared"
    }
    this.Fields.push(anData);
}, _PDFField_addCheckBox = function _PDFField_addCheckBox(box) {
    const anData = Object.assign({
        style: 48,
        T: {
            Name: "box",
            TypeInfo: {}
        }
    }, __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_getFieldBaseData).call(this, box));
    if (box.fieldValue) {
        anData.checked = box.fieldValue !== 'Off';
    }
    this.Boxsets.push({ boxes: [anData] });
}, _PDFField_addRadioButton = function _PDFField_addRadioButton(box) {
    const anData = Object.assign({
        style: 48,
        T: {
            Name: "box",
            TypeInfo: {}
        }
    }, __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_getFieldBaseData).call(this, box));
    anData.id.Id = box.value;
    if ('checked' in box) {
        anData.checked = box.checked;
    }
    const rdGroup = this.Boxsets.filter(boxset => ('id' in boxset) && ('Id' in boxset.id) && (boxset.id.Id === box.fullName))[0];
    if ((!!rdGroup) && ('boxes' in rdGroup)) {
        rdGroup.boxes.push(anData);
    }
    else {
        this.Boxsets.push({ boxes: [anData], id: { Id: box.fullName, EN: 0 } });
    }
}, _PDFField_addLinkButton = function _PDFField_addLinkButton(field) {
    const anData = Object.assign({
        style: 48,
        T: {
            Name: "link"
        },
        FL: {
            form: { Id: field.FL }
        }
    }, __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_getFieldBaseData).call(this, field));
    this.Fields.push(anData);
}, _PDFField_addSelect = function _PDFField_addSelect(field) {
    const anData = Object.assign({
        style: 48,
        T: {
            Name: "alpha",
            TypeInfo: {}
        }
    }, __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_getFieldBaseData).call(this, field));
    anData.w -= 0.5; //adjust combobox width
    anData.PL = { V: [], D: [] };
    field.value.forEach((ele, idx) => {
        if (Array.isArray(ele)) {
            anData.PL.D.push(ele[0]);
            anData.PL.V.push(ele[1]);
        }
        else {
            anData.PL.D.push(ele);
            anData.PL.V.push(ele);
        }
    });
    // add field value to the object 
    if (field.fieldValue) {
        anData.V = field.fieldValue;
    }
    this.Fields.push(anData);
}, _PDFField_addSignature = function _PDFField_addSignature(field) {
    const anData = Object.assign({
        style: 48,
        T: {
            Name: "signature",
            TypeInfo: {}
        }
    }, __classPrivateFieldGet(this, _PDFField_instances, "m", _PDFField_getFieldBaseData).call(this, field));
    if (field.Sig) {
        anData.Sig = {};
        if (field.Sig.Name)
            anData.Sig.Name = field.Sig.Name;
        if (field.Sig.M)
            anData.Sig.M = PDFUnit.dateToIso8601(field.Sig.M);
        if (field.Sig.Location)
            anData.Sig.Location = field.Sig.Location;
        if (field.Sig.Reason)
            anData.Sig.Reason = field.Sig.Reason;
        if (field.Sig.ContactInfo)
            anData.Sig.ContactInfo = field.Sig.ContactInfo;
    }
    this.Fields.push(anData);
};
PDFField.tabIndex = 0;
module.exports = PDFField;

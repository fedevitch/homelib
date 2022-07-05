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
var _CLIArgParser_instances, _CLIArgParser_aliases, _CLIArgParser_usage, _CLIArgParser_argv, _CLIArgParser_setArg, _CLIArgParser_setKey, _CLIArgParser_parseArgv;
class CLIArgParser {
    // constructor
    constructor(args) {
        _CLIArgParser_instances.add(this);
        this.args = [];
        _CLIArgParser_aliases.set(this, {});
        _CLIArgParser_usage.set(this, "");
        _CLIArgParser_argv.set(this, null);
        if (Array.isArray(args))
            this.args = args;
    }
    usage(usageMsg) {
        __classPrivateFieldSet(this, _CLIArgParser_usage, usageMsg + '\n\nOptions:\n', "f");
        return this;
    }
    alias(key, name, description) {
        __classPrivateFieldGet(this, _CLIArgParser_aliases, "f")[key] = { name, description };
        return this;
    }
    showHelp() {
        let helpMsg = __classPrivateFieldGet(this, _CLIArgParser_usage, "f");
        for (const [key, value] of Object.entries(__classPrivateFieldGet(this, _CLIArgParser_aliases, "f"))) {
            helpMsg += `-${key},--${value.name}\t ${value.description}\n`;
        }
        console.log(helpMsg);
    }
    get argv() {
        return __classPrivateFieldGet(this, _CLIArgParser_argv, "f") ? __classPrivateFieldGet(this, _CLIArgParser_argv, "f") : __classPrivateFieldGet(this, _CLIArgParser_instances, "m", _CLIArgParser_parseArgv).call(this);
    }
    static isNumber(x) {
        if (typeof x === 'number')
            return true;
        if (/^0x[0-9a-f]+$/i.test(x))
            return true;
        return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
    }
}
_CLIArgParser_aliases = new WeakMap(), _CLIArgParser_usage = new WeakMap(), _CLIArgParser_argv = new WeakMap(), _CLIArgParser_instances = new WeakSet(), _CLIArgParser_setArg = function _CLIArgParser_setArg(key, val, argv) {
    const value = CLIArgParser.isNumber(val) ? Number(val) : val;
    __classPrivateFieldGet(this, _CLIArgParser_instances, "m", _CLIArgParser_setKey).call(this, argv, key.split('.'), value);
    const aliasKey = (key in __classPrivateFieldGet(this, _CLIArgParser_aliases, "f")) ? [__classPrivateFieldGet(this, _CLIArgParser_aliases, "f")[key].name] : [];
    if (aliasKey.length < 1) {
        for (const [akey, avalue] of Object.entries(__classPrivateFieldGet(this, _CLIArgParser_aliases, "f"))) {
            if (key === avalue.name) {
                aliasKey.push(akey);
                break;
            }
        }
    }
    aliasKey.forEach(x => __classPrivateFieldGet(this, _CLIArgParser_instances, "m", _CLIArgParser_setKey).call(this, argv, x.split('.'), value));
}, _CLIArgParser_setKey = function _CLIArgParser_setKey(obj, keys, value) {
    let o = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        let key = keys[i];
        if (key === '__proto__')
            return;
        if (o[key] === undefined)
            o[key] = {};
        if (o[key] === Object.prototype || o[key] === Number.prototype
            || o[key] === String.prototype)
            o[key] = {};
        if (o[key] === Array.prototype)
            o[key] = [];
        o = o[key];
    }
    let key = keys[keys.length - 1];
    if (key === '__proto__')
        return;
    if (o === Object.prototype || o === Number.prototype
        || o === String.prototype)
        o = {};
    if (o === Array.prototype)
        o = [];
    if (o[key] === undefined) {
        o[key] = value;
    }
    else if (Array.isArray(o[key])) {
        o[key].push(value);
    }
    else {
        o[key] = [o[key], value];
    }
}, _CLIArgParser_parseArgv = function _CLIArgParser_parseArgv() {
    let aliases = __classPrivateFieldGet(this, _CLIArgParser_aliases, "f"), args = this.args;
    let argv = {};
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        if (/^--.+/.test(arg)) {
            let key = arg.match(/^--(.+)/)[1];
            let next = args[i + 1];
            if (next !== undefined && !/^-/.test(next)) {
                __classPrivateFieldGet(this, _CLIArgParser_instances, "m", _CLIArgParser_setArg).call(this, key, next, argv);
                i++;
            }
            else if (/^(true|false)$/.test(next)) {
                __classPrivateFieldGet(this, _CLIArgParser_instances, "m", _CLIArgParser_setArg).call(this, key, next === 'true', argv);
                i++;
            }
            else {
                __classPrivateFieldGet(this, _CLIArgParser_instances, "m", _CLIArgParser_setArg).call(this, key, true, argv);
            }
        }
        else if (/^-[^-]+/.test(arg)) {
            let key = arg.slice(-1)[0];
            if (key !== '-') {
                if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1])) {
                    __classPrivateFieldGet(this, _CLIArgParser_instances, "m", _CLIArgParser_setArg).call(this, key, args[i + 1], argv);
                    i++;
                }
                else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                    __classPrivateFieldGet(this, _CLIArgParser_instances, "m", _CLIArgParser_setArg).call(this, key, args[i + 1] === 'true', argv);
                    i++;
                }
                else {
                    __classPrivateFieldGet(this, _CLIArgParser_instances, "m", _CLIArgParser_setArg).call(this, key, true, argv);
                }
            }
        }
        else {
            console.warn("Unknow CLI options:", arg);
        }
    }
    __classPrivateFieldSet(this, _CLIArgParser_argv, argv, "f");
    return argv;
};
module.exports = new CLIArgParser(process.argv.slice(2));

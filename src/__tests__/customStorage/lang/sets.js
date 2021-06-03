"use strict";
/**
 * Set implementation based on es6-set polyfill (https://github.com/medikoo/es6-set/blob/master/polyfill.js),
 * with the minimal features used by the SDK.

Copyright (C) 2013 Mariusz Nowak (www.medikoo.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
**/
Object.defineProperty(exports, "__esModule", { value: true });
exports._Set = exports.__getSetConstructor = exports.setToArray = exports.SetPoly = void 0;
var SetPoly = /** @class */ (function () {
    // unlike ES6 `Set`, it only accepts an array as first argument iterable
    function SetPoly(values) {
        var _this = this;
        this.__setData__ = [];
        if (Array.isArray(values))
            values.forEach(function (value) { _this.add(value); });
    }
    SetPoly.prototype.clear = function () {
        if (!this.__setData__.length)
            return;
        this.__setData__.length = 0;
    };
    SetPoly.prototype.add = function (value) {
        if (this.has(value))
            return this;
        this.__setData__.push(value);
        return this;
    };
    SetPoly.prototype.delete = function (value) {
        var index = this.__setData__.indexOf(value);
        if (index === -1)
            return false;
        this.__setData__.splice(index, 1);
        return true;
    };
    SetPoly.prototype.has = function (value) {
        return this.__setData__.indexOf(value) !== -1;
    };
    SetPoly.prototype.forEach = function (callbackfn, thisArg) {
        if (typeof callbackfn !== 'function')
            throw new TypeError(callbackfn + ' is not a function');
        for (var i = 0; i < this.__setData__.length; i++) {
            var value = this.__setData__[i];
            callbackfn.call(thisArg, value, value, this);
        }
    };
    Object.defineProperty(SetPoly.prototype, "size", {
        get: function () {
            return this.__setData__.length;
        },
        enumerable: false,
        configurable: true
    });
    return SetPoly;
}());
exports.SetPoly = SetPoly;
/**
 * return an array containing the items of the given set.
 * @param set Set or SetPoly instance
 */
function setToArray(set) {
    if (set instanceof SetPoly) {
        return set.__setData__.slice();
    }
    // if not using SetPoly as set, it means Array.from is supported
    // eslint-disable-next-line compat/compat
    return Array.from(set);
}
exports.setToArray = setToArray;
/**
 * return the Set constructor to use. If `Array.from` built-in or native Set is not available or it doesn't support the required features,
 * a ponyfill with minimal features is returned instead.
 *
 * Exported for testing purposes only.
 */
function __getSetConstructor() {
    // eslint-disable-next-line compat/compat
    if (typeof Array.from === 'function' && typeof Set === 'function' && Set.prototype && Set.prototype.values) {
        return Set;
    }
    return SetPoly;
}
exports.__getSetConstructor = __getSetConstructor;
exports._Set = __getSetConstructor();

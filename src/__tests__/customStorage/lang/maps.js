"use strict";
/**
 * Map implementation based on es6-map polyfill (https://github.com/medikoo/es6-map/blob/master/polyfill.js),
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
exports._Map = exports.MapPoly = void 0;
var MapPoly = /** @class */ (function () {
    // unlike ES6 `Map`, it only accepts an array as first argument iterable
    function MapPoly(entries) {
        var _this = this;
        this.__mapKeysData__ = [];
        this.__mapValuesData__ = [];
        if (Array.isArray(entries))
            entries.forEach(function (entry) { _this.set(entry[0], entry[1]); });
    }
    MapPoly.prototype.clear = function () {
        if (!this.__mapKeysData__.length)
            return;
        this.__mapKeysData__.length = 0;
        this.__mapValuesData__.length = 0;
    };
    MapPoly.prototype.set = function (key, value) {
        var index = this.__mapKeysData__.indexOf(key);
        if (index === -1)
            index = this.__mapKeysData__.push(key) - 1;
        this.__mapValuesData__[index] = value;
        return this;
    };
    MapPoly.prototype.delete = function (key) {
        var index = this.__mapKeysData__.indexOf(key);
        if (index === -1)
            return false;
        this.__mapKeysData__.splice(index, 1);
        this.__mapValuesData__.splice(index, 1);
        return true;
    };
    MapPoly.prototype.get = function (key) {
        var index = this.__mapKeysData__.indexOf(key);
        if (index === -1)
            return;
        return this.__mapValuesData__[index];
    };
    Object.defineProperty(MapPoly.prototype, "size", {
        get: function () {
            return this.__mapKeysData__.length;
        },
        enumerable: false,
        configurable: true
    });
    return MapPoly;
}());
exports.MapPoly = MapPoly;
exports._Map = typeof Map !== 'undefined' ? Map : MapPoly;

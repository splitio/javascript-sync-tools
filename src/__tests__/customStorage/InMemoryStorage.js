/* eslint-disable */
"use strict";
exports.__esModule = true;
exports.inMemoryStorageFactory = void 0;
var lang_1 = require("./lang");
var sets_1 = require("./lang/sets");
/**
 * TODO: This file is only for testing purposes. Ideally, the customer will provide the proper Storage
 * (like inMemory, Redis or whatever their storage may be).
 */
/**
 * Creates an in memory ICustomStorageWrapper implementation
 * Intended for testing purposes.
 *
 * @returns {any} Custom Storage wrapper.
 */
function inMemoryStorageFactory() {
    var _cache = {};
    return {
        /** Holds items (for key-value operations), list of items (for list operations) and set of items
         * (for set operations).
         * */
        _cache: _cache,
        get: function (key) {
            return Promise.resolve(key in _cache ? _cache[key] : null);
        },
        set: function (key, value) {
            var result = key in _cache;
            _cache[key] = value;
            return Promise.resolve(result);
        },
        getAndSet: function (key, value) {
            var result = key in _cache ? _cache[key] : null;
            _cache[key] = value;
            return Promise.resolve(result);
        },
        del: function (key) {
            var result = key in _cache;
            delete _cache[key];
            return Promise.resolve(result);
        },
        getKeysByPrefix: function (prefix) {
            return Promise.resolve(Object.keys(_cache).filter(function (key) { return lang_1.startsWith(key, prefix); }));
        },
        getByPrefix: function (prefix) {
            return Promise.resolve(Object.keys(_cache)
                .filter(function (key) { return lang_1.startsWith(key, prefix); })
                .map(function (key) { return _cache[key]; }));
        },
        incr: function (key) {
            if (key in _cache) {
                var count = lang_1.toNumber(_cache[key]) + 1;
                if (isNaN(count))
                    return Promise.resolve(false);
                _cache[key] = count + '';
            }
            else {
                _cache[key] = '1';
            }
            return Promise.resolve(true);
        },
        decr: function (key) {
            if (key in _cache) {
                var count = lang_1.toNumber(_cache[key]) - 1;
                if (isNaN(count))
                    return Promise.resolve(false);
                _cache[key] = count + '';
            }
            else {
                _cache[key] = '-1';
            }
            return Promise.resolve(true);
        },
        getMany: function (keys) {
            return Promise.resolve(keys.map(function (key) { return _cache[key] ? _cache[key] : null; }));
        },
        pushItems: function (key, items) {
            if (!(key in _cache))
                _cache[key] = [];
            var list = _cache[key];
            if (Array.isArray(list)) {
                list.push.apply(list, items);
                return Promise.resolve();
            }
            return Promise.reject('key is not a list');
        },
        popItems: function (key, count) {
            var list = _cache[key];
            return Promise.resolve(Array.isArray(list) ? list.splice(0, count) : []);
        },
        getItemsCount: function (key) {
            var list = _cache[key];
            return Promise.resolve(Array.isArray(list) ? list.length : 0);
        },
        itemContains: function (key, item) {
            var set = _cache[key];
            if (!set)
                return Promise.resolve(false);
            if (set instanceof Set)
                return Promise.resolve(set.has(item));
            return Promise.reject('key is not a set');
        },
        addItems: function (key, items) {
            if (!(key in _cache))
                _cache[key] = new Set();
            var set = _cache[key];
            if (set instanceof Set) {
                items.forEach(function (item) { return set.add(item); });
                return Promise.resolve();
            }
            return Promise.reject('key is not a set');
        },
        removeItems: function (key, items) {
            if (!(key in _cache))
                _cache[key] = new Set();
            var set = _cache[key];
            if (set instanceof Set) {
                items.forEach(function (item) { return set["delete"](item); });
                return Promise.resolve();
            }
            return Promise.reject('key is not a set');
        },
        getItems: function (key) {
            var set = _cache[key];
            if (!set)
                return Promise.resolve([]);
            if (set instanceof Set)
                return Promise.resolve(sets_1.setToArray(set));
            return Promise.reject('key is not a set');
        },
        // always connects and close
        connect: function () { return Promise.resolve(); },
        close: function () { return Promise.resolve(); }
    };
}
exports.default = inMemoryStorageFactory();

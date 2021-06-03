"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueId = exports.uniqAsStrings = exports.uniq = exports.toString = exports.toNumber = exports.startsWith = exports.shallowClone = exports.merge = exports.isString = exports.isObject = exports.isNaNNumber = exports.isIntegerNumber = exports.isFiniteNumber = exports.isBoolean = exports.groupBy = exports.get = exports.forOwn = exports.findIndex = exports.find = exports.endsWith = void 0;
var tslib_1 = require("tslib");
/**
 * Checks if the target string ends with the sub string.
 */
function endsWith(target, sub, caseInsensitive) {
    if (caseInsensitive === void 0) { caseInsensitive = false; }
    if (!(isString(target) && isString(sub))) {
        return false;
    }
    if (caseInsensitive) {
        target = target.toLowerCase();
        sub = sub.toLowerCase();
    }
    return target.slice(target.length - sub.length) === sub;
}
exports.endsWith = endsWith;
/**
 * Loops through a source collection (an object or an array) running iteratee
 * against each element. It returns the first element for which iteratee returned
 * a truthy value and stops the loop.
 * Iteratee receives three arguments (element, key/index, collection)
 */
function find(source, iteratee) {
    var res;
    if (isObject(source)) {
        var keys = Object.keys(source);
        for (var i = 0; i < keys.length && !res; i++) {
            var key = keys[i];
            var iterateeResult = iteratee(source[key], key, source);
            if (iterateeResult)
                res = source[key];
        }
    }
    else if (Array.isArray(source)) {
        for (var i = 0; i < source.length && !res; i++) {
            var iterateeResult = iteratee(source[i], i, source);
            if (iterateeResult)
                res = source[i];
        }
    }
    return res;
}
exports.find = find;
/**
 * Evaluates iteratee for each element of the source array. Returns the index of the first element
 * for which iteratee returns truthy. If no element is found or there's an issue with the params it returns -1.
 */
function findIndex(source, iteratee) {
    if (Array.isArray(source) && typeof iteratee === 'function') {
        for (var i = 0; i < source.length; i++) {
            if (iteratee(source[i], i, source) === true) {
                return i;
            }
        }
    }
    return -1;
}
exports.findIndex = findIndex;
/**
 * Executes iteratee for given obj own props.
 */
function forOwn(obj, iteratee) {
    var keys = Object.keys(obj);
    keys.forEach(function (key) { return iteratee(obj[key], key, obj); });
    return obj;
}
exports.forOwn = forOwn;
/**
 * Safely retrieve the specified prop from obj. If we can't retrieve
 * that property value, we return the default value.
 */
function get(obj, prop, val) {
    var res = val;
    try { // No risks nor lots of checks.
        var pathPieces = prop.split('.');
        var partial_1 = obj;
        pathPieces.forEach(function (pathPiece) { return partial_1 = partial_1[pathPiece]; });
        if (typeof partial_1 !== 'undefined')
            res = partial_1;
    }
    catch (e) {
        // noop
    }
    return res;
}
exports.get = get;
/**
 * Parses an array into a map of different arrays, grouping by the specified prop value.
 */
function groupBy(source, prop) {
    var map = {};
    if (Array.isArray(source) && isString(prop)) {
        for (var i = 0; i < source.length; i++) {
            var key = source[i][prop];
            // Skip the element if the key is not a string.
            if (isString(key)) {
                if (!map[key])
                    map[key] = [];
                map[key].push(source[i]);
            }
        }
    }
    return map;
}
exports.groupBy = groupBy;
/**
 * Checks if a given value is a boolean.
 */
function isBoolean(val) {
    return val === true || val === false;
}
exports.isBoolean = isBoolean;
/**
 * Checks if a given value is a finite value of number type or Number object.
 * Unlike `Number.isFinite`, it also tests Number object instances.
 * Unlike global `isFinite`, it returns false if the value is not a number or Number object instance.
 */
function isFiniteNumber(val) {
    if (val instanceof Number)
        val = val.valueOf();
    // @TODO remove `isFinite` once `Number.isFinite` is fully supported by targets
    // eslint-disable-next-line compat/compat
    if (typeof val === 'number')
        return Number.isFinite ? Number.isFinite(val) : isFinite(val);
    return false;
}
exports.isFiniteNumber = isFiniteNumber;
/**
 * Checks if a given value is an integer value of number type or Number object.
 * Unlike `Number.isInteger`, it also tests Number object instances.
 */
function isIntegerNumber(val) {
    if (val instanceof Number)
        val = val.valueOf();
    // eslint-disable-next-line compat/compat
    if (typeof val === 'number')
        return Number.isInteger ? Number.isInteger(val) : isFinite(val) && Math.floor(val) === val;
    return false;
}
exports.isIntegerNumber = isIntegerNumber;
/**
 * Checks if a given value is a NaN value of number type or Number object.
 * Unlike `Number.isNaN`, it also tests Number object instances.
 * Unlike global `isNan`, it returns false if the value is not a number or Number object instance.
 */
function isNaNNumber(val) {
    if (val instanceof Number)
        val = val.valueOf();
    // @TODO replace with `Number.isNaN` once it is fully supported by targets
    return val !== val;
}
exports.isNaNNumber = isNaNNumber;
/**
 * Validates if a value is an object with the Object prototype (map object).
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object' && obj.constructor === Object;
}
exports.isObject = isObject;
/**
 * Checks if a given value is a string.
 */
function isString(val) {
    return typeof val === 'string' || val instanceof String;
}
exports.isString = isString;
/**
 * Deep copy version of Object.assign using recursion.
 * There are some assumptions here. It's for internal use and we don't need verbose errors
 * or to ensure the data types or whatever. Parameters should always be correct (at least have a target and a source, of type object).
 */
function merge(target, source) {
    var rest = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        rest[_i - 2] = arguments[_i];
    }
    var res = target;
    isObject(source) && Object.keys(source).forEach(function (key) {
        var val = source[key];
        if (isObject(val)) {
            if (res[key] && isObject(res[key])) { // If both are objects, merge into a new one.
                val = merge({}, res[key], val);
            }
            else { // else make a copy.
                val = merge({}, val);
            }
        }
        // We skip undefined values.
        if (val !== undefined)
            res[key] = val;
    });
    if (rest && rest.length) {
        var nextSource = rest.splice(0, 1)[0];
        res = merge.apply(void 0, tslib_1.__spreadArrays([res, nextSource], rest));
    }
    return res;
}
exports.merge = merge;
/**
 * Shallow clone an object
 */
function shallowClone(obj) {
    var keys = Object.keys(obj);
    var output = {};
    for (var i = 0; i < keys.length; i++) {
        output[keys[i]] = obj[keys[i]];
    }
    return output;
}
exports.shallowClone = shallowClone;
/**
 * Checks if the target string starts with the sub string.
 */
function startsWith(target, sub) {
    if (!(isString(target) && isString(sub))) {
        return false;
    }
    return target.slice(0, sub.length) === sub;
}
exports.startsWith = startsWith;
/**
 * Transforms a value into a number.
 * Note: We're not expecting anything fancy here. If we are at some point, add more type checks.
 */
function toNumber(val) {
    if (typeof val === 'number')
        return val;
    if (isObject(val) && typeof val.valueOf === 'function') {
        var valOf = val.valueOf();
        val = isObject(valOf) ? valOf + '' : valOf;
    }
    if (typeof val !== 'string') {
        return val === 0 ? val : +val;
    }
    // Remove trailing whitespaces.
    val = val.replace(/^\s+|\s+$/g, '');
    return +val;
}
exports.toNumber = toNumber;
/**
 * Transforms a value into it's string representation.
 */
function toString(val) {
    if (val == null)
        return '';
    if (typeof val === 'string')
        return val;
    if (Array.isArray(val))
        return val.map(function (val) { return isString(val) ? val : ''; }) + '';
    var result = val + '';
    return (result === '0' && (1 / val) === Number.NEGATIVE_INFINITY) ? '-0' : result;
}
exports.toString = toString;
/**
 * Removes duplicate items on an array of strings.
 */
function uniq(arr) {
    var seen = {};
    return arr.filter(function (item) {
        return Object.prototype.hasOwnProperty.call(seen, item) ? false : seen[item] = true;
    });
}
exports.uniq = uniq;
/**
 * Removes duplicate items on an array of objects using an optional `stringify` function as equality criteria.
 * It uses JSON.stringify as default criteria.
 */
function uniqAsStrings(arr, stringify) {
    if (stringify === void 0) { stringify = JSON.stringify; }
    var seen = {};
    return arr.filter(function (item) {
        var itemString = stringify(item);
        return Object.prototype.hasOwnProperty.call(seen, itemString) ? false : seen[itemString] = true;
    });
}
exports.uniqAsStrings = uniqAsStrings;
var uniqueIdCounter = -1;
/**
 * Returns a number to be used as ID, which will be unique.
 */
function uniqueId() {
    return uniqueIdCounter++;
}
exports.uniqueId = uniqueId;

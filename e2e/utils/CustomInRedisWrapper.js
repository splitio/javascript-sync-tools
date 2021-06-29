/* eslint-disable */

/**
 *
 *  >>> DO NOT REMOVE THIS FILE ! <<<
 *
 * THIS FILE IS AN EXAMPLE OF A CUSTOM STORAGE CREATED TO MANAGE
 * ALL THE SPLIT'S SYNCHRONIZER OPERATIONS USING REDIS.
 *
 * IT'S BEING USED WITH THE E2E TESTS
 *
 **/

var util$1 = require('util');
var events_1 = require('events');
var url_1 = require('url');
var tty = require('tty');
var os = require('os');
var crypto_1 = require('crypto');
var assert = require('assert');
var require$$0 = require('buffer');
var require$$1 = require('string_decoder');
var net_1 = require('net');
var tls_1 = require('tls');
var stream_1 = require('stream');
var dns_1 = require('dns');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var util__default = /*#__PURE__*/_interopDefaultLegacy(util$1);
var events_1__default = /*#__PURE__*/_interopDefaultLegacy(events_1);
var url_1__default = /*#__PURE__*/_interopDefaultLegacy(url_1);
var tty__default = /*#__PURE__*/_interopDefaultLegacy(tty);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var crypto_1__default = /*#__PURE__*/_interopDefaultLegacy(crypto_1);
var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var net_1__default = /*#__PURE__*/_interopDefaultLegacy(net_1);
var tls_1__default = /*#__PURE__*/_interopDefaultLegacy(tls_1);
var stream_1__default = /*#__PURE__*/_interopDefaultLegacy(stream_1);
var dns_1__default = /*#__PURE__*/_interopDefaultLegacy(dns_1);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    funcTag$1 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$1.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray$1(value) || isArguments$1(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$2.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto$1[key]) && !hasOwnProperty$2.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$2.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject$2(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$2.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject$2(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike$1(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$1;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments$1(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject$1(value) && hasOwnProperty$2.call(value, 'callee') &&
    (!propertyIsEnumerable$1.call(value, 'callee') || objectToString$1.call(value) == argsTag$1);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$1(value) {
  return value != null && isLength$1(value.length) && !isFunction$1(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$1(value) {
  return isObjectLike$1(value) && isArrayLike$1(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$2(value) ? objectToString$1.call(value) : '';
  return tag == funcTag$1 || tag == genTag$1;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$1(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$2(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return !!value && typeof value == 'object';
}

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults$1 = baseRest(function(args) {
  args.push(undefined, assignInDefaults);
  return apply(assignInWith, undefined, args);
});

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike$1(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

var lodash_defaults = defaults$1;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol$1 = root.Symbol,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : undefined;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten$1(array) {
  var length = array ? array.length : 0;
  return length ? baseFlatten(array, 1) : [];
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty$1.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$1(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

var lodash_flatten = flatten$1;

var defaults_1 = lodash_defaults;

var flatten_1 = lodash_flatten;
function noop$2() { }
var noop_1 = noop$2;

var lodash = /*#__PURE__*/Object.defineProperty({
	defaults: defaults_1,
	flatten: flatten_1,
	noop: noop_1
}, '__esModule', {value: true});

/**
 * Custom implementation of a double ended queue.
 */
function Denque(array, options) {
  var options = options || {};

  this._head = 0;
  this._tail = 0;
  this._capacity = options.capacity;
  this._capacityMask = 0x3;
  this._list = new Array(4);
  if (Array.isArray(array)) {
    this._fromArray(array);
  }
}

/**
 * -------------
 *  PUBLIC API
 * -------------
 */

/**
 * Returns the item at the specified index from the list.
 * 0 is the first element, 1 is the second, and so on...
 * Elements at negative values are that many from the end: -1 is one before the end
 * (the last element), -2 is two before the end (one before last), etc.
 * @param index
 * @returns {*}
 */
Denque.prototype.peekAt = function peekAt(index) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  var len = this.size();
  if (i >= len || i < -len) return undefined;
  if (i < 0) i += len;
  i = (this._head + i) & this._capacityMask;
  return this._list[i];
};

/**
 * Alias for peekAt()
 * @param i
 * @returns {*}
 */
Denque.prototype.get = function get(i) {
  return this.peekAt(i);
};

/**
 * Returns the first item in the list without removing it.
 * @returns {*}
 */
Denque.prototype.peek = function peek() {
  if (this._head === this._tail) return undefined;
  return this._list[this._head];
};

/**
 * Alias for peek()
 * @returns {*}
 */
Denque.prototype.peekFront = function peekFront() {
  return this.peek();
};

/**
 * Returns the item that is at the back of the queue without removing it.
 * Uses peekAt(-1)
 */
Denque.prototype.peekBack = function peekBack() {
  return this.peekAt(-1);
};

/**
 * Returns the current length of the queue
 * @return {Number}
 */
Object.defineProperty(Denque.prototype, 'length', {
  get: function length() {
    return this.size();
  }
});

/**
 * Return the number of items on the list, or 0 if empty.
 * @returns {number}
 */
Denque.prototype.size = function size() {
  if (this._head === this._tail) return 0;
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Add an item at the beginning of the list.
 * @param item
 */
Denque.prototype.unshift = function unshift(item) {
  if (item === undefined) return this.size();
  var len = this._list.length;
  this._head = (this._head - 1 + len) & this._capacityMask;
  this._list[this._head] = item;
  if (this._tail === this._head) this._growArray();
  if (this._capacity && this.size() > this._capacity) this.pop();
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Remove and return the first item on the list,
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.shift = function shift() {
  var head = this._head;
  if (head === this._tail) return undefined;
  var item = this._list[head];
  this._list[head] = undefined;
  this._head = (head + 1) & this._capacityMask;
  if (head < 2 && this._tail > 10000 && this._tail <= this._list.length >>> 2) this._shrinkArray();
  return item;
};

/**
 * Add an item to the bottom of the list.
 * @param item
 */
Denque.prototype.push = function push(item) {
  if (item === undefined) return this.size();
  var tail = this._tail;
  this._list[tail] = item;
  this._tail = (tail + 1) & this._capacityMask;
  if (this._tail === this._head) {
    this._growArray();
  }
  if (this._capacity && this.size() > this._capacity) {
    this.shift();
  }
  if (this._head < this._tail) return this._tail - this._head;
  else return this._capacityMask + 1 - (this._head - this._tail);
};

/**
 * Remove and return the last item on the list.
 * Returns undefined if the list is empty.
 * @returns {*}
 */
Denque.prototype.pop = function pop() {
  var tail = this._tail;
  if (tail === this._head) return undefined;
  var len = this._list.length;
  this._tail = (tail - 1 + len) & this._capacityMask;
  var item = this._list[this._tail];
  this._list[this._tail] = undefined;
  if (this._head < 2 && tail > 10000 && tail <= len >>> 2) this._shrinkArray();
  return item;
};

/**
 * Remove and return the item at the specified index from the list.
 * Returns undefined if the list is empty.
 * @param index
 * @returns {*}
 */
Denque.prototype.removeOne = function removeOne(index) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) return void 0;
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size) return void 0;
  if (i < 0) i += size;
  i = (this._head + i) & this._capacityMask;
  var item = this._list[i];
  var k;
  if (index < size / 2) {
    for (k = index; k > 0; k--) {
      this._list[i] = this._list[i = (i - 1 + len) & this._capacityMask];
    }
    this._list[i] = void 0;
    this._head = (this._head + 1 + len) & this._capacityMask;
  } else {
    for (k = size - 1 - index; k > 0; k--) {
      this._list[i] = this._list[i = ( i + 1 + len) & this._capacityMask];
    }
    this._list[i] = void 0;
    this._tail = (this._tail - 1 + len) & this._capacityMask;
  }
  return item;
};

/**
 * Remove number of items from the specified index from the list.
 * Returns array of removed items.
 * Returns undefined if the list is empty.
 * @param index
 * @param count
 * @returns {array}
 */
Denque.prototype.remove = function remove(index, count) {
  var i = index;
  var removed;
  var del_count = count;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  if (this._head === this._tail) return void 0;
  var size = this.size();
  var len = this._list.length;
  if (i >= size || i < -size || count < 1) return void 0;
  if (i < 0) i += size;
  if (count === 1 || !count) {
    removed = new Array(1);
    removed[0] = this.removeOne(i);
    return removed;
  }
  if (i === 0 && i + count >= size) {
    removed = this.toArray();
    this.clear();
    return removed;
  }
  if (i + count > size) count = size - i;
  var k;
  removed = new Array(count);
  for (k = 0; k < count; k++) {
    removed[k] = this._list[(this._head + i + k) & this._capacityMask];
  }
  i = (this._head + i) & this._capacityMask;
  if (index + count === size) {
    this._tail = (this._tail - count + len) & this._capacityMask;
    for (k = count; k > 0; k--) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
    }
    return removed;
  }
  if (index === 0) {
    this._head = (this._head + count + len) & this._capacityMask;
    for (k = count - 1; k > 0; k--) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
    }
    return removed;
  }
  if (i < size / 2) {
    this._head = (this._head + index + count + len) & this._capacityMask;
    for (k = index; k > 0; k--) {
      this.unshift(this._list[i = (i - 1 + len) & this._capacityMask]);
    }
    i = (this._head - 1 + len) & this._capacityMask;
    while (del_count > 0) {
      this._list[i = (i - 1 + len) & this._capacityMask] = void 0;
      del_count--;
    }
    if (index < 0) this._tail = i;
  } else {
    this._tail = i;
    i = (i + count + len) & this._capacityMask;
    for (k = size - (count + index); k > 0; k--) {
      this.push(this._list[i++]);
    }
    i = this._tail;
    while (del_count > 0) {
      this._list[i = (i + 1 + len) & this._capacityMask] = void 0;
      del_count--;
    }
  }
  if (this._head < 2 && this._tail > 10000 && this._tail <= len >>> 2) this._shrinkArray();
  return removed;
};

/**
 * Native splice implementation.
 * Remove number of items from the specified index from the list and/or add new elements.
 * Returns array of removed items or empty array if count == 0.
 * Returns undefined if the list is empty.
 *
 * @param index
 * @param count
 * @param {...*} [elements]
 * @returns {array}
 */
Denque.prototype.splice = function splice(index, count) {
  var i = index;
  // expect a number or return undefined
  if ((i !== (i | 0))) {
    return void 0;
  }
  var size = this.size();
  if (i < 0) i += size;
  if (i > size) return void 0;
  if (arguments.length > 2) {
    var k;
    var temp;
    var removed;
    var arg_len = arguments.length;
    var len = this._list.length;
    var arguments_index = 2;
    if (!size || i < size / 2) {
      temp = new Array(i);
      for (k = 0; k < i; k++) {
        temp[k] = this._list[(this._head + k) & this._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i > 0) {
          this._head = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._head = (this._head + i + len) & this._capacityMask;
      }
      while (arg_len > arguments_index) {
        this.unshift(arguments[--arg_len]);
      }
      for (k = i; k > 0; k--) {
        this.unshift(temp[k - 1]);
      }
    } else {
      temp = new Array(size - (i + count));
      var leng = temp.length;
      for (k = 0; k < leng; k++) {
        temp[k] = this._list[(this._head + i + count + k) & this._capacityMask];
      }
      if (count === 0) {
        removed = [];
        if (i != size) {
          this._tail = (this._head + i + len) & this._capacityMask;
        }
      } else {
        removed = this.remove(i, count);
        this._tail = (this._tail - leng + len) & this._capacityMask;
      }
      while (arguments_index < arg_len) {
        this.push(arguments[arguments_index++]);
      }
      for (k = 0; k < leng; k++) {
        this.push(temp[k]);
      }
    }
    return removed;
  } else {
    return this.remove(i, count);
  }
};

/**
 * Soft clear - does not reset capacity.
 */
Denque.prototype.clear = function clear() {
  this._head = 0;
  this._tail = 0;
};

/**
 * Returns true or false whether the list is empty.
 * @returns {boolean}
 */
Denque.prototype.isEmpty = function isEmpty() {
  return this._head === this._tail;
};

/**
 * Returns an array of all queue items.
 * @returns {Array}
 */
Denque.prototype.toArray = function toArray() {
  return this._copyArray(false);
};

/**
 * -------------
 *   INTERNALS
 * -------------
 */

/**
 * Fills the queue with items from an array
 * For use in the constructor
 * @param array
 * @private
 */
Denque.prototype._fromArray = function _fromArray(array) {
  for (var i = 0; i < array.length; i++) this.push(array[i]);
};

/**
 *
 * @param fullCopy
 * @returns {Array}
 * @private
 */
Denque.prototype._copyArray = function _copyArray(fullCopy) {
  var newArray = [];
  var list = this._list;
  var len = list.length;
  var i;
  if (fullCopy || this._head > this._tail) {
    for (i = this._head; i < len; i++) newArray.push(list[i]);
    for (i = 0; i < this._tail; i++) newArray.push(list[i]);
  } else {
    for (i = this._head; i < this._tail; i++) newArray.push(list[i]);
  }
  return newArray;
};

/**
 * Grows the internal list array.
 * @private
 */
Denque.prototype._growArray = function _growArray() {
  if (this._head) {
    // copy existing data, head to end, then beginning to tail.
    this._list = this._copyArray(true);
    this._head = 0;
  }

  // head is at 0 and array is now full, safe to extend
  this._tail = this._list.length;

  this._list.length *= 2;
  this._capacityMask = (this._capacityMask << 1) | 1;
};

/**
 * Shrinks the internal list array.
 * @private
 */
Denque.prototype._shrinkArray = function _shrinkArray() {
  this._list.length >>>= 1;
  this._capacityMask >>>= 1;
};


var denque = Denque;

var acl = {
	arity: -2,
	flags: [
		"admin",
		"noscript",
		"loading",
		"stale",
		"skip_slowlog"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var append = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var asking = {
	arity: 1,
	flags: [
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var auth = {
	arity: -2,
	flags: [
		"noscript",
		"loading",
		"stale",
		"skip_monitor",
		"skip_slowlog",
		"fast",
		"no_auth"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var bgrewriteaof = {
	arity: 1,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var bgsave = {
	arity: -1,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var bitcount = {
	arity: -2,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var bitfield = {
	arity: -2,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var bitfield_ro = {
	arity: -2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var bitop = {
	arity: -4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 2,
	keyStop: -1,
	step: 1
};
var bitpos = {
	arity: -3,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var blmove = {
	arity: 6,
	flags: [
		"write",
		"denyoom",
		"noscript"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var blpop = {
	arity: -3,
	flags: [
		"write",
		"noscript"
	],
	keyStart: 1,
	keyStop: -2,
	step: 1
};
var brpop = {
	arity: -3,
	flags: [
		"write",
		"noscript"
	],
	keyStart: 1,
	keyStop: -2,
	step: 1
};
var brpoplpush = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"noscript"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var bzpopmax = {
	arity: -3,
	flags: [
		"write",
		"noscript",
		"fast"
	],
	keyStart: 1,
	keyStop: -2,
	step: 1
};
var bzpopmin = {
	arity: -3,
	flags: [
		"write",
		"noscript",
		"fast"
	],
	keyStart: 1,
	keyStop: -2,
	step: 1
};
var client = {
	arity: -2,
	flags: [
		"admin",
		"noscript",
		"random",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var cluster$1 = {
	arity: -2,
	flags: [
		"admin",
		"random",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var command$1 = {
	arity: -1,
	flags: [
		"random",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var config = {
	arity: -2,
	flags: [
		"admin",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var copy = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var dbsize = {
	arity: 1,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var debug$a = {
	arity: -2,
	flags: [
		"admin",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var decr = {
	arity: 2,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var decrby = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var del = {
	arity: -2,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var discard = {
	arity: 1,
	flags: [
		"noscript",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var dump = {
	arity: 2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var echo = {
	arity: 2,
	flags: [
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var evalsha = {
	arity: -3,
	flags: [
		"noscript",
		"may_replicate",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var exec$1 = {
	arity: 1,
	flags: [
		"noscript",
		"loading",
		"stale",
		"skip_monitor",
		"skip_slowlog"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var exists = {
	arity: -2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var expire = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var expireat = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var failover = {
	arity: -1,
	flags: [
		"admin",
		"noscript",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var flushall = {
	arity: -1,
	flags: [
		"write"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var flushdb = {
	arity: -1,
	flags: [
		"write"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var geoadd = {
	arity: -5,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var geodist = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var geohash = {
	arity: -2,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var geopos = {
	arity: -2,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var georadius = {
	arity: -6,
	flags: [
		"write",
		"denyoom",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var georadius_ro = {
	arity: -6,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var georadiusbymember = {
	arity: -5,
	flags: [
		"write",
		"denyoom",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var georadiusbymember_ro = {
	arity: -5,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var geosearch = {
	arity: -7,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var geosearchstore = {
	arity: -8,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var get$1 = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var getbit = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var getdel = {
	arity: 2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var getex = {
	arity: -2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var getrange = {
	arity: 4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var getset = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hdel = {
	arity: -3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hello = {
	arity: -1,
	flags: [
		"noscript",
		"loading",
		"stale",
		"skip_monitor",
		"skip_slowlog",
		"fast",
		"no_auth"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var hexists = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hget = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hgetall = {
	arity: 2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hincrby = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hincrbyfloat = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hkeys = {
	arity: 2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hlen = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hmget = {
	arity: -3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hmset = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hrandfield = {
	arity: -2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hscan = {
	arity: -3,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hset = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hsetnx = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hstrlen = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var hvals = {
	arity: 2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var incr = {
	arity: 2,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var incrby = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var incrbyfloat = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var info = {
	arity: -1,
	flags: [
		"random",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var keys = {
	arity: 2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var lastsave = {
	arity: 1,
	flags: [
		"random",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var latency = {
	arity: -2,
	flags: [
		"admin",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var lindex = {
	arity: 3,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var linsert = {
	arity: 5,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var llen = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lmove = {
	arity: 5,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var lolwut = {
	arity: -1,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var lpop = {
	arity: -2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lpos = {
	arity: -3,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lpush = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lpushx = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lrange = {
	arity: 4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lrem = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var lset = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var ltrim = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var memory = {
	arity: -2,
	flags: [
		"readonly",
		"random",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var mget = {
	arity: -2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var migrate = {
	arity: -6,
	flags: [
		"write",
		"random",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var module$1 = {
	arity: -2,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var monitor = {
	arity: 1,
	flags: [
		"admin",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var move = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var mset = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 2
};
var msetnx = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 2
};
var multi$1 = {
	arity: 1,
	flags: [
		"noscript",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var object = {
	arity: -2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 2,
	keyStop: 2,
	step: 1
};
var persist = {
	arity: 2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var pexpire = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var pexpireat = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var pfadd = {
	arity: -2,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var pfcount = {
	arity: -2,
	flags: [
		"readonly",
		"may_replicate"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var pfdebug = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"admin"
	],
	keyStart: 2,
	keyStop: 2,
	step: 1
};
var pfmerge = {
	arity: -2,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var pfselftest = {
	arity: 1,
	flags: [
		"admin"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var ping = {
	arity: -1,
	flags: [
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var post = {
	arity: -1,
	flags: [
		"readonly",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var psetex = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var psubscribe = {
	arity: -2,
	flags: [
		"pubsub",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var psync = {
	arity: -3,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var pttl = {
	arity: 2,
	flags: [
		"readonly",
		"random",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var publish = {
	arity: 3,
	flags: [
		"pubsub",
		"loading",
		"stale",
		"fast",
		"may_replicate"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var pubsub = {
	arity: -2,
	flags: [
		"pubsub",
		"random",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var punsubscribe = {
	arity: -1,
	flags: [
		"pubsub",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var quit = {
	arity: 1,
	flags: [
		"loading",
		"stale",
		"readonly"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var randomkey = {
	arity: 1,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var readonly = {
	arity: 1,
	flags: [
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var readwrite = {
	arity: 1,
	flags: [
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var rename = {
	arity: 3,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var renamenx = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var replconf = {
	arity: -1,
	flags: [
		"admin",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var replicaof = {
	arity: 3,
	flags: [
		"admin",
		"noscript",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var reset = {
	arity: 1,
	flags: [
		"noscript",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var restore = {
	arity: -4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var role = {
	arity: 1,
	flags: [
		"noscript",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var rpop = {
	arity: -2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var rpoplpush = {
	arity: 3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var rpush = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var rpushx = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var sadd = {
	arity: -3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var save = {
	arity: 1,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var scan = {
	arity: -2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var scard = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var script$1 = {
	arity: -2,
	flags: [
		"noscript",
		"may_replicate"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var sdiff = {
	arity: -2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var sdiffstore = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var select = {
	arity: 2,
	flags: [
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var set$1 = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var setbit = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var setex = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var setnx = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var setrange = {
	arity: 4,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var shutdown = {
	arity: -1,
	flags: [
		"admin",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var sinter = {
	arity: -2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var sinterstore = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var sismember = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var slaveof = {
	arity: 3,
	flags: [
		"admin",
		"noscript",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var slowlog = {
	arity: -2,
	flags: [
		"admin",
		"random",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var smembers = {
	arity: 2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var smismember = {
	arity: -3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var smove = {
	arity: 4,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var sort = {
	arity: -2,
	flags: [
		"write",
		"denyoom",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var spop = {
	arity: -2,
	flags: [
		"write",
		"random",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var srandmember = {
	arity: -2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var srem = {
	arity: -3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var sscan = {
	arity: -3,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var stralgo = {
	arity: -2,
	flags: [
		"readonly",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var strlen = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var subscribe = {
	arity: -2,
	flags: [
		"pubsub",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var substr = {
	arity: 4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var sunion = {
	arity: -2,
	flags: [
		"readonly",
		"sort_for_script"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var sunionstore = {
	arity: -3,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var swapdb = {
	arity: 3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var sync = {
	arity: 1,
	flags: [
		"admin",
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var time = {
	arity: 1,
	flags: [
		"random",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var touch = {
	arity: -2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var ttl = {
	arity: 2,
	flags: [
		"readonly",
		"random",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var type = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var unlink = {
	arity: -2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var unsubscribe = {
	arity: -1,
	flags: [
		"pubsub",
		"noscript",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var unwatch = {
	arity: 1,
	flags: [
		"noscript",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var wait = {
	arity: 3,
	flags: [
		"noscript"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var watch = {
	arity: -2,
	flags: [
		"noscript",
		"loading",
		"stale",
		"fast"
	],
	keyStart: 1,
	keyStop: -1,
	step: 1
};
var xack = {
	arity: -4,
	flags: [
		"write",
		"random",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xadd = {
	arity: -5,
	flags: [
		"write",
		"denyoom",
		"random",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xautoclaim = {
	arity: -6,
	flags: [
		"write",
		"random",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xclaim = {
	arity: -6,
	flags: [
		"write",
		"random",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xdel = {
	arity: -3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xgroup = {
	arity: -2,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 2,
	keyStop: 2,
	step: 1
};
var xinfo = {
	arity: -2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 2,
	keyStop: 2,
	step: 1
};
var xlen = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xpending = {
	arity: -3,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xrange = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xread = {
	arity: -4,
	flags: [
		"readonly",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var xreadgroup = {
	arity: -7,
	flags: [
		"write",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var xrevrange = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xsetid = {
	arity: 3,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var xtrim = {
	arity: -2,
	flags: [
		"write",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zadd = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zcard = {
	arity: 2,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zcount = {
	arity: 4,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zdiff = {
	arity: -3,
	flags: [
		"readonly",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var zdiffstore = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zincrby = {
	arity: 4,
	flags: [
		"write",
		"denyoom",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zinter = {
	arity: -3,
	flags: [
		"readonly",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var zinterstore = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zlexcount = {
	arity: 4,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zmscore = {
	arity: -3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zpopmax = {
	arity: -2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zpopmin = {
	arity: -2,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrandmember = {
	arity: -2,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrange = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrangebylex = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrangebyscore = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrangestore = {
	arity: -5,
	flags: [
		"write",
		"denyoom"
	],
	keyStart: 1,
	keyStop: 2,
	step: 1
};
var zrank = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrem = {
	arity: -3,
	flags: [
		"write",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zremrangebylex = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zremrangebyrank = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zremrangebyscore = {
	arity: 4,
	flags: [
		"write"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrevrange = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrevrangebylex = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrevrangebyscore = {
	arity: -4,
	flags: [
		"readonly"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zrevrank = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zscan = {
	arity: -3,
	flags: [
		"readonly",
		"random"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zscore = {
	arity: 3,
	flags: [
		"readonly",
		"fast"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var zunion = {
	arity: -3,
	flags: [
		"readonly",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
};
var zunionstore = {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"movablekeys"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
};
var commands$1 = {
	acl: acl,
	append: append,
	asking: asking,
	auth: auth,
	bgrewriteaof: bgrewriteaof,
	bgsave: bgsave,
	bitcount: bitcount,
	bitfield: bitfield,
	bitfield_ro: bitfield_ro,
	bitop: bitop,
	bitpos: bitpos,
	blmove: blmove,
	blpop: blpop,
	brpop: brpop,
	brpoplpush: brpoplpush,
	bzpopmax: bzpopmax,
	bzpopmin: bzpopmin,
	client: client,
	cluster: cluster$1,
	command: command$1,
	config: config,
	copy: copy,
	dbsize: dbsize,
	debug: debug$a,
	decr: decr,
	decrby: decrby,
	del: del,
	discard: discard,
	dump: dump,
	echo: echo,
	"eval": {
	arity: -3,
	flags: [
		"noscript",
		"may_replicate",
		"movablekeys"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
},
	evalsha: evalsha,
	exec: exec$1,
	exists: exists,
	expire: expire,
	expireat: expireat,
	failover: failover,
	flushall: flushall,
	flushdb: flushdb,
	geoadd: geoadd,
	geodist: geodist,
	geohash: geohash,
	geopos: geopos,
	georadius: georadius,
	georadius_ro: georadius_ro,
	georadiusbymember: georadiusbymember,
	georadiusbymember_ro: georadiusbymember_ro,
	geosearch: geosearch,
	geosearchstore: geosearchstore,
	get: get$1,
	getbit: getbit,
	getdel: getdel,
	getex: getex,
	getrange: getrange,
	getset: getset,
	hdel: hdel,
	hello: hello,
	hexists: hexists,
	hget: hget,
	hgetall: hgetall,
	hincrby: hincrby,
	hincrbyfloat: hincrbyfloat,
	hkeys: hkeys,
	hlen: hlen,
	hmget: hmget,
	hmset: hmset,
	"host:": {
	arity: -1,
	flags: [
		"readonly",
		"loading",
		"stale"
	],
	keyStart: 0,
	keyStop: 0,
	step: 0
},
	hrandfield: hrandfield,
	hscan: hscan,
	hset: hset,
	hsetnx: hsetnx,
	hstrlen: hstrlen,
	hvals: hvals,
	incr: incr,
	incrby: incrby,
	incrbyfloat: incrbyfloat,
	info: info,
	keys: keys,
	lastsave: lastsave,
	latency: latency,
	lindex: lindex,
	linsert: linsert,
	llen: llen,
	lmove: lmove,
	lolwut: lolwut,
	lpop: lpop,
	lpos: lpos,
	lpush: lpush,
	lpushx: lpushx,
	lrange: lrange,
	lrem: lrem,
	lset: lset,
	ltrim: ltrim,
	memory: memory,
	mget: mget,
	migrate: migrate,
	module: module$1,
	monitor: monitor,
	move: move,
	mset: mset,
	msetnx: msetnx,
	multi: multi$1,
	object: object,
	persist: persist,
	pexpire: pexpire,
	pexpireat: pexpireat,
	pfadd: pfadd,
	pfcount: pfcount,
	pfdebug: pfdebug,
	pfmerge: pfmerge,
	pfselftest: pfselftest,
	ping: ping,
	post: post,
	psetex: psetex,
	psubscribe: psubscribe,
	psync: psync,
	pttl: pttl,
	publish: publish,
	pubsub: pubsub,
	punsubscribe: punsubscribe,
	quit: quit,
	randomkey: randomkey,
	readonly: readonly,
	readwrite: readwrite,
	rename: rename,
	renamenx: renamenx,
	replconf: replconf,
	replicaof: replicaof,
	reset: reset,
	restore: restore,
	"restore-asking": {
	arity: -4,
	flags: [
		"write",
		"denyoom",
		"asking"
	],
	keyStart: 1,
	keyStop: 1,
	step: 1
},
	role: role,
	rpop: rpop,
	rpoplpush: rpoplpush,
	rpush: rpush,
	rpushx: rpushx,
	sadd: sadd,
	save: save,
	scan: scan,
	scard: scard,
	script: script$1,
	sdiff: sdiff,
	sdiffstore: sdiffstore,
	select: select,
	set: set$1,
	setbit: setbit,
	setex: setex,
	setnx: setnx,
	setrange: setrange,
	shutdown: shutdown,
	sinter: sinter,
	sinterstore: sinterstore,
	sismember: sismember,
	slaveof: slaveof,
	slowlog: slowlog,
	smembers: smembers,
	smismember: smismember,
	smove: smove,
	sort: sort,
	spop: spop,
	srandmember: srandmember,
	srem: srem,
	sscan: sscan,
	stralgo: stralgo,
	strlen: strlen,
	subscribe: subscribe,
	substr: substr,
	sunion: sunion,
	sunionstore: sunionstore,
	swapdb: swapdb,
	sync: sync,
	time: time,
	touch: touch,
	ttl: ttl,
	type: type,
	unlink: unlink,
	unsubscribe: unsubscribe,
	unwatch: unwatch,
	wait: wait,
	watch: watch,
	xack: xack,
	xadd: xadd,
	xautoclaim: xautoclaim,
	xclaim: xclaim,
	xdel: xdel,
	xgroup: xgroup,
	xinfo: xinfo,
	xlen: xlen,
	xpending: xpending,
	xrange: xrange,
	xread: xread,
	xreadgroup: xreadgroup,
	xrevrange: xrevrange,
	xsetid: xsetid,
	xtrim: xtrim,
	zadd: zadd,
	zcard: zcard,
	zcount: zcount,
	zdiff: zdiff,
	zdiffstore: zdiffstore,
	zincrby: zincrby,
	zinter: zinter,
	zinterstore: zinterstore,
	zlexcount: zlexcount,
	zmscore: zmscore,
	zpopmax: zpopmax,
	zpopmin: zpopmin,
	zrandmember: zrandmember,
	zrange: zrange,
	zrangebylex: zrangebylex,
	zrangebyscore: zrangebyscore,
	zrangestore: zrangestore,
	zrank: zrank,
	zrem: zrem,
	zremrangebylex: zremrangebylex,
	zremrangebyrank: zremrangebyrank,
	zremrangebyscore: zremrangebyscore,
	zrevrange: zrevrange,
	zrevrangebylex: zrevrangebylex,
	zrevrangebyscore: zrevrangebyscore,
	zrevrank: zrevrank,
	zscan: zscan,
	zscore: zscore,
	zunion: zunion,
	zunionstore: zunionstore
};

var redisCommands = createCommonjsModule(function (module, exports) {



/**
 * Redis command list
 *
 * All commands are lowercased.
 *
 * @var {string[]}
 * @public
 */
exports.list = Object.keys(commands$1);

var flags = {};
exports.list.forEach(function (commandName) {
  flags[commandName] = commands$1[commandName].flags.reduce(function (flags, flag) {
    flags[flag] = true;
    return flags
  }, {});
});
/**
 * Check if the command exists
 *
 * @param {string} commandName - the command name
 * @return {boolean} result
 * @public
 */
exports.exists = function (commandName) {
  return Boolean(commands$1[commandName])
};

/**
 * Check if the command has the flag
 *
 * Some of possible flags: readonly, noscript, loading
 * @param {string} commandName - the command name
 * @param {string} flag - the flag to check
 * @return {boolean} result
 * @public
 */
exports.hasFlag = function (commandName, flag) {
  if (!flags[commandName]) {
    throw new Error('Unknown command ' + commandName)
  }

  return Boolean(flags[commandName][flag])
};

/**
 * Get indexes of keys in the command arguments
 *
 * @param {string} commandName - the command name
 * @param {string[]} args - the arguments of the command
 * @param {object} [options] - options
 * @param {boolean} [options.parseExternalKey] - parse external keys
 * @return {number[]} - the list of the index
 * @public
 *
 * @example
 * ```javascript
 * getKeyIndexes('set', ['key', 'value']) // [0]
 * getKeyIndexes('mget', ['key1', 'key2']) // [0, 1]
 * ```
 */
exports.getKeyIndexes = function (commandName, args, options) {
  var command = commands$1[commandName];
  if (!command) {
    throw new Error('Unknown command ' + commandName)
  }

  if (!Array.isArray(args)) {
    throw new Error('Expect args to be an array')
  }

  var keys = [];
  var i, keyStart, keyStop, parseExternalKey;
  switch (commandName) {
    case 'zunionstore':
    case 'zinterstore':
      keys.push(0);
    // fall through
    case 'eval':
    case 'evalsha':
      keyStop = Number(args[1]) + 2;
      for (i = 2; i < keyStop; i++) {
        keys.push(i);
      }
      break
    case 'sort':
      parseExternalKey = options && options.parseExternalKey;
      keys.push(0);
      for (i = 1; i < args.length - 1; i++) {
        if (typeof args[i] !== 'string') {
          continue
        }
        var directive = args[i].toUpperCase();
        if (directive === 'GET') {
          i += 1;
          if (args[i] !== '#') {
            if (parseExternalKey) {
              keys.push([i, getExternalKeyNameLength(args[i])]);
            } else {
              keys.push(i);
            }
          }
        } else if (directive === 'BY') {
          i += 1;
          if (parseExternalKey) {
            keys.push([i, getExternalKeyNameLength(args[i])]);
          } else {
            keys.push(i);
          }
        } else if (directive === 'STORE') {
          i += 1;
          keys.push(i);
        }
      }
      break
    case 'migrate':
      if (args[2] === '') {
        for (i = 5; i < args.length - 1; i++) {
          if (args[i].toUpperCase() === 'KEYS') {
            for (var j = i + 1; j < args.length; j++) {
              keys.push(j);
            }
            break
          }
        }
      } else {
        keys.push(2);
      }
      break
    case 'xreadgroup':
    case 'xread':
      // Keys are 1st half of the args after STREAMS argument.
      for (i = commandName === 'xread' ? 0 : 3; i < args.length - 1; i++) {
        if (String(args[i]).toUpperCase() === 'STREAMS') {
          for (j = i + 1; j <= i + ((args.length - 1 - i) / 2); j++) {
            keys.push(j);
          }
          break
        }
      }
      break
    default:
      // Step has to be at least one in this case, otherwise the command does
      // not contain a key.
      if (command.step > 0) {
        keyStart = command.keyStart - 1;
        keyStop = command.keyStop > 0 ? command.keyStop : args.length + command.keyStop + 1;
        for (i = keyStart; i < keyStop; i += command.step) {
          keys.push(i);
        }
      }
      break
  }

  return keys
};

function getExternalKeyNameLength (key) {
  if (typeof key !== 'string') {
    key = String(key);
  }
  var hashPos = key.indexOf('->');
  return hashPos === -1 ? key.length : hashPos
}
});

/*
 * Copyright 2001-2010 Georges Menie (www.menie.org)
 * Copyright 2010 Salvatore Sanfilippo (adapted to Redis coding style)
 * Copyright 2015 Zihua Li (http://zihua.li) (ported to JavaScript)
 * Copyright 2016 Mike Diarmid (http://github.com/salakar) (re-write for performance, ~700% perf inc)
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the University of California, Berkeley nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var lib = createCommonjsModule(function (module) {
/* CRC16 implementation according to CCITT standards.
 *
 * Note by @antirez: this is actually the XMODEM CRC 16 algorithm, using the
 * following parameters:
 *
 * Name                       : "XMODEM", also known as "ZMODEM", "CRC-16/ACORN"
 * Width                      : 16 bit
 * Poly                       : 1021 (That is actually x^16 + x^12 + x^5 + 1)
 * Initialization             : 0000
 * Reflect Input byte         : False
 * Reflect Output CRC         : False
 * Xor constant to output CRC : 0000
 * Output for "123456789"     : 31C3
 */

var lookup = [
  0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
  0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
  0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
  0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
  0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
  0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
  0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
  0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
  0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
  0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
  0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
  0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
  0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
  0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
  0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
  0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
  0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
  0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
  0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
  0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
  0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
  0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
  0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
  0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
  0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
  0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
  0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
  0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
  0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
  0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
  0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
  0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
];

/**
 * Convert a string to a UTF8 array - faster than via buffer
 * @param str
 * @returns {Array}
 */
var toUTF8Array = function toUTF8Array(str) {
  var char;
  var i = 0;
  var p = 0;
  var utf8 = [];
  var len = str.length;

  for (; i < len; i++) {
    char = str.charCodeAt(i);
    if (char < 128) {
      utf8[p++] = char;
    } else if (char < 2048) {
      utf8[p++] = (char >> 6) | 192;
      utf8[p++] = (char & 63) | 128;
    } else if (
        ((char & 0xFC00) === 0xD800) && (i + 1) < str.length &&
        ((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
      char = 0x10000 + ((char & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
      utf8[p++] = (char >> 18) | 240;
      utf8[p++] = ((char >> 12) & 63) | 128;
      utf8[p++] = ((char >> 6) & 63) | 128;
      utf8[p++] = (char & 63) | 128;
    } else {
      utf8[p++] = (char >> 12) | 224;
      utf8[p++] = ((char >> 6) & 63) | 128;
      utf8[p++] = (char & 63) | 128;
    }
  }

  return utf8;
};

/**
 * Convert a string into a redis slot hash.
 * @param str
 * @returns {number}
 */
var generate = module.exports = function generate(str) {
  var char;
  var i = 0;
  var start = -1;
  var result = 0;
  var resultHash = 0;
  var utf8 = typeof str === 'string' ? toUTF8Array(str) : str;
  var len = utf8.length;

  while (i < len) {
    char = utf8[i++];
    if (start === -1) {
      if (char === 0x7B) {
        start = i;
      }
    } else if (char !== 0x7D) {
      resultHash = lookup[(char ^ (resultHash >> 8)) & 0xFF] ^ (resultHash << 8);
    } else if (i - 1 !== start) {
      return resultHash & 0x3FFF;
    }

    result = lookup[(char ^ (result >> 8)) & 0xFF] ^ (result << 8);
  }

  return result & 0x3FFF;
};

/**
 * Convert an array of multiple strings into a redis slot hash.
 * Returns -1 if one of the keys is not for the same slot as the others
 * @param keys
 * @returns {number}
 */
module.exports.generateMulti = function generateMulti(keys) {
  var i = 1;
  var len = keys.length;
  var base = generate(keys[0]);

  while (i < len) {
    if (generate(keys[i++]) !== base) return -1;
  }

  return base;
};
});

var utils$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCatch = exports.errorObj = void 0;
//Try catch is not supported in optimizing
//compiler, so it is isolated
exports.errorObj = { e: {} };
let tryCatchTarget;
function tryCatcher(err, val) {
    try {
        const target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
    }
    catch (e) {
        exports.errorObj.e = e;
        return exports.errorObj;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
});

function throwLater(e) {
    setTimeout(function () {
        throw e;
    }, 0);
}
function asCallback(promise, nodeback, options) {
    if (typeof nodeback === "function") {
        promise.then((val) => {
            let ret;
            if (options !== undefined &&
                Object(options).spread &&
                Array.isArray(val)) {
                ret = utils$1.tryCatch(nodeback).apply(undefined, [null].concat(val));
            }
            else {
                ret =
                    val === undefined
                        ? utils$1.tryCatch(nodeback)(null)
                        : utils$1.tryCatch(nodeback)(null, val);
            }
            if (ret === utils$1.errorObj) {
                throwLater(ret.e);
            }
        }, (cause) => {
            if (!cause) {
                const newReason = new Error(cause + "");
                Object.assign(newReason, { cause });
                cause = newReason;
            }
            const ret = utils$1.tryCatch(nodeback)(cause);
            if (ret === utils$1.errorObj) {
                throwLater(ret.e);
            }
        });
    }
    return promise;
}
var _default$k = asCallback;

var built$1 = /*#__PURE__*/Object.defineProperty({
	default: _default$k
}, '__esModule', {value: true});

/**
 * Helpers.
 */
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = ms;
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

var common = setup;

/* eslint-env browser */

var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};
});

var hasFlag = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os__default['default'].release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};

/**
 * Module dependencies.
 */

var node = createCommonjsModule(function (module, exports) {
/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util__default['default'].deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = supportsColor_1;

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty__default['default'].isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util__default['default'].format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = common(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util__default['default'].inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util__default['default'].inspect(v, this.inspectOpts);
};
});

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

var src = createCommonjsModule(function (module) {
if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = browser;
} else {
	module.exports = node;
}
});

const MAX_ARGUMENT_LENGTH = 200;
var MAX_ARGUMENT_LENGTH_1 = MAX_ARGUMENT_LENGTH;
const NAMESPACE_PREFIX = "ioredis";
/**
 * helper function that tried to get a string value for
 * arbitrary "debug" arg
 */
function getStringValue(v) {
    if (v === null) {
        return;
    }
    switch (typeof v) {
        case "boolean":
            return;
        case "number":
            return;
        case "object":
            if (Buffer.isBuffer(v)) {
                return v.toString("hex");
            }
            if (Array.isArray(v)) {
                return v.join(",");
            }
            try {
                return JSON.stringify(v);
            }
            catch (e) {
                return;
            }
        case "string":
            return v;
    }
}
var getStringValue_1 = getStringValue;
/**
 * helper function that redacts a string representation of a "debug" arg
 */
function genRedactedString(str, maxLen) {
    const { length } = str;
    return length <= maxLen
        ? str
        : str.slice(0, maxLen) + ' ... <REDACTED full-length="' + length + '">';
}
var genRedactedString_1 = genRedactedString;
/**
 * a wrapper for the `debug` module, used to generate
 * "debug functions" that trim the values in their output
 */
function genDebugFunction(namespace) {
    const fn = src.default(`${NAMESPACE_PREFIX}:${namespace}`);
    function wrappedDebug(...args) {
        if (!fn.enabled) {
            return; // no-op
        }
        // we skip the first arg because that is the message
        for (let i = 1; i < args.length; i++) {
            const str = getStringValue(args[i]);
            if (typeof str === "string" && str.length > MAX_ARGUMENT_LENGTH) {
                args[i] = genRedactedString(str, MAX_ARGUMENT_LENGTH);
            }
        }
        return fn.apply(null, args);
    }
    Object.defineProperties(wrappedDebug, {
        namespace: {
            get() {
                return fn.namespace;
            },
        },
        enabled: {
            get() {
                return fn.enabled;
            },
        },
        destroy: {
            get() {
                return fn.destroy;
            },
        },
        log: {
            get() {
                return fn.log;
            },
            set(l) {
                fn.log = l;
            },
        },
    });
    return wrappedDebug;
}
var _default$j = genDebugFunction;

var debug$9 = /*#__PURE__*/Object.defineProperty({
	MAX_ARGUMENT_LENGTH: MAX_ARGUMENT_LENGTH_1,
	getStringValue: getStringValue_1,
	genRedactedString: genRedactedString_1,
	default: _default$j
}, '__esModule', {value: true});

var defaults = lodash.defaults;
var noop$1 = lodash.noop;
var flatten = lodash.flatten;

var Debug = debug$9.default;
/**
 * Test if two buffers are equal
 *
 * @export
 * @param {Buffer} a
 * @param {Buffer} b
 * @returns {boolean} Whether the two buffers are equal
 */
function bufferEqual(a, b) {
    if (typeof a.equals === "function") {
        return a.equals(b);
    }
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
var bufferEqual_1 = bufferEqual;
/**
 * Convert a buffer to string, supports buffer array
 *
 * @param {*} value - The input value
 * @param {string} encoding - string encoding
 * @return {*} The result
 * @example
 * ```js
 * var input = [Buffer.from('foo'), [Buffer.from('bar')]]
 * var res = convertBufferToString(input, 'utf8')
 * expect(res).to.eql(['foo', ['bar']])
 * ```
 * @private
 */
function convertBufferToString(value, encoding) {
    if (value instanceof Buffer) {
        return value.toString(encoding);
    }
    if (Array.isArray(value)) {
        const length = value.length;
        const res = Array(length);
        for (let i = 0; i < length; ++i) {
            res[i] =
                value[i] instanceof Buffer && encoding === "utf8"
                    ? value[i].toString()
                    : convertBufferToString(value[i], encoding);
        }
        return res;
    }
    return value;
}
var convertBufferToString_1 = convertBufferToString;
/**
 * Convert a list of results to node-style
 *
 * @param {Array} arr - The input value
 * @return {Array} The output value
 * @example
 * ```js
 * var input = ['a', 'b', new Error('c'), 'd']
 * var output = exports.wrapMultiResult(input)
 * expect(output).to.eql([[null, 'a'], [null, 'b'], [new Error('c')], [null, 'd'])
 * ```
 * @private
 */
function wrapMultiResult(arr) {
    // When using WATCH/EXEC transactions, the EXEC will return
    // a null instead of an array
    if (!arr) {
        return null;
    }
    const result = [];
    const length = arr.length;
    for (let i = 0; i < length; ++i) {
        const item = arr[i];
        if (item instanceof Error) {
            result.push([item]);
        }
        else {
            result.push([null, item]);
        }
    }
    return result;
}
var wrapMultiResult_1 = wrapMultiResult;
/**
 * Detect the argument is a int
 *
 * @param {string} value
 * @return {boolean} Whether the value is a int
 * @example
 * ```js
 * > isInt('123')
 * true
 * > isInt('123.3')
 * false
 * > isInt('1x')
 * false
 * > isInt(123)
 * true
 * > isInt(true)
 * false
 * ```
 * @private
 */
function isInt(value) {
    const x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
}
var isInt_1 = isInt;
/**
 * Pack an array to an Object
 *
 * @param {array} array
 * @return {object}
 * @example
 * ```js
 * > packObject(['a', 'b', 'c', 'd'])
 * { a: 'b', c: 'd' }
 * ```
 */
function packObject(array) {
    const result = {};
    const length = array.length;
    for (let i = 1; i < length; i += 2) {
        result[array[i - 1]] = array[i];
    }
    return result;
}
var packObject_1 = packObject;
/**
 * Return a callback with timeout
 *
 * @param {function} callback
 * @param {number} timeout
 * @return {function}
 */
function timeout$1(callback, timeout) {
    let timer;
    const run = function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            callback.apply(this, arguments);
        }
    };
    timer = setTimeout(run, timeout, new Error("timeout"));
    return run;
}
var timeout_1 = timeout$1;
/**
 * Convert an object to an array
 *
 * @param {object} obj
 * @return {array}
 * @example
 * ```js
 * > convertObjectToArray({ a: '1' })
 * ['a', '1']
 * ```
 */
function convertObjectToArray(obj) {
    const result = [];
    const keys = Object.keys(obj);
    for (let i = 0, l = keys.length; i < l; i++) {
        result.push(keys[i], obj[keys[i]]);
    }
    return result;
}
var convertObjectToArray_1 = convertObjectToArray;
/**
 * Convert a map to an array
 *
 * @param {Map} map
 * @return {array}
 * @example
 * ```js
 * > convertObjectToArray(new Map([[1, '2']]))
 * [1, '2']
 * ```
 */
function convertMapToArray(map) {
    const result = [];
    let pos = 0;
    map.forEach(function (value, key) {
        result[pos] = key;
        result[pos + 1] = value;
        pos += 2;
    });
    return result;
}
var convertMapToArray_1 = convertMapToArray;
/**
 * Convert a non-string arg to a string
 *
 * @param {*} arg
 * @return {string}
 */
function toArg(arg) {
    if (arg === null || typeof arg === "undefined") {
        return "";
    }
    return String(arg);
}
var toArg_1 = toArg;
/**
 * Optimize error stack
 *
 * @param {Error} error - actually error
 * @param {string} friendlyStack - the stack that more meaningful
 * @param {string} filterPath - only show stacks with the specified path
 */
function optimizeErrorStack(error, friendlyStack, filterPath) {
    const stacks = friendlyStack.split("\n");
    let lines = "";
    let i;
    for (i = 1; i < stacks.length; ++i) {
        if (stacks[i].indexOf(filterPath) === -1) {
            break;
        }
    }
    for (let j = i; j < stacks.length; ++j) {
        lines += "\n" + stacks[j];
    }
    const pos = error.stack.indexOf("\n");
    error.stack = error.stack.slice(0, pos) + lines;
    return error;
}
var optimizeErrorStack_1 = optimizeErrorStack;
/**
 * Parse the redis protocol url
 *
 * @param {string} url - the redis protocol url
 * @return {Object}
 */
function parseURL(url) {
    if (isInt(url)) {
        return { port: url };
    }
    let parsed = url_1__default['default'].parse(url, true, true);
    if (!parsed.slashes && url[0] !== "/") {
        url = "//" + url;
        parsed = url_1__default['default'].parse(url, true, true);
    }
    const options = parsed.query || {};
    const allowUsernameInURI = options.allowUsernameInURI && options.allowUsernameInURI !== "false";
    delete options.allowUsernameInURI;
    const result = {};
    if (parsed.auth) {
        const index = parsed.auth.indexOf(":");
        if (allowUsernameInURI) {
            result.username =
                index === -1 ? parsed.auth : parsed.auth.slice(0, index);
        }
        result.password = index === -1 ? "" : parsed.auth.slice(index + 1);
    }
    if (parsed.pathname) {
        if (parsed.protocol === "redis:" || parsed.protocol === "rediss:") {
            if (parsed.pathname.length > 1) {
                result.db = parsed.pathname.slice(1);
            }
        }
        else {
            result.path = parsed.pathname;
        }
    }
    if (parsed.host) {
        result.host = parsed.hostname;
    }
    if (parsed.port) {
        result.port = parsed.port;
    }
    lodash.defaults(result, options);
    return result;
}
var parseURL_1 = parseURL;
/**
 * Get a random element from `array`
 *
 * @export
 * @template T
 * @param {T[]} array the array
 * @param {number} [from=0] start index
 * @returns {T}
 */
function sample(array, from = 0) {
    const length = array.length;
    if (from >= length) {
        return;
    }
    return array[from + Math.floor(Math.random() * (length - from))];
}
var sample_1 = sample;
/**
 * Shuffle the array using the Fisher-Yates Shuffle.
 * This method will mutate the original array.
 *
 * @export
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
function shuffle(array) {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        const index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        [array[counter], array[index]] = [array[index], array[counter]];
    }
    return array;
}
var shuffle_1 = shuffle;
/**
 * Error message for connection being disconnected
 */
var CONNECTION_CLOSED_ERROR_MSG = "Connection is closed.";
function zipMap(keys, values) {
    const map = new Map();
    keys.forEach((key, index) => {
        map.set(key, values[index]);
    });
    return map;
}
var zipMap_1 = zipMap;

var utils = /*#__PURE__*/Object.defineProperty({
	defaults: defaults,
	noop: noop$1,
	flatten: flatten,
	Debug: Debug,
	bufferEqual: bufferEqual_1,
	convertBufferToString: convertBufferToString_1,
	wrapMultiResult: wrapMultiResult_1,
	isInt: isInt_1,
	packObject: packObject_1,
	timeout: timeout_1,
	convertObjectToArray: convertObjectToArray_1,
	convertMapToArray: convertMapToArray_1,
	toArg: toArg_1,
	optimizeErrorStack: optimizeErrorStack_1,
	parseURL: parseURL_1,
	sample: sample_1,
	shuffle: shuffle_1,
	CONNECTION_CLOSED_ERROR_MSG: CONNECTION_CLOSED_ERROR_MSG,
	zipMap: zipMap_1
}, '__esModule', {value: true});

function isPromise(obj) {
    return (!!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function");
}
var isPromise_1 = isPromise;
let promise = Promise;
function get() {
    return promise;
}
var get_1 = get;
function set(lib) {
    if (typeof lib !== "function") {
        throw new Error(`Provided Promise must be a function, got ${lib}`);
    }
    promise = lib;
}
var set_1 = set;

var promiseContainer = /*#__PURE__*/Object.defineProperty({
	isPromise: isPromise_1,
	get: get_1,
	set: set_1
}, '__esModule', {value: true});

/**
 * Command instance
 *
 * It's rare that you need to create a Command instance yourself.
 *
 * @export
 * @class Command
 *
 * @example
 * ```js
 * var infoCommand = new Command('info', null, function (err, result) {
 *   console.log('result', result);
 * });
 *
 * redis.sendCommand(infoCommand);
 *
 * // When no callback provided, Command instance will have a `promise` property,
 * // which will resolve/reject with the result of the command.
 * var getCommand = new Command('get', ['foo']);
 * getCommand.promise.then(function (result) {
 *   console.log('result', result);
 * });
 * ```
 * @see {@link Redis#sendCommand} which can send a Command instance to Redis
 */
class Command {
    /**
     * Creates an instance of Command.
     * @param {string} name Command name
     * @param {(Array<string | Buffer | number>)} [args=[]] An array of command arguments
     * @param {ICommandOptions} [options={}]
     * @param {CallbackFunction} [callback] The callback that handles the response.
     * If omit, the response will be handled via Promise
     * @memberof Command
     */
    constructor(name, args = [], options = {}, callback) {
        this.name = name;
        this.transformed = false;
        this.isCustomCommand = false;
        this.inTransaction = false;
        this.isResolved = false;
        this.replyEncoding = options.replyEncoding;
        this.errorStack = options.errorStack;
        this.args = lodash.flatten(args);
        this.callback = callback;
        this.initPromise();
        if (options.keyPrefix) {
            this._iterateKeys((key) => options.keyPrefix + key);
        }
        if (options.readOnly) {
            this.isReadOnly = true;
        }
    }
    static getFlagMap() {
        if (!this.flagMap) {
            this.flagMap = Object.keys(Command.FLAGS).reduce((map, flagName) => {
                map[flagName] = {};
                Command.FLAGS[flagName].forEach((commandName) => {
                    map[flagName][commandName] = true;
                });
                return map;
            }, {});
        }
        return this.flagMap;
    }
    /**
     * Check whether the command has the flag
     *
     * @param {string} flagName
     * @param {string} commandName
     * @return {boolean}
     */
    static checkFlag(flagName, commandName) {
        return !!this.getFlagMap()[flagName][commandName];
    }
    static setArgumentTransformer(name, func) {
        this._transformer.argument[name] = func;
    }
    static setReplyTransformer(name, func) {
        this._transformer.reply[name] = func;
    }
    initPromise() {
        const Promise = promiseContainer.get();
        const promise = new Promise((resolve, reject) => {
            if (!this.transformed) {
                this.transformed = true;
                const transformer = Command._transformer.argument[this.name];
                if (transformer) {
                    this.args = transformer(this.args);
                }
                this.stringifyArguments();
            }
            this.resolve = this._convertValue(resolve);
            if (this.errorStack) {
                this.reject = (err) => {
                    reject(utils.optimizeErrorStack(err, this.errorStack.stack, __dirname));
                };
            }
            else {
                this.reject = reject;
            }
        });
        this.promise = built$1.default(promise, this.callback);
    }
    getSlot() {
        if (typeof this.slot === "undefined") {
            const key = this.getKeys()[0];
            this.slot = key == null ? null : lib(key);
        }
        return this.slot;
    }
    getKeys() {
        return this._iterateKeys();
    }
    /**
     * Iterate through the command arguments that are considered keys.
     *
     * @param {Function} [transform=(key) => key] The transformation that should be applied to
     * each key. The transformations will persist.
     * @returns {string[]} The keys of the command.
     * @memberof Command
     */
    _iterateKeys(transform = (key) => key) {
        if (typeof this.keys === "undefined") {
            this.keys = [];
            if (redisCommands.exists(this.name)) {
                const keyIndexes = redisCommands.getKeyIndexes(this.name, this.args);
                for (const index of keyIndexes) {
                    this.args[index] = transform(this.args[index]);
                    this.keys.push(this.args[index]);
                }
            }
        }
        return this.keys;
    }
    /**
     * Convert command to writable buffer or string
     *
     * @return {string|Buffer}
     * @see {@link Redis#sendCommand}
     * @public
     */
    toWritable() {
        let bufferMode = false;
        for (const arg of this.args) {
            if (arg instanceof Buffer) {
                bufferMode = true;
                break;
            }
        }
        let result;
        const commandStr = "*" +
            (this.args.length + 1) +
            "\r\n$" +
            Buffer.byteLength(this.name) +
            "\r\n" +
            this.name +
            "\r\n";
        if (bufferMode) {
            const buffers = new MixedBuffers();
            buffers.push(commandStr);
            for (const arg of this.args) {
                if (arg instanceof Buffer) {
                    if (arg.length === 0) {
                        buffers.push("$0\r\n\r\n");
                    }
                    else {
                        buffers.push("$" + arg.length + "\r\n");
                        buffers.push(arg);
                        buffers.push("\r\n");
                    }
                }
                else {
                    buffers.push("$" +
                        Buffer.byteLength(arg) +
                        "\r\n" +
                        arg +
                        "\r\n");
                }
            }
            result = buffers.toBuffer();
        }
        else {
            result = commandStr;
            for (const arg of this.args) {
                result +=
                    "$" +
                        Buffer.byteLength(arg) +
                        "\r\n" +
                        arg +
                        "\r\n";
            }
        }
        return result;
    }
    stringifyArguments() {
        for (let i = 0; i < this.args.length; ++i) {
            const arg = this.args[i];
            if (!(arg instanceof Buffer) && typeof arg !== "string") {
                this.args[i] = utils.toArg(arg);
            }
        }
    }
    /**
     * Convert the value from buffer to the target encoding.
     *
     * @private
     * @param {Function} resolve The resolve function of the Promise
     * @returns {Function} A function to transform and resolve a value
     * @memberof Command
     */
    _convertValue(resolve) {
        return (value) => {
            try {
                const existingTimer = this._commandTimeoutTimer;
                if (existingTimer) {
                    clearTimeout(existingTimer);
                    delete this._commandTimeoutTimer;
                }
                resolve(this.transformReply(value));
                this.isResolved = true;
            }
            catch (err) {
                this.reject(err);
            }
            return this.promise;
        };
    }
    /**
     * Convert buffer/buffer[] to string/string[],
     * and apply reply transformer.
     *
     * @memberof Command
     */
    transformReply(result) {
        if (this.replyEncoding) {
            result = utils.convertBufferToString(result, this.replyEncoding);
        }
        const transformer = Command._transformer.reply[this.name];
        if (transformer) {
            result = transformer(result);
        }
        return result;
    }
    /**
     * Set the wait time before terminating the attempt to execute a command
     * and generating an error.
     */
    setTimeout(ms) {
        if (!this._commandTimeoutTimer) {
            this._commandTimeoutTimer = setTimeout(() => {
                if (!this.isResolved) {
                    this.reject(new Error("Command timed out"));
                }
            }, ms);
        }
    }
}
var _default$i = Command;
Command.FLAGS = {
    VALID_IN_SUBSCRIBER_MODE: [
        "subscribe",
        "psubscribe",
        "unsubscribe",
        "punsubscribe",
        "ping",
        "quit",
    ],
    VALID_IN_MONITOR_MODE: ["monitor", "auth"],
    ENTER_SUBSCRIBER_MODE: ["subscribe", "psubscribe"],
    EXIT_SUBSCRIBER_MODE: ["unsubscribe", "punsubscribe"],
    WILL_DISCONNECT: ["quit"],
};
Command._transformer = {
    argument: {},
    reply: {},
};
const msetArgumentTransformer = function (args) {
    if (args.length === 1) {
        if (typeof Map !== "undefined" && args[0] instanceof Map) {
            return utils.convertMapToArray(args[0]);
        }
        if (typeof args[0] === "object" && args[0] !== null) {
            return utils.convertObjectToArray(args[0]);
        }
    }
    return args;
};
const hsetArgumentTransformer = function (args) {
    if (args.length === 2) {
        if (typeof Map !== "undefined" && args[1] instanceof Map) {
            return [args[0]].concat(utils.convertMapToArray(args[1]));
        }
        if (typeof args[1] === "object" && args[1] !== null) {
            return [args[0]].concat(utils.convertObjectToArray(args[1]));
        }
    }
    return args;
};
Command.setArgumentTransformer("mset", msetArgumentTransformer);
Command.setArgumentTransformer("msetnx", msetArgumentTransformer);
Command.setArgumentTransformer("hset", hsetArgumentTransformer);
Command.setArgumentTransformer("hmset", hsetArgumentTransformer);
Command.setReplyTransformer("hgetall", function (result) {
    if (Array.isArray(result)) {
        const obj = {};
        for (let i = 0; i < result.length; i += 2) {
            obj[result[i]] = result[i + 1];
        }
        return obj;
    }
    return result;
});
class MixedBuffers {
    constructor() {
        this.length = 0;
        this.items = [];
    }
    push(x) {
        this.length += Buffer.byteLength(x);
        this.items.push(x);
    }
    toBuffer() {
        const result = Buffer.allocUnsafe(this.length);
        let offset = 0;
        for (const item of this.items) {
            const length = Buffer.byteLength(item);
            Buffer.isBuffer(item)
                ? item.copy(result, offset)
                : result.write(item, offset, length);
            offset += length;
        }
        return result;
    }
}

var command = /*#__PURE__*/Object.defineProperty({
	default: _default$i
}, '__esModule', {value: true});

class Script {
    constructor(lua, numberOfKeys = null, keyPrefix = "", readOnly = false) {
        this.lua = lua;
        this.numberOfKeys = numberOfKeys;
        this.keyPrefix = keyPrefix;
        this.readOnly = readOnly;
        this.sha = crypto_1__default['default'].createHash("sha1").update(lua).digest("hex");
    }
    execute(container, args, options, callback) {
        if (typeof this.numberOfKeys === "number") {
            args.unshift(this.numberOfKeys);
        }
        if (this.keyPrefix) {
            options.keyPrefix = this.keyPrefix;
        }
        if (this.readOnly) {
            options.readOnly = true;
        }
        const evalsha = new command.default("evalsha", [this.sha].concat(args), options);
        evalsha.isCustomCommand = true;
        const result = container.sendCommand(evalsha);
        if (promiseContainer.isPromise(result)) {
            return built$1.default(result.catch((err) => {
                if (err.toString().indexOf("NOSCRIPT") === -1) {
                    throw err;
                }
                return container.sendCommand(new command.default("eval", [this.lua].concat(args), options));
            }), callback);
        }
        // result is not a Promise--probably returned from a pipeline chain; however,
        // we still need the callback to fire when the script is evaluated
        built$1.default(evalsha.promise, callback);
        return result;
    }
}
var _default$h = Script;

var script = /*#__PURE__*/Object.defineProperty({
	default: _default$h
}, '__esModule', {value: true});

var autoPipelining = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



exports.kExec = Symbol("exec");
exports.kCallbacks = Symbol("callbacks");
exports.notAllowedAutoPipelineCommands = [
    "auth",
    "info",
    "script",
    "quit",
    "cluster",
    "pipeline",
    "multi",
    "subscribe",
    "psubscribe",
    "unsubscribe",
    "unpsubscribe",
];
function executeAutoPipeline(client, slotKey) {
    /*
      If a pipeline is already executing, keep queueing up commands
      since ioredis won't serve two pipelines at the same time
    */
    if (client._runningAutoPipelines.has(slotKey)) {
        return;
    }
    client._runningAutoPipelines.add(slotKey);
    // Get the pipeline and immediately delete it so that new commands are queued on a new pipeline
    const pipeline = client._autoPipelines.get(slotKey);
    client._autoPipelines.delete(slotKey);
    const callbacks = pipeline[exports.kCallbacks];
    // Perform the call
    pipeline.exec(function (err, results) {
        client._runningAutoPipelines.delete(slotKey);
        /*
          Invoke all callback in nextTick so the stack is cleared
          and callbacks can throw errors without affecting other callbacks.
        */
        if (err) {
            for (let i = 0; i < callbacks.length; i++) {
                process.nextTick(callbacks[i], err);
            }
        }
        else {
            for (let i = 0; i < callbacks.length; i++) {
                process.nextTick(callbacks[i], ...results[i]);
            }
        }
        // If there is another pipeline on the same node, immediately execute it without waiting for nextTick
        if (client._autoPipelines.has(slotKey)) {
            executeAutoPipeline(client, slotKey);
        }
    });
}
function shouldUseAutoPipelining(client, functionName, commandName) {
    return (functionName &&
        client.options.enableAutoPipelining &&
        !client.isPipeline &&
        !exports.notAllowedAutoPipelineCommands.includes(commandName) &&
        !client.options.autoPipeliningIgnoredCommands.includes(commandName));
}
exports.shouldUseAutoPipelining = shouldUseAutoPipelining;
function executeWithAutoPipelining(client, functionName, commandName, args, callback) {
    const CustomPromise = promiseContainer.get();
    // On cluster mode let's wait for slots to be available
    if (client.isCluster && !client.slots.length) {
        return new CustomPromise(function (resolve, reject) {
            client.delayUntilReady((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                executeWithAutoPipelining(client, functionName, commandName, args, callback).then(resolve, reject);
            });
        });
    }
    // If we have slot information, we can improve routing by grouping slots served by the same subset of nodes
    const slotKey = client.isCluster ? client.slots[lib(args[0])].join(",") : 'main';
    if (!client._autoPipelines.has(slotKey)) {
        const pipeline = client.pipeline();
        pipeline[exports.kExec] = false;
        pipeline[exports.kCallbacks] = [];
        client._autoPipelines.set(slotKey, pipeline);
    }
    const pipeline = client._autoPipelines.get(slotKey);
    /*
      Mark the pipeline as scheduled.
      The symbol will make sure that the pipeline is only scheduled once per tick.
      New commands are appended to an already scheduled pipeline.
    */
    if (!pipeline[exports.kExec]) {
        pipeline[exports.kExec] = true;
        /*
          Deferring with setImmediate so we have a chance to capture multiple
          commands that can be scheduled by I/O events already in the event loop queue.
        */
        setImmediate(executeAutoPipeline, client, slotKey);
    }
    // Create the promise which will execute the
    const autoPipelinePromise = new CustomPromise(function (resolve, reject) {
        pipeline[exports.kCallbacks].push(function (err, value) {
            if (err) {
                reject(err);
                return;
            }
            resolve(value);
        });
        pipeline[functionName](...args);
    });
    return built$1.default(autoPipelinePromise, callback);
}
exports.executeWithAutoPipelining = executeWithAutoPipelining;
});

const DROP_BUFFER_SUPPORT_ERROR = "*Buffer methods are not available " +
    'because "dropBufferSupport" option is enabled.' +
    "Refer to https://github.com/luin/ioredis/wiki/Improve-Performance for more details.";
/**
 * Commander
 *
 * This is the base class of Redis, Redis.Cluster and Pipeline
 *
 * @param {boolean} [options.showFriendlyErrorStack=false] - Whether to show a friendly error stack.
 * Will decrease the performance significantly.
 * @constructor
 */
function Commander() {
    this.options = lodash.defaults({}, this.options || {}, {
        showFriendlyErrorStack: false,
    });
    this.scriptsSet = {};
    this.addedBuiltinSet = new Set();
}
var _default$g = Commander;
const commands = redisCommands.list.filter(function (command) {
    return command !== "monitor";
});
commands.push("sentinel");
/**
 * Return supported builtin commands
 *
 * @return {string[]} command list
 * @public
 */
Commander.prototype.getBuiltinCommands = function () {
    return commands.slice(0);
};
/**
 * Create a builtin command
 *
 * @param {string} commandName - command name
 * @return {object} functions
 * @public
 */
Commander.prototype.createBuiltinCommand = function (commandName) {
    return {
        string: generateFunction(null, commandName, "utf8"),
        buffer: generateFunction(null, commandName, null),
    };
};
/**
 * Create add builtin command
 *
 * @param {string} commandName - command name
 * @return {object} functions
 * @public
 */
Commander.prototype.addBuiltinCommand = function (commandName) {
    this.addedBuiltinSet.add(commandName);
    this[commandName] = generateFunction(commandName, commandName, "utf8");
    this[commandName + "Buffer"] = generateFunction(commandName + "Buffer", commandName, null);
};
commands.forEach(function (commandName) {
    Commander.prototype[commandName] = generateFunction(commandName, commandName, "utf8");
    Commander.prototype[commandName + "Buffer"] = generateFunction(commandName + "Buffer", commandName, null);
});
Commander.prototype.call = generateFunction("call", "utf8");
Commander.prototype.callBuffer = generateFunction("callBuffer", null);
// eslint-disable-next-line @typescript-eslint/camelcase
Commander.prototype.send_command = Commander.prototype.call;
/**
 * Define a custom command using lua script
 *
 * @param {string} name - the command name
 * @param {object} definition
 * @param {string} definition.lua - the lua code
 * @param {number} [definition.numberOfKeys=null] - the number of keys.
 * @param {boolean} [definition.readOnly=false] - force this script to be readonly so it executes on slaves as well.
 * If omit, you have to pass the number of keys as the first argument every time you invoke the command
 */
Commander.prototype.defineCommand = function (name, definition) {
    const script$1 = new script.default(definition.lua, definition.numberOfKeys, this.options.keyPrefix, definition.readOnly);
    this.scriptsSet[name] = script$1;
    this[name] = generateScriptingFunction(name, name, script$1, "utf8");
    this[name + "Buffer"] = generateScriptingFunction(name + "Buffer", name, script$1, null);
};
/**
 * Send a command
 *
 * @abstract
 * @public
 */
Commander.prototype.sendCommand = function () { };
function generateFunction(functionName, _commandName, _encoding) {
    if (typeof _encoding === "undefined") {
        _encoding = _commandName;
        _commandName = null;
    }
    return function (...args) {
        const commandName = _commandName || args.shift();
        let callback = args[args.length - 1];
        if (typeof callback === "function") {
            args.pop();
        }
        else {
            callback = undefined;
        }
        const options = {
            errorStack: this.options.showFriendlyErrorStack ? new Error() : undefined,
            keyPrefix: this.options.keyPrefix,
            replyEncoding: _encoding,
        };
        if (this.options.dropBufferSupport && !_encoding) {
            return built$1.default(promiseContainer.get().reject(new Error(DROP_BUFFER_SUPPORT_ERROR)), callback);
        }
        // No auto pipeline, use regular command sending
        if (!autoPipelining.shouldUseAutoPipelining(this, functionName, commandName)) {
            return this.sendCommand(new command.default(commandName, args, options, callback));
        }
        // Create a new pipeline and make sure it's scheduled
        return autoPipelining.executeWithAutoPipelining(this, functionName, commandName, args, callback);
    };
}
function generateScriptingFunction(functionName, commandName, script, encoding) {
    return function () {
        let length = arguments.length;
        const lastArgIndex = length - 1;
        let callback = arguments[lastArgIndex];
        if (typeof callback !== "function") {
            callback = undefined;
        }
        else {
            length = lastArgIndex;
        }
        const args = new Array(length);
        for (let i = 0; i < length; i++) {
            args[i] = arguments[i];
        }
        let options;
        if (this.options.dropBufferSupport) {
            if (!encoding) {
                return built$1.default(promiseContainer.get().reject(new Error(DROP_BUFFER_SUPPORT_ERROR)), callback);
            }
            options = { replyEncoding: null };
        }
        else {
            options = { replyEncoding: encoding };
        }
        if (this.options.showFriendlyErrorStack) {
            options.errorStack = new Error();
        }
        // No auto pipeline, use regular command sending
        if (!autoPipelining.shouldUseAutoPipelining(this, functionName, commandName)) {
            return script.execute(this, args, options, callback);
        }
        // Create a new pipeline and make sure it's scheduled
        return autoPipelining.executeWithAutoPipelining(this, functionName, commandName, args, callback);
    };
}

var commander = /*#__PURE__*/Object.defineProperty({
	default: _default$g
}, '__esModule', {value: true});

// RedisError

function RedisError$1 (message) {
  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });
  Error.captureStackTrace(this, this.constructor);
}

util__default['default'].inherits(RedisError$1, Error);

Object.defineProperty(RedisError$1.prototype, 'name', {
  value: 'RedisError',
  configurable: true,
  writable: true
});

// ParserError

function ParserError$2 (message, buffer, offset) {
  assert__default['default'](buffer);
  assert__default['default'].strictEqual(typeof offset, 'number');

  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });

  const tmp = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  Error.captureStackTrace(this, this.constructor);
  Error.stackTraceLimit = tmp;
  this.offset = offset;
  this.buffer = buffer;
}

util__default['default'].inherits(ParserError$2, RedisError$1);

Object.defineProperty(ParserError$2.prototype, 'name', {
  value: 'ParserError',
  configurable: true,
  writable: true
});

// ReplyError

function ReplyError$2 (message) {
  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });
  const tmp = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  Error.captureStackTrace(this, this.constructor);
  Error.stackTraceLimit = tmp;
}

util__default['default'].inherits(ReplyError$2, RedisError$1);

Object.defineProperty(ReplyError$2.prototype, 'name', {
  value: 'ReplyError',
  configurable: true,
  writable: true
});

// AbortError

function AbortError$1 (message) {
  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });
  Error.captureStackTrace(this, this.constructor);
}

util__default['default'].inherits(AbortError$1, RedisError$1);

Object.defineProperty(AbortError$1.prototype, 'name', {
  value: 'AbortError',
  configurable: true,
  writable: true
});

// InterruptError

function InterruptError$1 (message) {
  Object.defineProperty(this, 'message', {
    value: message || '',
    configurable: true,
    writable: true
  });
  Error.captureStackTrace(this, this.constructor);
}

util__default['default'].inherits(InterruptError$1, AbortError$1);

Object.defineProperty(InterruptError$1.prototype, 'name', {
  value: 'InterruptError',
  configurable: true,
  writable: true
});

var old = {
  RedisError: RedisError$1,
  ParserError: ParserError$2,
  ReplyError: ReplyError$2,
  AbortError: AbortError$1,
  InterruptError: InterruptError$1
};

class RedisError extends Error {
  get name () {
    return this.constructor.name
  }
}

class ParserError$1 extends RedisError {
  constructor (message, buffer, offset) {
    assert__default['default'](buffer);
    assert__default['default'].strictEqual(typeof offset, 'number');

    const tmp = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    super(message);
    Error.stackTraceLimit = tmp;
    this.offset = offset;
    this.buffer = buffer;
  }

  get name () {
    return this.constructor.name
  }
}

class ReplyError$1 extends RedisError {
  constructor (message) {
    const tmp = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    super(message);
    Error.stackTraceLimit = tmp;
  }
  get name () {
    return this.constructor.name
  }
}

class AbortError extends RedisError {
  get name () {
    return this.constructor.name
  }
}

class InterruptError extends AbortError {
  get name () {
    return this.constructor.name
  }
}

var modern = {
  RedisError,
  ParserError: ParserError$1,
  ReplyError: ReplyError$1,
  AbortError,
  InterruptError
};

const Errors = process.version.charCodeAt(1) < 55 && process.version.charCodeAt(2) === 46
  ? old // Node.js < 7
  : modern;

var redisErrors = Errors;

class MaxRetriesPerRequestError$1 extends redisErrors.AbortError {
    constructor(maxRetriesPerRequest) {
        const message = `Reached the max retries per request limit (which is ${maxRetriesPerRequest}). Refer to "maxRetriesPerRequest" option for details.`;
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
    get name() {
        return this.constructor.name;
    }
}
var _default$f = MaxRetriesPerRequestError$1;

var MaxRetriesPerRequestError_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$f
}, '__esModule', {value: true});

var MaxRetriesPerRequestError = MaxRetriesPerRequestError_1.default;

var errors = /*#__PURE__*/Object.defineProperty({
	MaxRetriesPerRequestError: MaxRetriesPerRequestError
}, '__esModule', {value: true});

const Buffer$1 = require$$0__default['default'].Buffer;
const StringDecoder = require$$1__default['default'].StringDecoder;
const decoder = new StringDecoder();

const ReplyError = redisErrors.ReplyError;
const ParserError = redisErrors.ParserError;
var bufferPool = Buffer$1.allocUnsafe(32 * 1024);
var bufferOffset = 0;
var interval = null;
var counter = 0;
var notDecreased = 0;

/**
 * Used for integer numbers only
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|number}
 */
function parseSimpleNumbers (parser) {
  const length = parser.buffer.length - 1;
  var offset = parser.offset;
  var number = 0;
  var sign = 1;

  if (parser.buffer[offset] === 45) {
    sign = -1;
    offset++;
  }

  while (offset < length) {
    const c1 = parser.buffer[offset++];
    if (c1 === 13) { // \r\n
      parser.offset = offset + 1;
      return sign * number
    }
    number = (number * 10) + (c1 - 48);
  }
}

/**
 * Used for integer numbers in case of the returnNumbers option
 *
 * Reading the string as parts of n SMI is more efficient than
 * using a string directly.
 *
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|string}
 */
function parseStringNumbers (parser) {
  const length = parser.buffer.length - 1;
  var offset = parser.offset;
  var number = 0;
  var res = '';

  if (parser.buffer[offset] === 45) {
    res += '-';
    offset++;
  }

  while (offset < length) {
    var c1 = parser.buffer[offset++];
    if (c1 === 13) { // \r\n
      parser.offset = offset + 1;
      if (number !== 0) {
        res += number;
      }
      return res
    } else if (number > 429496728) {
      res += (number * 10) + (c1 - 48);
      number = 0;
    } else if (c1 === 48 && number === 0) {
      res += 0;
    } else {
      number = (number * 10) + (c1 - 48);
    }
  }
}

/**
 * Parse a '+' redis simple string response but forward the offsets
 * onto convertBufferRange to generate a string.
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|string|Buffer}
 */
function parseSimpleString (parser) {
  const start = parser.offset;
  const buffer = parser.buffer;
  const length = buffer.length - 1;
  var offset = start;

  while (offset < length) {
    if (buffer[offset++] === 13) { // \r\n
      parser.offset = offset + 1;
      if (parser.optionReturnBuffers === true) {
        return parser.buffer.slice(start, offset - 1)
      }
      return parser.buffer.toString('utf8', start, offset - 1)
    }
  }
}

/**
 * Returns the read length
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|number}
 */
function parseLength (parser) {
  const length = parser.buffer.length - 1;
  var offset = parser.offset;
  var number = 0;

  while (offset < length) {
    const c1 = parser.buffer[offset++];
    if (c1 === 13) {
      parser.offset = offset + 1;
      return number
    }
    number = (number * 10) + (c1 - 48);
  }
}

/**
 * Parse a ':' redis integer response
 *
 * If stringNumbers is activated the parser always returns numbers as string
 * This is important for big numbers (number > Math.pow(2, 53)) as js numbers
 * are 64bit floating point numbers with reduced precision
 *
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|number|string}
 */
function parseInteger (parser) {
  if (parser.optionStringNumbers === true) {
    return parseStringNumbers(parser)
  }
  return parseSimpleNumbers(parser)
}

/**
 * Parse a '$' redis bulk string response
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|null|string}
 */
function parseBulkString (parser) {
  const length = parseLength(parser);
  if (length === undefined) {
    return
  }
  if (length < 0) {
    return null
  }
  const offset = parser.offset + length;
  if (offset + 2 > parser.buffer.length) {
    parser.bigStrSize = offset + 2;
    parser.totalChunkSize = parser.buffer.length;
    parser.bufferCache.push(parser.buffer);
    return
  }
  const start = parser.offset;
  parser.offset = offset + 2;
  if (parser.optionReturnBuffers === true) {
    return parser.buffer.slice(start, offset)
  }
  return parser.buffer.toString('utf8', start, offset)
}

/**
 * Parse a '-' redis error response
 * @param {JavascriptRedisParser} parser
 * @returns {ReplyError}
 */
function parseError (parser) {
  var string = parseSimpleString(parser);
  if (string !== undefined) {
    if (parser.optionReturnBuffers === true) {
      string = string.toString();
    }
    return new ReplyError(string)
  }
}

/**
 * Parsing error handler, resets parser buffer
 * @param {JavascriptRedisParser} parser
 * @param {number} type
 * @returns {undefined}
 */
function handleError (parser, type) {
  const err = new ParserError(
    'Protocol error, got ' + JSON.stringify(String.fromCharCode(type)) + ' as reply type byte',
    JSON.stringify(parser.buffer),
    parser.offset
  );
  parser.buffer = null;
  parser.returnFatalError(err);
}

/**
 * Parse a '*' redis array response
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|null|any[]}
 */
function parseArray (parser) {
  const length = parseLength(parser);
  if (length === undefined) {
    return
  }
  if (length < 0) {
    return null
  }
  const responses = new Array(length);
  return parseArrayElements(parser, responses, 0)
}

/**
 * Push a partly parsed array to the stack
 *
 * @param {JavascriptRedisParser} parser
 * @param {any[]} array
 * @param {number} pos
 * @returns {undefined}
 */
function pushArrayCache (parser, array, pos) {
  parser.arrayCache.push(array);
  parser.arrayPos.push(pos);
}

/**
 * Parse chunked redis array response
 * @param {JavascriptRedisParser} parser
 * @returns {undefined|any[]}
 */
function parseArrayChunks (parser) {
  const tmp = parser.arrayCache.pop();
  var pos = parser.arrayPos.pop();
  if (parser.arrayCache.length) {
    const res = parseArrayChunks(parser);
    if (res === undefined) {
      pushArrayCache(parser, tmp, pos);
      return
    }
    tmp[pos++] = res;
  }
  return parseArrayElements(parser, tmp, pos)
}

/**
 * Parse redis array response elements
 * @param {JavascriptRedisParser} parser
 * @param {Array} responses
 * @param {number} i
 * @returns {undefined|null|any[]}
 */
function parseArrayElements (parser, responses, i) {
  const bufferLength = parser.buffer.length;
  while (i < responses.length) {
    const offset = parser.offset;
    if (parser.offset >= bufferLength) {
      pushArrayCache(parser, responses, i);
      return
    }
    const response = parseType(parser, parser.buffer[parser.offset++]);
    if (response === undefined) {
      if (!(parser.arrayCache.length || parser.bufferCache.length)) {
        parser.offset = offset;
      }
      pushArrayCache(parser, responses, i);
      return
    }
    responses[i] = response;
    i++;
  }

  return responses
}

/**
 * Called the appropriate parser for the specified type.
 *
 * 36: $
 * 43: +
 * 42: *
 * 58: :
 * 45: -
 *
 * @param {JavascriptRedisParser} parser
 * @param {number} type
 * @returns {*}
 */
function parseType (parser, type) {
  switch (type) {
    case 36:
      return parseBulkString(parser)
    case 43:
      return parseSimpleString(parser)
    case 42:
      return parseArray(parser)
    case 58:
      return parseInteger(parser)
    case 45:
      return parseError(parser)
    default:
      return handleError(parser, type)
  }
}

/**
 * Decrease the bufferPool size over time
 *
 * Balance between increasing and decreasing the bufferPool.
 * Decrease the bufferPool by 10% by removing the first 10% of the current pool.
 * @returns {undefined}
 */
function decreaseBufferPool () {
  if (bufferPool.length > 50 * 1024) {
    if (counter === 1 || notDecreased > counter * 2) {
      const minSliceLen = Math.floor(bufferPool.length / 10);
      const sliceLength = minSliceLen < bufferOffset
        ? bufferOffset
        : minSliceLen;
      bufferOffset = 0;
      bufferPool = bufferPool.slice(sliceLength, bufferPool.length);
    } else {
      notDecreased++;
      counter--;
    }
  } else {
    clearInterval(interval);
    counter = 0;
    notDecreased = 0;
    interval = null;
  }
}

/**
 * Check if the requested size fits in the current bufferPool.
 * If it does not, reset and increase the bufferPool accordingly.
 *
 * @param {number} length
 * @returns {undefined}
 */
function resizeBuffer (length) {
  if (bufferPool.length < length + bufferOffset) {
    const multiplier = length > 1024 * 1024 * 75 ? 2 : 3;
    if (bufferOffset > 1024 * 1024 * 111) {
      bufferOffset = 1024 * 1024 * 50;
    }
    bufferPool = Buffer$1.allocUnsafe(length * multiplier + bufferOffset);
    bufferOffset = 0;
    counter++;
    if (interval === null) {
      interval = setInterval(decreaseBufferPool, 50);
    }
  }
}

/**
 * Concat a bulk string containing multiple chunks
 *
 * Notes:
 * 1) The first chunk might contain the whole bulk string including the \r
 * 2) We are only safe to fully add up elements that are neither the first nor any of the last two elements
 *
 * @param {JavascriptRedisParser} parser
 * @returns {String}
 */
function concatBulkString (parser) {
  const list = parser.bufferCache;
  const oldOffset = parser.offset;
  var chunks = list.length;
  var offset = parser.bigStrSize - parser.totalChunkSize;
  parser.offset = offset;
  if (offset <= 2) {
    if (chunks === 2) {
      return list[0].toString('utf8', oldOffset, list[0].length + offset - 2)
    }
    chunks--;
    offset = list[list.length - 2].length + offset;
  }
  var res = decoder.write(list[0].slice(oldOffset));
  for (var i = 1; i < chunks - 1; i++) {
    res += decoder.write(list[i]);
  }
  res += decoder.end(list[i].slice(0, offset - 2));
  return res
}

/**
 * Concat the collected chunks from parser.bufferCache.
 *
 * Increases the bufferPool size beforehand if necessary.
 *
 * @param {JavascriptRedisParser} parser
 * @returns {Buffer}
 */
function concatBulkBuffer (parser) {
  const list = parser.bufferCache;
  const oldOffset = parser.offset;
  const length = parser.bigStrSize - oldOffset - 2;
  var chunks = list.length;
  var offset = parser.bigStrSize - parser.totalChunkSize;
  parser.offset = offset;
  if (offset <= 2) {
    if (chunks === 2) {
      return list[0].slice(oldOffset, list[0].length + offset - 2)
    }
    chunks--;
    offset = list[list.length - 2].length + offset;
  }
  resizeBuffer(length);
  const start = bufferOffset;
  list[0].copy(bufferPool, start, oldOffset, list[0].length);
  bufferOffset += list[0].length - oldOffset;
  for (var i = 1; i < chunks - 1; i++) {
    list[i].copy(bufferPool, bufferOffset);
    bufferOffset += list[i].length;
  }
  list[i].copy(bufferPool, bufferOffset, 0, offset - 2);
  bufferOffset += offset - 2;
  return bufferPool.slice(start, bufferOffset)
}

class JavascriptRedisParser {
  /**
   * Javascript Redis Parser constructor
   * @param {{returnError: Function, returnReply: Function, returnFatalError?: Function, returnBuffers: boolean, stringNumbers: boolean }} options
   * @constructor
   */
  constructor (options) {
    if (!options) {
      throw new TypeError('Options are mandatory.')
    }
    if (typeof options.returnError !== 'function' || typeof options.returnReply !== 'function') {
      throw new TypeError('The returnReply and returnError options have to be functions.')
    }
    this.setReturnBuffers(!!options.returnBuffers);
    this.setStringNumbers(!!options.stringNumbers);
    this.returnError = options.returnError;
    this.returnFatalError = options.returnFatalError || options.returnError;
    this.returnReply = options.returnReply;
    this.reset();
  }

  /**
   * Reset the parser values to the initial state
   *
   * @returns {undefined}
   */
  reset () {
    this.offset = 0;
    this.buffer = null;
    this.bigStrSize = 0;
    this.totalChunkSize = 0;
    this.bufferCache = [];
    this.arrayCache = [];
    this.arrayPos = [];
  }

  /**
   * Set the returnBuffers option
   *
   * @param {boolean} returnBuffers
   * @returns {undefined}
   */
  setReturnBuffers (returnBuffers) {
    if (typeof returnBuffers !== 'boolean') {
      throw new TypeError('The returnBuffers argument has to be a boolean')
    }
    this.optionReturnBuffers = returnBuffers;
  }

  /**
   * Set the stringNumbers option
   *
   * @param {boolean} stringNumbers
   * @returns {undefined}
   */
  setStringNumbers (stringNumbers) {
    if (typeof stringNumbers !== 'boolean') {
      throw new TypeError('The stringNumbers argument has to be a boolean')
    }
    this.optionStringNumbers = stringNumbers;
  }

  /**
   * Parse the redis buffer
   * @param {Buffer} buffer
   * @returns {undefined}
   */
  execute (buffer) {
    if (this.buffer === null) {
      this.buffer = buffer;
      this.offset = 0;
    } else if (this.bigStrSize === 0) {
      const oldLength = this.buffer.length;
      const remainingLength = oldLength - this.offset;
      const newBuffer = Buffer$1.allocUnsafe(remainingLength + buffer.length);
      this.buffer.copy(newBuffer, 0, this.offset, oldLength);
      buffer.copy(newBuffer, remainingLength, 0, buffer.length);
      this.buffer = newBuffer;
      this.offset = 0;
      if (this.arrayCache.length) {
        const arr = parseArrayChunks(this);
        if (arr === undefined) {
          return
        }
        this.returnReply(arr);
      }
    } else if (this.totalChunkSize + buffer.length >= this.bigStrSize) {
      this.bufferCache.push(buffer);
      var tmp = this.optionReturnBuffers ? concatBulkBuffer(this) : concatBulkString(this);
      this.bigStrSize = 0;
      this.bufferCache = [];
      this.buffer = buffer;
      if (this.arrayCache.length) {
        this.arrayCache[0][this.arrayPos[0]++] = tmp;
        tmp = parseArrayChunks(this);
        if (tmp === undefined) {
          return
        }
      }
      this.returnReply(tmp);
    } else {
      this.bufferCache.push(buffer);
      this.totalChunkSize += buffer.length;
      return
    }

    while (this.offset < this.buffer.length) {
      const offset = this.offset;
      const type = this.buffer[this.offset++];
      const response = parseType(this, type);
      if (response === undefined) {
        if (!(this.arrayCache.length || this.bufferCache.length)) {
          this.offset = offset;
        }
        return
      }

      if (type === 45) {
        this.returnError(response);
      } else {
        this.returnReply(response);
      }
    }

    this.buffer = null;
  }
}

var parser = JavascriptRedisParser;

var redisParser = parser;

/**
 * Tiny class to simplify dealing with subscription set
 *
 * @export
 * @class SubscriptionSet
 */
class SubscriptionSet {
    constructor() {
        this.set = {
            subscribe: {},
            psubscribe: {},
        };
    }
    add(set, channel) {
        this.set[mapSet(set)][channel] = true;
    }
    del(set, channel) {
        delete this.set[mapSet(set)][channel];
    }
    channels(set) {
        return Object.keys(this.set[mapSet(set)]);
    }
    isEmpty() {
        return (this.channels("subscribe").length === 0 &&
            this.channels("psubscribe").length === 0);
    }
}
var _default$e = SubscriptionSet;
function mapSet(set) {
    if (set === "unsubscribe") {
        return "subscribe";
    }
    if (set === "punsubscribe") {
        return "psubscribe";
    }
    return set;
}

var SubscriptionSet_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$e
}, '__esModule', {value: true});

const debug$8 = utils.Debug("dataHandler");
class DataHandler {
    constructor(redis, parserOptions) {
        this.redis = redis;
        const parser = new redisParser({
            stringNumbers: parserOptions.stringNumbers,
            returnBuffers: !parserOptions.dropBufferSupport,
            returnError: (err) => {
                this.returnError(err);
            },
            returnFatalError: (err) => {
                this.returnFatalError(err);
            },
            returnReply: (reply) => {
                this.returnReply(reply);
            },
        });
        redis.stream.on("data", (data) => {
            parser.execute(data);
        });
    }
    returnFatalError(err) {
        err.message += ". Please report this.";
        this.redis.recoverFromFatalError(err, err, { offlineQueue: false });
    }
    returnError(err) {
        const item = this.shiftCommand(err);
        if (!item) {
            return;
        }
        err.command = {
            name: item.command.name,
            args: item.command.args,
        };
        this.redis.handleReconnection(err, item);
    }
    returnReply(reply) {
        if (this.handleMonitorReply(reply)) {
            return;
        }
        if (this.handleSubscriberReply(reply)) {
            return;
        }
        const item = this.shiftCommand(reply);
        if (!item) {
            return;
        }
        if (command.default.checkFlag("ENTER_SUBSCRIBER_MODE", item.command.name)) {
            this.redis.condition.subscriber = new SubscriptionSet_1.default();
            this.redis.condition.subscriber.add(item.command.name, reply[1].toString());
            if (!fillSubCommand(item.command, reply[2])) {
                this.redis.commandQueue.unshift(item);
            }
        }
        else if (command.default.checkFlag("EXIT_SUBSCRIBER_MODE", item.command.name)) {
            if (!fillUnsubCommand(item.command, reply[2])) {
                this.redis.commandQueue.unshift(item);
            }
        }
        else {
            item.command.resolve(reply);
        }
    }
    handleSubscriberReply(reply) {
        if (!this.redis.condition.subscriber) {
            return false;
        }
        const replyType = Array.isArray(reply) ? reply[0].toString() : null;
        debug$8('receive reply "%s" in subscriber mode', replyType);
        switch (replyType) {
            case "message":
                if (this.redis.listeners("message").length > 0) {
                    // Check if there're listeners to avoid unnecessary `toString()`.
                    this.redis.emit("message", reply[1].toString(), reply[2].toString());
                }
                this.redis.emit("messageBuffer", reply[1], reply[2]);
                break;
            case "pmessage": {
                const pattern = reply[1].toString();
                if (this.redis.listeners("pmessage").length > 0) {
                    this.redis.emit("pmessage", pattern, reply[2].toString(), reply[3].toString());
                }
                this.redis.emit("pmessageBuffer", pattern, reply[2], reply[3]);
                break;
            }
            case "subscribe":
            case "psubscribe": {
                const channel = reply[1].toString();
                this.redis.condition.subscriber.add(replyType, channel);
                const item = this.shiftCommand(reply);
                if (!item) {
                    return;
                }
                if (!fillSubCommand(item.command, reply[2])) {
                    this.redis.commandQueue.unshift(item);
                }
                break;
            }
            case "unsubscribe":
            case "punsubscribe": {
                const channel = reply[1] ? reply[1].toString() : null;
                if (channel) {
                    this.redis.condition.subscriber.del(replyType, channel);
                }
                const count = reply[2];
                if (count === 0) {
                    this.redis.condition.subscriber = false;
                }
                const item = this.shiftCommand(reply);
                if (!item) {
                    return;
                }
                if (!fillUnsubCommand(item.command, count)) {
                    this.redis.commandQueue.unshift(item);
                }
                break;
            }
            default: {
                const item = this.shiftCommand(reply);
                if (!item) {
                    return;
                }
                item.command.resolve(reply);
            }
        }
        return true;
    }
    handleMonitorReply(reply) {
        if (this.redis.status !== "monitoring") {
            return false;
        }
        const replyStr = reply.toString();
        if (replyStr === "OK") {
            // Valid commands in the monitoring mode are AUTH and MONITOR,
            // both of which always reply with 'OK'.
            // So if we got an 'OK', we can make certain that
            // the reply is made to AUTH & MONITO.
            return false;
        }
        // Since commands sent in the monitoring mode will trigger an exception,
        // any replies we received in the monitoring mode should consider to be
        // realtime monitor data instead of result of commands.
        const len = replyStr.indexOf(" ");
        const timestamp = replyStr.slice(0, len);
        const argindex = replyStr.indexOf('"');
        const args = replyStr
            .slice(argindex + 1, -1)
            .split('" "')
            .map((elem) => elem.replace(/\\"/g, '"'));
        const dbAndSource = replyStr.slice(len + 2, argindex - 2).split(" ");
        this.redis.emit("monitor", timestamp, args, dbAndSource[1], dbAndSource[0]);
        return true;
    }
    shiftCommand(reply) {
        const item = this.redis.commandQueue.shift();
        if (!item) {
            const message = "Command queue state error. If you can reproduce this, please report it.";
            const error = new Error(message +
                (reply instanceof Error
                    ? ` Last error: ${reply.message}`
                    : ` Last reply: ${reply.toString()}`));
            this.redis.emit("error", error);
            return null;
        }
        return item;
    }
}
var _default$d = DataHandler;
function fillSubCommand(command, count) {
    // TODO: use WeakMap here
    if (typeof command.remainReplies === "undefined") {
        command.remainReplies = command.args.length;
    }
    if (--command.remainReplies === 0) {
        command.resolve(count);
        return true;
    }
    return false;
}
function fillUnsubCommand(command, count) {
    if (typeof command.remainReplies === "undefined") {
        command.remainReplies = command.args.length;
    }
    if (command.remainReplies === 0) {
        if (count === 0) {
            command.resolve(count);
            return true;
        }
        return false;
    }
    if (--command.remainReplies === 0) {
        command.resolve(count);
        return true;
    }
    return false;
}

var DataHandler_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$d
}, '__esModule', {value: true});

var event_handler = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });





const debug = utils.Debug("connection");
function connectHandler(self) {
    return function () {
        self.setStatus("connect");
        self.resetCommandQueue();
        // AUTH command should be processed before any other commands
        let flushed = false;
        const { connectionEpoch } = self;
        if (self.condition.auth) {
            self.auth(self.condition.auth, function (err) {
                if (connectionEpoch !== self.connectionEpoch) {
                    return;
                }
                if (err) {
                    if (err.message.indexOf("no password is set") !== -1) {
                        console.warn("[WARN] Redis server does not require a password, but a password was supplied.");
                    }
                    else if (err.message.indexOf("without any password configured for the default user") !== -1) {
                        console.warn("[WARN] This Redis server's `default` user does not require a password, but a password was supplied");
                    }
                    else if (err.message.indexOf("wrong number of arguments for 'auth' command") !== -1) {
                        console.warn(`[ERROR] The server returned "wrong number of arguments for 'auth' command". You are probably passing both username and password to Redis version 5 or below. You should only pass the 'password' option for Redis version 5 and under.`);
                    }
                    else {
                        flushed = true;
                        self.recoverFromFatalError(err, err);
                    }
                }
            });
        }
        if (self.condition.select) {
            self.select(self.condition.select).catch((err) => {
                // If the node is in cluster mode, select is disallowed.
                // In this case, reconnect won't help.
                self.silentEmit("error", err);
            });
        }
        if (!self.options.enableReadyCheck) {
            exports.readyHandler(self)();
        }
        /*
          No need to keep the reference of DataHandler here
          because we don't need to do the cleanup.
          `Stream#end()` will remove all listeners for us.
        */
        new DataHandler_1.default(self, {
            stringNumbers: self.options.stringNumbers,
            dropBufferSupport: self.options.dropBufferSupport,
        });
        if (self.options.enableReadyCheck) {
            self._readyCheck(function (err, info) {
                if (connectionEpoch !== self.connectionEpoch) {
                    return;
                }
                if (err) {
                    if (!flushed) {
                        self.recoverFromFatalError(new Error("Ready check failed: " + err.message), err);
                    }
                }
                else {
                    self.serverInfo = info;
                    if (self.connector.check(info)) {
                        exports.readyHandler(self)();
                    }
                    else {
                        self.disconnect(true);
                    }
                }
            });
        }
    };
}
exports.connectHandler = connectHandler;
function abortError(command) {
    const err = new redisErrors.AbortError("Command aborted due to connection close");
    err.command = {
        name: command.name,
        args: command.args,
    };
    return err;
}
// If a contiguous set of pipeline commands starts from index zero then they
// can be safely reattempted. If however we have a chain of pipelined commands
// starting at index 1 or more it means we received a partial response before
// the connection close and those pipelined commands must be aborted. For
// example, if the queue looks like this: [2, 3, 4, 0, 1, 2] then after
// aborting and purging we'll have a queue that looks like this: [0, 1, 2]
function abortIncompletePipelines(commandQueue) {
    let expectedIndex = 0;
    for (let i = 0; i < commandQueue.length;) {
        const command = commandQueue.peekAt(i).command;
        const pipelineIndex = command.pipelineIndex;
        if (pipelineIndex === undefined || pipelineIndex === 0) {
            expectedIndex = 0;
        }
        if (pipelineIndex !== undefined && pipelineIndex !== expectedIndex++) {
            commandQueue.remove(i, 1);
            command.reject(abortError(command));
            continue;
        }
        i++;
    }
}
// If only a partial transaction result was received before connection close,
// we have to abort any transaction fragments that may have ended up in the
// offline queue
function abortTransactionFragments(commandQueue) {
    for (let i = 0; i < commandQueue.length;) {
        const command = commandQueue.peekAt(i).command;
        if (command.name === "multi") {
            break;
        }
        if (command.name === "exec") {
            commandQueue.remove(i, 1);
            command.reject(abortError(command));
            break;
        }
        if (command.inTransaction) {
            commandQueue.remove(i, 1);
            command.reject(abortError(command));
        }
        else {
            i++;
        }
    }
}
function closeHandler(self) {
    return function () {
        self.setStatus("close");
        if (!self.prevCondition) {
            self.prevCondition = self.condition;
        }
        if (self.commandQueue.length) {
            abortIncompletePipelines(self.commandQueue);
            self.prevCommandQueue = self.commandQueue;
        }
        if (self.offlineQueue.length) {
            abortTransactionFragments(self.offlineQueue);
        }
        if (self.manuallyClosing) {
            self.manuallyClosing = false;
            debug("skip reconnecting since the connection is manually closed.");
            return close();
        }
        if (typeof self.options.retryStrategy !== "function") {
            debug("skip reconnecting because `retryStrategy` is not a function");
            return close();
        }
        const retryDelay = self.options.retryStrategy(++self.retryAttempts);
        if (typeof retryDelay !== "number") {
            debug("skip reconnecting because `retryStrategy` doesn't return a number");
            return close();
        }
        debug("reconnect in %sms", retryDelay);
        self.setStatus("reconnecting", retryDelay);
        self.reconnectTimeout = setTimeout(function () {
            self.reconnectTimeout = null;
            self.connect().catch(utils.noop);
        }, retryDelay);
        const { maxRetriesPerRequest } = self.options;
        if (typeof maxRetriesPerRequest === "number") {
            if (maxRetriesPerRequest < 0) {
                debug("maxRetriesPerRequest is negative, ignoring...");
            }
            else {
                const remainder = self.retryAttempts % (maxRetriesPerRequest + 1);
                if (remainder === 0) {
                    debug("reach maxRetriesPerRequest limitation, flushing command queue...");
                    self.flushQueue(new errors.MaxRetriesPerRequestError(maxRetriesPerRequest));
                }
            }
        }
    };
    function close() {
        self.setStatus("end");
        self.flushQueue(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
    }
}
exports.closeHandler = closeHandler;
function errorHandler(self) {
    return function (error) {
        debug("error: %s", error);
        self.silentEmit("error", error);
    };
}
exports.errorHandler = errorHandler;
function readyHandler(self) {
    return function () {
        self.setStatus("ready");
        self.retryAttempts = 0;
        if (self.options.monitor) {
            self.call("monitor");
            const { sendCommand } = self;
            self.sendCommand = function (command$1) {
                if (command.default.checkFlag("VALID_IN_MONITOR_MODE", command$1.name)) {
                    return sendCommand.call(self, command$1);
                }
                command$1.reject(new Error("Connection is in monitoring mode, can't process commands."));
                return command$1.promise;
            };
            self.once("close", function () {
                delete self.sendCommand;
            });
            self.setStatus("monitoring");
            return;
        }
        const finalSelect = self.prevCondition
            ? self.prevCondition.select
            : self.condition.select;
        if (self.options.connectionName) {
            debug("set the connection name [%s]", self.options.connectionName);
            self.client("setname", self.options.connectionName).catch(utils.noop);
        }
        if (self.options.readOnly) {
            debug("set the connection to readonly mode");
            self.readonly().catch(utils.noop);
        }
        if (self.prevCondition) {
            const condition = self.prevCondition;
            self.prevCondition = null;
            if (condition.subscriber && self.options.autoResubscribe) {
                // We re-select the previous db first since
                // `SELECT` command is not valid in sub mode.
                if (self.condition.select !== finalSelect) {
                    debug("connect to db [%d]", finalSelect);
                    self.select(finalSelect);
                }
                const subscribeChannels = condition.subscriber.channels("subscribe");
                if (subscribeChannels.length) {
                    debug("subscribe %d channels", subscribeChannels.length);
                    self.subscribe(subscribeChannels);
                }
                const psubscribeChannels = condition.subscriber.channels("psubscribe");
                if (psubscribeChannels.length) {
                    debug("psubscribe %d channels", psubscribeChannels.length);
                    self.psubscribe(psubscribeChannels);
                }
            }
        }
        if (self.prevCommandQueue) {
            if (self.options.autoResendUnfulfilledCommands) {
                debug("resend %d unfulfilled commands", self.prevCommandQueue.length);
                while (self.prevCommandQueue.length > 0) {
                    const item = self.prevCommandQueue.shift();
                    if (item.select !== self.condition.select &&
                        item.command.name !== "select") {
                        self.select(item.select);
                    }
                    self.sendCommand(item.command, item.stream);
                }
            }
            else {
                self.prevCommandQueue = null;
            }
        }
        if (self.offlineQueue.length) {
            debug("send %d commands in offline queue", self.offlineQueue.length);
            const offlineQueue = self.offlineQueue;
            self.resetOfflineQueue();
            while (offlineQueue.length > 0) {
                const item = offlineQueue.shift();
                if (item.select !== self.condition.select &&
                    item.command.name !== "select") {
                    self.select(item.select);
                }
                self.sendCommand(item.command, item.stream);
            }
        }
        if (self.condition.select !== finalSelect) {
            debug("connect to db [%d]", finalSelect);
            self.select(finalSelect);
        }
    };
}
exports.readyHandler = readyHandler;
});

const debug$7 = utils.Debug("AbstractConnector");
class AbstractConnector {
    constructor(disconnectTimeout) {
        this.connecting = false;
        this.disconnectTimeout = disconnectTimeout;
    }
    check(info) {
        return true;
    }
    disconnect() {
        this.connecting = false;
        if (this.stream) {
            const stream = this.stream; // Make sure callbacks refer to the same instance
            const timeout = setTimeout(() => {
                debug$7("stream %s:%s still open, destroying it", stream.remoteAddress, stream.remotePort);
                stream.destroy();
            }, this.disconnectTimeout);
            stream.on("close", () => clearTimeout(timeout));
            stream.end();
        }
    }
}
var _default$c = AbstractConnector;

var AbstractConnector_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$c
}, '__esModule', {value: true});

function isIIpcConnectionOptions(value) {
    return value.path;
}
var isIIpcConnectionOptions_1 = isIIpcConnectionOptions;
class StandaloneConnector$1 extends AbstractConnector_1.default {
    constructor(options) {
        super(options.disconnectTimeout);
        this.options = options;
    }
    connect(_) {
        const { options } = this;
        this.connecting = true;
        let connectionOptions;
        if (isIIpcConnectionOptions(options)) {
            connectionOptions = {
                path: options.path,
            };
        }
        else {
            connectionOptions = {};
            if (options.port != null) {
                connectionOptions.port = options.port;
            }
            if (options.host != null) {
                connectionOptions.host = options.host;
            }
            if (options.family != null) {
                connectionOptions.family = options.family;
            }
        }
        if (options.tls) {
            Object.assign(connectionOptions, options.tls);
        }
        // TODO:
        // We use native Promise here since other Promise
        // implementation may use different schedulers that
        // cause issue when the stream is resolved in the
        // next tick.
        // Should use the provided promise in the next major
        // version and do not connect before resolved.
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                if (!this.connecting) {
                    reject(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
                    return;
                }
                try {
                    if (options.tls) {
                        this.stream = tls_1__default['default'].connect(connectionOptions);
                    }
                    else {
                        this.stream = net_1__default['default'].createConnection(connectionOptions);
                    }
                }
                catch (err) {
                    reject(err);
                    return;
                }
                this.stream.once("error", (err) => {
                    this.firstError = err;
                });
                resolve(this.stream);
            });
        });
    }
}
var _default$b = StandaloneConnector$1;

var StandaloneConnector_1 = /*#__PURE__*/Object.defineProperty({
	isIIpcConnectionOptions: isIIpcConnectionOptions_1,
	default: _default$b
}, '__esModule', {value: true});

function isSentinelEql(a, b) {
    return ((a.host || "127.0.0.1") === (b.host || "127.0.0.1") &&
        (a.port || 26379) === (b.port || 26379));
}
class SentinelIterator$1 {
    constructor(sentinels) {
        this.cursor = 0;
        this.sentinels = sentinels.slice(0);
    }
    next() {
        const done = this.cursor >= this.sentinels.length;
        return { done, value: done ? undefined : this.sentinels[this.cursor++] };
    }
    reset(moveCurrentEndpointToFirst) {
        if (moveCurrentEndpointToFirst &&
            this.sentinels.length > 1 &&
            this.cursor !== 1) {
            this.sentinels.unshift(...this.sentinels.splice(this.cursor - 1));
        }
        this.cursor = 0;
    }
    add(sentinel) {
        for (let i = 0; i < this.sentinels.length; i++) {
            if (isSentinelEql(sentinel, this.sentinels[i])) {
                return false;
            }
        }
        this.sentinels.push(sentinel);
        return true;
    }
    toString() {
        return `${JSON.stringify(this.sentinels)} @${this.cursor}`;
    }
}
var _default$a = SentinelIterator$1;

var SentinelIterator_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$a
}, '__esModule', {value: true});

var __awaiter$1 = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const debug$6 = utils.Debug("FailoverDetector");
const CHANNEL_NAME = "+switch-master";
class FailoverDetector {
    // sentinels can't be used for regular commands after this
    constructor(connector, sentinels) {
        this.isDisconnected = false;
        this.connector = connector;
        this.sentinels = sentinels;
    }
    cleanup() {
        this.isDisconnected = true;
        for (const sentinel of this.sentinels) {
            sentinel.client.disconnect();
        }
    }
    subscribe() {
        return __awaiter$1(this, void 0, void 0, function* () {
            debug$6("Starting FailoverDetector");
            const promises = [];
            for (const sentinel of this.sentinels) {
                const promise = sentinel.client.subscribe(CHANNEL_NAME).catch((err) => {
                    debug$6("Failed to subscribe to failover messages on sentinel %s:%s (%s)", sentinel.address.host || "127.0.0.1", sentinel.address.port || 26739, err.message);
                });
                promises.push(promise);
                sentinel.client.on("message", (channel) => {
                    if (!this.isDisconnected && channel === CHANNEL_NAME) {
                        this.disconnect();
                    }
                });
            }
            yield Promise.all(promises);
        });
    }
    disconnect() {
        // Avoid disconnecting more than once per failover.
        // A new FailoverDetector will be created after reconnecting.
        this.isDisconnected = true;
        debug$6("Failover detected, disconnecting");
        // Will call this.cleanup()
        this.connector.disconnect();
    }
}
var FailoverDetector_2 = FailoverDetector;

var FailoverDetector_1 = /*#__PURE__*/Object.defineProperty({
	FailoverDetector: FailoverDetector_2
}, '__esModule', {value: true});

var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






var SentinelIterator = SentinelIterator_1.default;



const debug$5 = utils.Debug("SentinelConnector");
class SentinelConnector$1 extends AbstractConnector_1.default {
    constructor(options) {
        super(options.disconnectTimeout);
        this.options = options;
        this.failoverDetector = null;
        this.emitter = null;
        if (!this.options.sentinels.length) {
            throw new Error("Requires at least one sentinel to connect to.");
        }
        if (!this.options.name) {
            throw new Error("Requires the name of master.");
        }
        this.sentinelIterator = new SentinelIterator_1.default(this.options.sentinels);
    }
    check(info) {
        const roleMatches = !info.role || this.options.role === info.role;
        if (!roleMatches) {
            debug$5("role invalid, expected %s, but got %s", this.options.role, info.role);
            // Start from the next item.
            // Note that `reset` will move the cursor to the previous element,
            // so we advance two steps here.
            this.sentinelIterator.next();
            this.sentinelIterator.next();
            this.sentinelIterator.reset(true);
        }
        return roleMatches;
    }
    disconnect() {
        super.disconnect();
        if (this.failoverDetector) {
            this.failoverDetector.cleanup();
        }
    }
    connect(eventEmitter) {
        this.connecting = true;
        this.retryAttempts = 0;
        let lastError;
        const connectToNext = () => __awaiter(this, void 0, void 0, function* () {
            const endpoint = this.sentinelIterator.next();
            if (endpoint.done) {
                this.sentinelIterator.reset(false);
                const retryDelay = typeof this.options.sentinelRetryStrategy === "function"
                    ? this.options.sentinelRetryStrategy(++this.retryAttempts)
                    : null;
                let errorMsg = typeof retryDelay !== "number"
                    ? "All sentinels are unreachable and retry is disabled."
                    : `All sentinels are unreachable. Retrying from scratch after ${retryDelay}ms.`;
                if (lastError) {
                    errorMsg += ` Last error: ${lastError.message}`;
                }
                debug$5(errorMsg);
                const error = new Error(errorMsg);
                if (typeof retryDelay === "number") {
                    eventEmitter("error", error);
                    yield new Promise((resolve) => setTimeout(resolve, retryDelay));
                    return connectToNext();
                }
                else {
                    throw error;
                }
            }
            let resolved = null;
            let err = null;
            try {
                resolved = yield this.resolve(endpoint.value);
            }
            catch (error) {
                err = error;
            }
            if (!this.connecting) {
                throw new Error(utils.CONNECTION_CLOSED_ERROR_MSG);
            }
            const endpointAddress = endpoint.value.host + ":" + endpoint.value.port;
            if (resolved) {
                debug$5("resolved: %s:%s from sentinel %s", resolved.host, resolved.port, endpointAddress);
                if (this.options.enableTLSForSentinelMode && this.options.tls) {
                    Object.assign(resolved, this.options.tls);
                    this.stream = tls_1__default['default'].connect(resolved);
                }
                else {
                    this.stream = net_1__default['default'].createConnection(resolved);
                }
                this.stream.once("connect", () => this.initFailoverDetector());
                this.stream.once("error", (err) => {
                    this.firstError = err;
                });
                return this.stream;
            }
            else {
                const errorMsg = err
                    ? "failed to connect to sentinel " +
                        endpointAddress +
                        " because " +
                        err.message
                    : "connected to sentinel " +
                        endpointAddress +
                        " successfully, but got an invalid reply: " +
                        resolved;
                debug$5(errorMsg);
                eventEmitter("sentinelError", new Error(errorMsg));
                if (err) {
                    lastError = err;
                }
                return connectToNext();
            }
        });
        return connectToNext();
    }
    updateSentinels(client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.updateSentinels) {
                return;
            }
            const result = yield client.sentinel("sentinels", this.options.name);
            if (!Array.isArray(result)) {
                return;
            }
            result
                .map(utils.packObject)
                .forEach((sentinel) => {
                const flags = sentinel.flags ? sentinel.flags.split(",") : [];
                if (flags.indexOf("disconnected") === -1 &&
                    sentinel.ip &&
                    sentinel.port) {
                    const endpoint = this.sentinelNatResolve(addressResponseToAddress(sentinel));
                    if (this.sentinelIterator.add(endpoint)) {
                        debug$5("adding sentinel %s:%s", endpoint.host, endpoint.port);
                    }
                }
            });
            debug$5("Updated internal sentinels: %s", this.sentinelIterator);
        });
    }
    resolveMaster(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client.sentinel("get-master-addr-by-name", this.options.name);
            yield this.updateSentinels(client);
            return this.sentinelNatResolve(Array.isArray(result)
                ? { host: result[0], port: Number(result[1]) }
                : null);
        });
    }
    resolveSlave(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client.sentinel("slaves", this.options.name);
            if (!Array.isArray(result)) {
                return null;
            }
            const availableSlaves = result
                .map(utils.packObject)
                .filter((slave) => slave.flags && !slave.flags.match(/(disconnected|s_down|o_down)/));
            return this.sentinelNatResolve(selectPreferredSentinel(availableSlaves, this.options.preferredSlaves));
        });
    }
    sentinelNatResolve(item) {
        if (!item || !this.options.natMap)
            return item;
        return this.options.natMap[`${item.host}:${item.port}`] || item;
    }
    connectToSentinel(endpoint, options) {
        return new redis.default(Object.assign({ port: endpoint.port || 26379, host: endpoint.host, username: this.options.sentinelUsername || null, password: this.options.sentinelPassword || null, family: endpoint.family ||
                (StandaloneConnector_1.isIIpcConnectionOptions(this.options)
                    ? undefined
                    : this.options.family), tls: this.options.sentinelTLS, retryStrategy: null, enableReadyCheck: false, connectTimeout: this.options.connectTimeout, commandTimeout: this.options.sentinelCommandTimeout, dropBufferSupport: true }, options));
    }
    resolve(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.connectToSentinel(endpoint);
            // ignore the errors since resolve* methods will handle them
            client.on("error", noop);
            try {
                if (this.options.role === "slave") {
                    return yield this.resolveSlave(client);
                }
                else {
                    return yield this.resolveMaster(client);
                }
            }
            finally {
                client.disconnect();
            }
        });
    }
    initFailoverDetector() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.failoverDetector) {
                return;
            }
            // Move the current sentinel to the first position
            this.sentinelIterator.reset(true);
            const sentinels = [];
            // In case of a large amount of sentinels, limit the number of concurrent connections
            while (sentinels.length < this.options.sentinelMaxConnections) {
                const { done, value } = this.sentinelIterator.next();
                if (done) {
                    break;
                }
                const client = this.connectToSentinel(value, {
                    lazyConnect: true,
                    retryStrategy: this.options.sentinelReconnectStrategy,
                });
                client.on("reconnecting", () => {
                    var _a;
                    // Tests listen to this event
                    (_a = this.emitter) === null || _a === void 0 ? void 0 : _a.emit("sentinelReconnecting");
                });
                sentinels.push({ address: value, client });
            }
            this.sentinelIterator.reset(false);
            if (this.failoverDetector) {
                // Clean up previous detector
                this.failoverDetector.cleanup();
            }
            this.failoverDetector = new FailoverDetector_1.FailoverDetector(this, sentinels);
            yield this.failoverDetector.subscribe();
            // Tests listen to this event
            (_a = this.emitter) === null || _a === void 0 ? void 0 : _a.emit("failoverSubscribed");
        });
    }
}
var _default$9 = SentinelConnector$1;
function selectPreferredSentinel(availableSlaves, preferredSlaves) {
    if (availableSlaves.length === 0) {
        return null;
    }
    let selectedSlave;
    if (typeof preferredSlaves === "function") {
        selectedSlave = preferredSlaves(availableSlaves);
    }
    else if (preferredSlaves !== null && typeof preferredSlaves === "object") {
        const preferredSlavesArray = Array.isArray(preferredSlaves)
            ? preferredSlaves
            : [preferredSlaves];
        // sort by priority
        preferredSlavesArray.sort((a, b) => {
            // default the priority to 1
            if (!a.prio) {
                a.prio = 1;
            }
            if (!b.prio) {
                b.prio = 1;
            }
            // lowest priority first
            if (a.prio < b.prio) {
                return -1;
            }
            if (a.prio > b.prio) {
                return 1;
            }
            return 0;
        });
        // loop over preferred slaves and return the first match
        for (let p = 0; p < preferredSlavesArray.length; p++) {
            for (let a = 0; a < availableSlaves.length; a++) {
                const slave = availableSlaves[a];
                if (slave.ip === preferredSlavesArray[p].ip) {
                    if (slave.port === preferredSlavesArray[p].port) {
                        selectedSlave = slave;
                        break;
                    }
                }
            }
            if (selectedSlave) {
                break;
            }
        }
    }
    // if none of the preferred slaves are available, a random available slave is returned
    if (!selectedSlave) {
        selectedSlave = utils.sample(availableSlaves);
    }
    return addressResponseToAddress(selectedSlave);
}
function addressResponseToAddress(input) {
    return { host: input.ip, port: Number(input.port) };
}
function noop() { }

var SentinelConnector_1 = /*#__PURE__*/Object.defineProperty({
	SentinelIterator: SentinelIterator,
	default: _default$9
}, '__esModule', {value: true});

var StandaloneConnector = StandaloneConnector_1.default;

var SentinelConnector = SentinelConnector_1.default;

var connectors = /*#__PURE__*/Object.defineProperty({
	StandaloneConnector: StandaloneConnector,
	SentinelConnector: SentinelConnector
}, '__esModule', {value: true});

/**
 * Convenient class to convert the process of scaning keys to a readable stream.
 *
 * @export
 * @class ScanStream
 * @extends {Readable}
 */
class ScanStream extends stream_1__default['default'].Readable {
    constructor(opt) {
        super(opt);
        this.opt = opt;
        this._redisCursor = "0";
        this._redisDrained = false;
    }
    _read() {
        if (this._redisDrained) {
            this.push(null);
            return;
        }
        const args = [this._redisCursor];
        if (this.opt.key) {
            args.unshift(this.opt.key);
        }
        if (this.opt.match) {
            args.push("MATCH", this.opt.match);
        }
        if (this.opt.type) {
            args.push("TYPE", this.opt.type);
        }
        if (this.opt.count) {
            args.push("COUNT", String(this.opt.count));
        }
        this.opt.redis[this.opt.command](args, (err, res) => {
            if (err) {
                this.emit("error", err);
                return;
            }
            this._redisCursor = res[0] instanceof Buffer ? res[0].toString() : res[0];
            if (this._redisCursor === "0") {
                this._redisDrained = true;
            }
            this.push(res[1]);
        });
    }
    close() {
        this._redisDrained = true;
    }
}
var _default$8 = ScanStream;

var ScanStream_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$8
}, '__esModule', {value: true});

const pMap = (iterable, mapper, options) => new Promise((resolve, reject) => {
	options = Object.assign({
		concurrency: Infinity
	}, options);

	if (typeof mapper !== 'function') {
		throw new TypeError('Mapper function is required');
	}

	const {concurrency} = options;

	if (!(typeof concurrency === 'number' && concurrency >= 1)) {
		throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${concurrency}\` (${typeof concurrency})`);
	}

	const ret = [];
	const iterator = iterable[Symbol.iterator]();
	let isRejected = false;
	let isIterableDone = false;
	let resolvingCount = 0;
	let currentIndex = 0;

	const next = () => {
		if (isRejected) {
			return;
		}

		const nextItem = iterator.next();
		const i = currentIndex;
		currentIndex++;

		if (nextItem.done) {
			isIterableDone = true;

			if (resolvingCount === 0) {
				resolve(ret);
			}

			return;
		}

		resolvingCount++;

		Promise.resolve(nextItem.value)
			.then(element => mapper(element, i))
			.then(
				value => {
					ret[i] = value;
					resolvingCount--;
					next();
				},
				error => {
					isRejected = true;
					reject(error);
				}
			);
	};

	for (let i = 0; i < concurrency; i++) {
		next();

		if (isIterableDone) {
			break;
		}
	}
});

var pMap_1 = pMap;
// TODO: Remove this for the next major release
var _default$7 = pMap;
pMap_1.default = _default$7;

/*
  This function derives from the cluster-key-slot implementation.
  Instead of checking that all keys have the same slot, it checks that all slots are served by the same set of nodes.
  If this is satisfied, it returns the first key's slot.
*/
function generateMultiWithNodes(redis, keys) {
    const slot = lib(keys[0]);
    const target = redis._groupsBySlot[slot];
    for (let i = 1; i < keys.length; i++) {
        if (redis._groupsBySlot[lib(keys[i])] !== target) {
            return -1;
        }
    }
    return slot;
}
function Pipeline(redis) {
    commander.default.call(this);
    this.redis = redis;
    this.isCluster =
        this.redis.constructor.name === "Cluster" || this.redis.isCluster;
    this.isPipeline = true;
    this.options = redis.options;
    this._queue = [];
    this._result = [];
    this._transactions = 0;
    this._shaToScript = {};
    Object.keys(redis.scriptsSet).forEach((name) => {
        const script = redis.scriptsSet[name];
        this._shaToScript[script.sha] = script;
        this[name] = redis[name];
        this[name + "Buffer"] = redis[name + "Buffer"];
    });
    redis.addedBuiltinSet.forEach((name) => {
        this[name] = redis[name];
        this[name + "Buffer"] = redis[name + "Buffer"];
    });
    const Promise = promiseContainer.get();
    this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
    });
    const _this = this;
    Object.defineProperty(this, "length", {
        get: function () {
            return _this._queue.length;
        },
    });
}
var _default$6 = Pipeline;
Object.assign(Pipeline.prototype, commander.default.prototype);
Pipeline.prototype.fillResult = function (value, position) {
    if (this._queue[position].name === "exec" && Array.isArray(value[1])) {
        const execLength = value[1].length;
        for (let i = 0; i < execLength; i++) {
            if (value[1][i] instanceof Error) {
                continue;
            }
            const cmd = this._queue[position - (execLength - i)];
            try {
                value[1][i] = cmd.transformReply(value[1][i]);
            }
            catch (err) {
                value[1][i] = err;
            }
        }
    }
    this._result[position] = value;
    if (--this.replyPending) {
        return;
    }
    if (this.isCluster) {
        let retriable = true;
        let commonError;
        for (let i = 0; i < this._result.length; ++i) {
            const error = this._result[i][0];
            const command = this._queue[i];
            if (error) {
                if (command.name === "exec" &&
                    error.message ===
                        "EXECABORT Transaction discarded because of previous errors.") {
                    continue;
                }
                if (!commonError) {
                    commonError = {
                        name: error.name,
                        message: error.message,
                    };
                }
                else if (commonError.name !== error.name ||
                    commonError.message !== error.message) {
                    retriable = false;
                    break;
                }
            }
            else if (!command.inTransaction) {
                const isReadOnly = redisCommands.exists(command.name) && redisCommands.hasFlag(command.name, "readonly");
                if (!isReadOnly) {
                    retriable = false;
                    break;
                }
            }
        }
        if (commonError && retriable) {
            const _this = this;
            const errv = commonError.message.split(" ");
            const queue = this._queue;
            let inTransaction = false;
            this._queue = [];
            for (let i = 0; i < queue.length; ++i) {
                if (errv[0] === "ASK" &&
                    !inTransaction &&
                    queue[i].name !== "asking" &&
                    (!queue[i - 1] || queue[i - 1].name !== "asking")) {
                    const asking = new command.default("asking");
                    asking.ignore = true;
                    this.sendCommand(asking);
                }
                queue[i].initPromise();
                this.sendCommand(queue[i]);
                inTransaction = queue[i].inTransaction;
            }
            let matched = true;
            if (typeof this.leftRedirections === "undefined") {
                this.leftRedirections = {};
            }
            const exec = function () {
                _this.exec();
            };
            this.redis.handleError(commonError, this.leftRedirections, {
                moved: function (slot, key) {
                    _this.preferKey = key;
                    _this.redis.slots[errv[1]] = [key];
                    _this.redis._groupsBySlot[errv[1]] = _this.redis._groupsIds[_this.redis.slots[errv[1]].join(";")];
                    _this.redis.refreshSlotsCache();
                    _this.exec();
                },
                ask: function (slot, key) {
                    _this.preferKey = key;
                    _this.exec();
                },
                tryagain: exec,
                clusterDown: exec,
                connectionClosed: exec,
                maxRedirections: () => {
                    matched = false;
                },
                defaults: () => {
                    matched = false;
                },
            });
            if (matched) {
                return;
            }
        }
    }
    let ignoredCount = 0;
    for (let i = 0; i < this._queue.length - ignoredCount; ++i) {
        if (this._queue[i + ignoredCount].ignore) {
            ignoredCount += 1;
        }
        this._result[i] = this._result[i + ignoredCount];
    }
    this.resolve(this._result.slice(0, this._result.length - ignoredCount));
};
Pipeline.prototype.sendCommand = function (command) {
    if (this._transactions > 0) {
        command.inTransaction = true;
    }
    const position = this._queue.length;
    command.pipelineIndex = position;
    command.promise
        .then((result) => {
        this.fillResult([null, result], position);
    })
        .catch((error) => {
        this.fillResult([error], position);
    });
    this._queue.push(command);
    return this;
};
Pipeline.prototype.addBatch = function (commands) {
    let command, commandName, args;
    for (let i = 0; i < commands.length; ++i) {
        command = commands[i];
        commandName = command[0];
        args = command.slice(1);
        this[commandName].apply(this, args);
    }
    return this;
};
const multi = Pipeline.prototype.multi;
Pipeline.prototype.multi = function () {
    this._transactions += 1;
    return multi.apply(this, arguments);
};
const execBuffer = Pipeline.prototype.execBuffer;
const exec = Pipeline.prototype.exec;
Pipeline.prototype.execBuffer = util__default['default'].deprecate(function () {
    if (this._transactions > 0) {
        this._transactions -= 1;
    }
    return execBuffer.apply(this, arguments);
}, "Pipeline#execBuffer: Use Pipeline#exec instead");
Pipeline.prototype.exec = function (callback) {
    // Wait for the cluster to be connected, since we need nodes information before continuing
    if (this.isCluster && !this.redis.slots.length) {
        this.redis.delayUntilReady((err) => {
            if (err) {
                callback(err);
                return;
            }
            this.exec(callback);
        });
        return this.promise;
    }
    if (this._transactions > 0) {
        this._transactions -= 1;
        return (this.options.dropBufferSupport ? exec : execBuffer).apply(this, arguments);
    }
    if (!this.nodeifiedPromise) {
        this.nodeifiedPromise = true;
        built$1.default(this.promise, callback);
    }
    if (!this._queue.length) {
        this.resolve([]);
    }
    let pipelineSlot;
    if (this.isCluster) {
        // List of the first key for each command
        const sampleKeys = [];
        for (let i = 0; i < this._queue.length; i++) {
            const keys = this._queue[i].getKeys();
            if (keys.length) {
                sampleKeys.push(keys[0]);
            }
            // For each command, check that the keys belong to the same slot
            if (keys.length && lib.generateMulti(keys) < 0) {
                this.reject(new Error("All the keys in a pipeline command should belong to the same slot"));
                return this.promise;
            }
        }
        if (sampleKeys.length) {
            pipelineSlot = generateMultiWithNodes(this.redis, sampleKeys);
            if (pipelineSlot < 0) {
                this.reject(new Error("All keys in the pipeline should belong to the same slots allocation group"));
                return this.promise;
            }
        }
        else {
            // Send the pipeline to a random node
            pipelineSlot = (Math.random() * 16384) | 0;
        }
    }
    // Check whether scripts exists
    const scripts = [];
    for (let i = 0; i < this._queue.length; ++i) {
        const item = this._queue[i];
        if (item.name !== "evalsha") {
            continue;
        }
        const script = this._shaToScript[item.args[0]];
        if (!script ||
            this.redis._addedScriptHashes[script.sha] ||
            scripts.includes(script)) {
            continue;
        }
        scripts.push(script);
    }
    const _this = this;
    if (!scripts.length) {
        return execPipeline();
    }
    // In cluster mode, always load scripts before running the pipeline
    if (this.isCluster) {
        return pMap_1(scripts, (script) => _this.redis.script("load", script.lua), {
            concurrency: 10,
        }).then(function () {
            for (let i = 0; i < scripts.length; i++) {
                _this.redis._addedScriptHashes[scripts[i].sha] = true;
            }
            return execPipeline();
        });
    }
    return this.redis
        .script("exists", scripts.map(({ sha }) => sha))
        .then(function (results) {
        const pending = [];
        for (let i = 0; i < results.length; ++i) {
            if (!results[i]) {
                pending.push(scripts[i]);
            }
        }
        const Promise = promiseContainer.get();
        return Promise.all(pending.map(function (script) {
            return _this.redis.script("load", script.lua);
        }));
    })
        .then(function () {
        for (let i = 0; i < scripts.length; i++) {
            _this.redis._addedScriptHashes[scripts[i].sha] = true;
        }
        return execPipeline();
    });
    function execPipeline() {
        let data = "";
        let buffers;
        let writePending = (_this.replyPending = _this._queue.length);
        let node;
        if (_this.isCluster) {
            node = {
                slot: pipelineSlot,
                redis: _this.redis.connectionPool.nodes.all[_this.preferKey],
            };
        }
        let bufferMode = false;
        const stream = {
            write: function (writable) {
                if (writable instanceof Buffer) {
                    bufferMode = true;
                }
                if (bufferMode) {
                    if (!buffers) {
                        buffers = [];
                    }
                    if (typeof data === "string") {
                        buffers.push(Buffer.from(data, "utf8"));
                        data = undefined;
                    }
                    buffers.push(typeof writable === "string"
                        ? Buffer.from(writable, "utf8")
                        : writable);
                }
                else {
                    data += writable;
                }
                if (!--writePending) {
                    let sendData;
                    if (buffers) {
                        sendData = Buffer.concat(buffers);
                    }
                    else {
                        sendData = data;
                    }
                    if (_this.isCluster) {
                        node.redis.stream.write(sendData);
                    }
                    else {
                        _this.redis.stream.write(sendData);
                    }
                    // Reset writePending for resending
                    writePending = _this._queue.length;
                    data = "";
                    buffers = undefined;
                    bufferMode = false;
                }
            },
        };
        for (let i = 0; i < _this._queue.length; ++i) {
            _this.redis.sendCommand(_this._queue[i], stream, node);
        }
        return _this.promise;
    }
};

var pipeline = /*#__PURE__*/Object.defineProperty({
	default: _default$6
}, '__esModule', {value: true});

function addTransactionSupport(redis) {
    redis.pipeline = function (commands) {
        const pipeline$1 = new pipeline.default(this);
        if (Array.isArray(commands)) {
            pipeline$1.addBatch(commands);
        }
        return pipeline$1;
    };
    const { multi } = redis;
    redis.multi = function (commands, options) {
        if (typeof options === "undefined" && !Array.isArray(commands)) {
            options = commands;
            commands = null;
        }
        if (options && options.pipeline === false) {
            return multi.call(this);
        }
        const pipeline$1 = new pipeline.default(this);
        pipeline$1.multi();
        if (Array.isArray(commands)) {
            pipeline$1.addBatch(commands);
        }
        const exec = pipeline$1.exec;
        pipeline$1.exec = function (callback) {
            // Wait for the cluster to be connected, since we need nodes information before continuing
            if (this.isCluster && !this.redis.slots.length) {
                return built$1.default(new Promise((resolve, reject) => {
                    this.redis.delayUntilReady((err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        this.exec(pipeline$1).then(resolve, reject);
                    });
                }), callback);
            }
            if (this._transactions > 0) {
                exec.call(pipeline$1);
            }
            // Returns directly when the pipeline
            // has been called multiple times (retries).
            if (this.nodeifiedPromise) {
                return exec.call(pipeline$1);
            }
            const promise = exec.call(pipeline$1);
            return built$1.default(promise.then(function (result) {
                const execResult = result[result.length - 1];
                if (typeof execResult === "undefined") {
                    throw new Error("Pipeline cannot be used to send any commands when the `exec()` has been called on it.");
                }
                if (execResult[0]) {
                    execResult[0].previousErrors = [];
                    for (let i = 0; i < result.length - 1; ++i) {
                        if (result[i][0]) {
                            execResult[0].previousErrors.push(result[i][0]);
                        }
                    }
                    throw execResult[0];
                }
                return utils.wrapMultiResult(execResult[1]);
            }), callback);
        };
        const { execBuffer } = pipeline$1;
        pipeline$1.execBuffer = function (callback) {
            if (this._transactions > 0) {
                execBuffer.call(pipeline$1);
            }
            return pipeline$1.exec(callback);
        };
        return pipeline$1;
    };
    const { exec } = redis;
    redis.exec = function (callback) {
        return built$1.default(exec.call(this).then(function (results) {
            if (Array.isArray(results)) {
                results = utils.wrapMultiResult(results);
            }
            return results;
        }), callback);
    };
}
var addTransactionSupport_1 = addTransactionSupport;

var transaction = /*#__PURE__*/Object.defineProperty({
	addTransactionSupport: addTransactionSupport_1
}, '__esModule', {value: true});

var DEFAULT_REDIS_OPTIONS = {
    // Connection
    port: 6379,
    host: "localhost",
    family: 4,
    connectTimeout: 10000,
    disconnectTimeout: 2000,
    retryStrategy: function (times) {
        return Math.min(times * 50, 2000);
    },
    keepAlive: 0,
    noDelay: true,
    connectionName: null,
    // Sentinel
    sentinels: null,
    name: null,
    role: "master",
    sentinelRetryStrategy: function (times) {
        return Math.min(times * 10, 1000);
    },
    sentinelReconnectStrategy: function () {
        // This strategy only applies when sentinels are used for detecting
        // a failover, not during initial master resolution.
        // The deployment can still function when some of the sentinels are down
        // for a long period of time, so we may not want to attempt reconnection
        // very often. Therefore the default interval is fairly long (1 minute).
        return 60000;
    },
    natMap: null,
    enableTLSForSentinelMode: false,
    updateSentinels: true,
    failoverDetector: false,
    // Status
    username: null,
    password: null,
    db: 0,
    // Others
    dropBufferSupport: false,
    enableOfflineQueue: true,
    enableReadyCheck: true,
    autoResubscribe: true,
    autoResendUnfulfilledCommands: true,
    lazyConnect: false,
    keyPrefix: "",
    reconnectOnError: null,
    readOnly: false,
    stringNumbers: false,
    maxRetriesPerRequest: 20,
    maxLoadingRetryTime: 10000,
    enableAutoPipelining: false,
    autoPipeliningIgnoredCommands: [],
    maxScriptsCachingTime: 60000,
    sentinelMaxConnections: 10,
};

var RedisOptions = /*#__PURE__*/Object.defineProperty({
	DEFAULT_REDIS_OPTIONS: DEFAULT_REDIS_OPTIONS
}, '__esModule', {value: true});

const debug$4 = utils.Debug("redis");
/**
 * Creates a Redis instance
 *
 * @constructor
 * @param {(number|string|Object)} [port=6379] - Port of the Redis server,
 * or a URL string(see the examples below),
 * or the `options` object(see the third argument).
 * @param {string|Object} [host=localhost] - Host of the Redis server,
 * when the first argument is a URL string,
 * this argument is an object represents the options.
 * @param {Object} [options] - Other options.
 * @param {number} [options.port=6379] - Port of the Redis server.
 * @param {string} [options.host=localhost] - Host of the Redis server.
 * @param {string} [options.family=4] - Version of IP stack. Defaults to 4.
 * @param {string} [options.path=null] - Local domain socket path. If set the `port`,
 * `host` and `family` will be ignored.
 * @param {number} [options.keepAlive=0] - TCP KeepAlive on the socket with a X ms delay before start.
 * Set to a non-number value to disable keepAlive.
 * @param {boolean} [options.noDelay=true] - Whether to disable the Nagle's Algorithm. By default we disable
 * it to reduce the latency.
 * @param {string} [options.connectionName=null] - Connection name.
 * @param {number} [options.db=0] - Database index to use.
 * @param {string} [options.password=null] - If set, client will send AUTH command
 * with the value of this option when connected.
 * @param {string} [options.username=null] - Similar to `password`, Provide this for Redis ACL support.
 * @param {boolean} [options.dropBufferSupport=false] - Drop the buffer support for better performance.
 * This option is recommended to be enabled when
 * handling large array response and you don't need the buffer support.
 * @param {boolean} [options.enableReadyCheck=true] - When a connection is established to
 * the Redis server, the server might still be loading the database from disk.
 * While loading, the server not respond to any commands.
 * To work around this, when this option is `true`,
 * ioredis will check the status of the Redis server,
 * and when the Redis server is able to process commands,
 * a `ready` event will be emitted.
 * @param {boolean} [options.enableOfflineQueue=true] - By default,
 * if there is no active connection to the Redis server,
 * commands are added to a queue and are executed once the connection is "ready"
 * (when `enableReadyCheck` is `true`,
 * "ready" means the Redis server has loaded the database from disk, otherwise means the connection
 * to the Redis server has been established). If this option is false,
 * when execute the command when the connection isn't ready, an error will be returned.
 * @param {number} [options.connectTimeout=10000] - The milliseconds before a timeout occurs during the initial
 * connection to the Redis server.
 * @param {boolean} [options.autoResubscribe=true] - After reconnected, if the previous connection was in the
 * subscriber mode, client will auto re-subscribe these channels.
 * @param {boolean} [options.autoResendUnfulfilledCommands=true] - If true, client will resend unfulfilled
 * commands(e.g. block commands) in the previous connection when reconnected.
 * @param {boolean} [options.lazyConnect=false] - By default,
 * When a new `Redis` instance is created, it will connect to Redis server automatically.
 * If you want to keep the instance disconnected until a command is called, you can pass the `lazyConnect` option to
 * the constructor:
 *
 * ```javascript
 * var redis = new Redis({ lazyConnect: true });
 * // No attempting to connect to the Redis server here.

 * // Now let's connect to the Redis server
 * redis.get('foo', function () {
 * });
 * ```
 * @param {Object} [options.tls] - TLS connection support. See https://github.com/luin/ioredis#tls-options
 * @param {string} [options.keyPrefix=''] - The prefix to prepend to all keys in a command.
 * @param {function} [options.retryStrategy] - See "Quick Start" section
 * @param {number} [options.maxRetriesPerRequest] - See "Quick Start" section
 * @param {number} [options.maxLoadingRetryTime=10000] - when redis server is not ready, we will wait for
 * `loading_eta_seconds` from `info` command or maxLoadingRetryTime (milliseconds), whichever is smaller.
 * @param {function} [options.reconnectOnError] - See "Quick Start" section
 * @param {boolean} [options.readOnly=false] - Enable READONLY mode for the connection.
 * Only available for cluster mode.
 * @param {boolean} [options.stringNumbers=false] - Force numbers to be always returned as JavaScript
 * strings. This option is necessary when dealing with big numbers (exceed the [-2^53, +2^53] range).
 * @param {boolean} [options.enableTLSForSentinelMode=false] - Whether to support the `tls` option
 * when connecting to Redis via sentinel mode.
 * @param {NatMap} [options.natMap=null] NAT map for sentinel connector.
 * @param {boolean} [options.updateSentinels=true] - Update the given `sentinels` list with new IP
 * addresses when communicating with existing sentinels.
 * @param {boolean} [options.failoverDetector=false] - Detect failover actively by subscribing to the
 * related channels. With this option disabled, ioredis is still able to detect failovers because Redis
 * Sentinel will disconnect all clients whenever a failover happens, so ioredis will reconnect to the new
 * master. This option is useful when you want to detect failover quicker, but it will create more TCP
 * connections to Redis servers in order to subscribe to related channels.
* @param {boolean} [options.enableAutoPipelining=false] - When enabled, all commands issued during an event loop
 * iteration are automatically wrapped in a pipeline and sent to the server at the same time.
 * This can dramatically improve performance.
 * @param {string[]} [options.autoPipeliningIgnoredCommands=[]] - The list of commands which must not be automatically wrapped in pipelines.
 * @param {number} [options.maxScriptsCachingTime=60000] Default script definition caching time.
  * @extends [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)
 * @extends Commander
 * @example
 * ```js
 * var Redis = require('ioredis');
 *
 * var redis = new Redis();
 *
 * var redisOnPort6380 = new Redis(6380);
 * var anotherRedis = new Redis(6380, '192.168.100.1');
 * var unixSocketRedis = new Redis({ path: '/tmp/echo.sock' });
 * var unixSocketRedis2 = new Redis('/tmp/echo.sock');
 * var urlRedis = new Redis('redis://user:password@redis-service.com:6379/');
 * var urlRedis2 = new Redis('//localhost:6379');
 * var urlRedisTls = new Redis('rediss://user:password@redis-service.com:6379/');
 * var authedRedis = new Redis(6380, '192.168.100.1', { password: 'password' });
 * ```
 */
var _default$5 = Redis;
function Redis() {
    if (!(this instanceof Redis)) {
        console.error(new Error("Calling `Redis()` like a function is deprecated. Using `new Redis()` instead.").stack.replace("Error", "Warning"));
        return new Redis(arguments[0], arguments[1], arguments[2]);
    }
    this.parseOptions(arguments[0], arguments[1], arguments[2]);
    events_1__default['default'].EventEmitter.call(this);
    commander.default.call(this);
    this.resetCommandQueue();
    this.resetOfflineQueue();
    this.connectionEpoch = 0;
    if (this.options.Connector) {
        this.connector = new this.options.Connector(this.options);
    }
    else if (this.options.sentinels) {
        const sentinelConnector = new connectors.SentinelConnector(this.options);
        sentinelConnector.emitter = this;
        this.connector = sentinelConnector;
    }
    else {
        this.connector = new connectors.StandaloneConnector(this.options);
    }
    this.retryAttempts = 0;
    // Prepare a cache of scripts and setup a interval which regularly clears it
    this._addedScriptHashes = {};
    // Prepare autopipelines structures
    this._autoPipelines = new Map();
    this._runningAutoPipelines = new Set();
    Object.defineProperty(this, "autoPipelineQueueSize", {
        get() {
            let queued = 0;
            for (const pipeline of this._autoPipelines.values()) {
                queued += pipeline.length;
            }
            return queued;
        },
    });
    // end(or wait) -> connecting -> connect -> ready -> end
    if (this.options.lazyConnect) {
        this.setStatus("wait");
    }
    else {
        this.connect().catch(lodash.noop);
    }
}
util__default['default'].inherits(Redis, events_1__default['default'].EventEmitter);
Object.assign(Redis.prototype, commander.default.prototype);
/**
 * Create a Redis instance
 *
 * @deprecated
 */
// @ts-ignore
Redis.createClient = function (...args) {
    // @ts-ignore
    return new Redis(...args);
};
/**
 * Default options
 *
 * @var defaultOptions
 * @private
 */
Redis.defaultOptions = RedisOptions.DEFAULT_REDIS_OPTIONS;
Redis.prototype.resetCommandQueue = function () {
    this.commandQueue = new denque();
};
Redis.prototype.resetOfflineQueue = function () {
    this.offlineQueue = new denque();
};
Redis.prototype.parseOptions = function () {
    this.options = {};
    let isTls = false;
    for (let i = 0; i < arguments.length; ++i) {
        const arg = arguments[i];
        if (arg === null || typeof arg === "undefined") {
            continue;
        }
        if (typeof arg === "object") {
            lodash.defaults(this.options, arg);
        }
        else if (typeof arg === "string") {
            lodash.defaults(this.options, utils.parseURL(arg));
            if (arg.startsWith("rediss://")) {
                isTls = true;
            }
        }
        else if (typeof arg === "number") {
            this.options.port = arg;
        }
        else {
            throw new Error("Invalid argument " + arg);
        }
    }
    if (isTls) {
        lodash.defaults(this.options, { tls: true });
    }
    lodash.defaults(this.options, Redis.defaultOptions);
    if (typeof this.options.port === "string") {
        this.options.port = parseInt(this.options.port, 10);
    }
    if (typeof this.options.db === "string") {
        this.options.db = parseInt(this.options.db, 10);
    }
    if (this.options.parser === "hiredis") {
        console.warn("Hiredis parser is abandoned since ioredis v3.0, and JavaScript parser will be used");
    }
};
/**
 * Change instance's status
 * @private
 */
Redis.prototype.setStatus = function (status, arg) {
    // @ts-ignore
    if (debug$4.enabled) {
        debug$4("status[%s]: %s -> %s", this._getDescription(), this.status || "[empty]", status);
    }
    this.status = status;
    process.nextTick(this.emit.bind(this, status, arg));
};
/**
 * Create a connection to Redis.
 * This method will be invoked automatically when creating a new Redis instance
 * unless `lazyConnect: true` is passed.
 *
 * When calling this method manually, a Promise is returned, which will
 * be resolved when the connection status is ready.
 * @param {function} [callback]
 * @return {Promise<void>}
 * @public
 */
Redis.prototype.connect = function (callback) {
    const _Promise = promiseContainer.get();
    const promise = new _Promise((resolve, reject) => {
        if (this.status === "connecting" ||
            this.status === "connect" ||
            this.status === "ready") {
            reject(new Error("Redis is already connecting/connected"));
            return;
        }
        // Make sure only one timer is active at a time
        clearInterval(this._addedScriptHashesCleanInterval);
        // Start the script cache cleaning
        this._addedScriptHashesCleanInterval = setInterval(() => {
            this._addedScriptHashes = {};
        }, this.options.maxScriptsCachingTime);
        this.connectionEpoch += 1;
        this.setStatus("connecting");
        const { options } = this;
        this.condition = {
            select: options.db,
            auth: options.username
                ? [options.username, options.password]
                : options.password,
            subscriber: false,
        };
        const _this = this;
        built$1.default(this.connector.connect(function (type, err) {
            _this.silentEmit(type, err);
        }), function (err, stream) {
            if (err) {
                _this.flushQueue(err);
                _this.silentEmit("error", err);
                reject(err);
                _this.setStatus("end");
                return;
            }
            let CONNECT_EVENT = options.tls ? "secureConnect" : "connect";
            if (options.sentinels && !options.enableTLSForSentinelMode) {
                CONNECT_EVENT = "connect";
            }
            _this.stream = stream;
            if (typeof options.keepAlive === "number") {
                stream.setKeepAlive(true, options.keepAlive);
            }
            if (stream.connecting) {
                stream.once(CONNECT_EVENT, event_handler.connectHandler(_this));
                if (options.connectTimeout) {
                    /*
                     * Typically, Socket#setTimeout(0) will clear the timer
                     * set before. However, in some platforms (Electron 3.x~4.x),
                     * the timer will not be cleared. So we introduce a variable here.
                     *
                     * See https://github.com/electron/electron/issues/14915
                     */
                    let connectTimeoutCleared = false;
                    stream.setTimeout(options.connectTimeout, function () {
                        if (connectTimeoutCleared) {
                            return;
                        }
                        stream.setTimeout(0);
                        stream.destroy();
                        const err = new Error("connect ETIMEDOUT");
                        // @ts-ignore
                        err.errorno = "ETIMEDOUT";
                        // @ts-ignore
                        err.code = "ETIMEDOUT";
                        // @ts-ignore
                        err.syscall = "connect";
                        event_handler.errorHandler(_this)(err);
                    });
                    stream.once(CONNECT_EVENT, function () {
                        connectTimeoutCleared = true;
                        stream.setTimeout(0);
                    });
                }
            }
            else if (stream.destroyed) {
                const firstError = _this.connector.firstError;
                if (firstError) {
                    process.nextTick(() => {
                        event_handler.errorHandler(_this)(firstError);
                    });
                }
                process.nextTick(event_handler.closeHandler(_this));
            }
            else {
                process.nextTick(event_handler.connectHandler(_this));
            }
            if (!stream.destroyed) {
                stream.once("error", event_handler.errorHandler(_this));
                stream.once("close", event_handler.closeHandler(_this));
            }
            if (options.noDelay) {
                stream.setNoDelay(true);
            }
            const connectionReadyHandler = function () {
                _this.removeListener("close", connectionCloseHandler);
                resolve();
            };
            var connectionCloseHandler = function () {
                _this.removeListener("ready", connectionReadyHandler);
                reject(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
            };
            _this.once("ready", connectionReadyHandler);
            _this.once("close", connectionCloseHandler);
        });
    });
    return built$1.default(promise, callback);
};
/**
 * Disconnect from Redis.
 *
 * This method closes the connection immediately,
 * and may lose some pending replies that haven't written to client.
 * If you want to wait for the pending replies, use Redis#quit instead.
 * @public
 */
Redis.prototype.disconnect = function (reconnect) {
    clearInterval(this._addedScriptHashesCleanInterval);
    this._addedScriptHashesCleanInterval = null;
    if (!reconnect) {
        this.manuallyClosing = true;
    }
    if (this.reconnectTimeout && !reconnect) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
    }
    if (this.status === "wait") {
        event_handler.closeHandler(this)();
    }
    else {
        this.connector.disconnect();
    }
};
/**
 * Disconnect from Redis.
 *
 * @deprecated
 */
Redis.prototype.end = function () {
    this.disconnect();
};
/**
 * Create a new instance with the same options as the current one.
 *
 * @example
 * ```js
 * var redis = new Redis(6380);
 * var anotherRedis = redis.duplicate();
 * ```
 *
 * @public
 */
Redis.prototype.duplicate = function (override) {
    return new Redis(Object.assign({}, this.options, override || {}));
};
Redis.prototype.recoverFromFatalError = function (commandError, err, options) {
    this.flushQueue(err, options);
    this.silentEmit("error", err);
    this.disconnect(true);
};
Redis.prototype.handleReconnection = function handleReconnection(err, item) {
    let needReconnect = false;
    if (this.options.reconnectOnError) {
        needReconnect = this.options.reconnectOnError(err);
    }
    switch (needReconnect) {
        case 1:
        case true:
            if (this.status !== "reconnecting") {
                this.disconnect(true);
            }
            item.command.reject(err);
            break;
        case 2:
            if (this.status !== "reconnecting") {
                this.disconnect(true);
            }
            if (this.condition.select !== item.select &&
                item.command.name !== "select") {
                this.select(item.select);
            }
            this.sendCommand(item.command);
            break;
        default:
            item.command.reject(err);
    }
};
/**
 * Flush offline queue and command queue with error.
 *
 * @param {Error} error - The error object to send to the commands
 * @param {object} options
 * @private
 */
Redis.prototype.flushQueue = function (error, options) {
    options = lodash.defaults({}, options, {
        offlineQueue: true,
        commandQueue: true,
    });
    let item;
    if (options.offlineQueue) {
        while (this.offlineQueue.length > 0) {
            item = this.offlineQueue.shift();
            item.command.reject(error);
        }
    }
    if (options.commandQueue) {
        if (this.commandQueue.length > 0) {
            if (this.stream) {
                this.stream.removeAllListeners("data");
            }
            while (this.commandQueue.length > 0) {
                item = this.commandQueue.shift();
                item.command.reject(error);
            }
        }
    }
};
/**
 * Check whether Redis has finished loading the persistent data and is able to
 * process commands.
 *
 * @param {Function} callback
 * @private
 */
Redis.prototype._readyCheck = function (callback) {
    const _this = this;
    this.info(function (err, res) {
        if (err) {
            return callback(err);
        }
        if (typeof res !== "string") {
            return callback(null, res);
        }
        const info = {};
        const lines = res.split("\r\n");
        for (let i = 0; i < lines.length; ++i) {
            const [fieldName, ...fieldValueParts] = lines[i].split(":");
            const fieldValue = fieldValueParts.join(":");
            if (fieldValue) {
                info[fieldName] = fieldValue;
            }
        }
        if (!info.loading || info.loading === "0") {
            callback(null, info);
        }
        else {
            const loadingEtaMs = (info.loading_eta_seconds || 1) * 1000;
            const retryTime = _this.options.maxLoadingRetryTime &&
                _this.options.maxLoadingRetryTime < loadingEtaMs
                ? _this.options.maxLoadingRetryTime
                : loadingEtaMs;
            debug$4("Redis server still loading, trying again in " + retryTime + "ms");
            setTimeout(function () {
                _this._readyCheck(callback);
            }, retryTime);
        }
    });
};
/**
 * Emit only when there's at least one listener.
 *
 * @param {string} eventName - Event to emit
 * @param {...*} arguments - Arguments
 * @return {boolean} Returns true if event had listeners, false otherwise.
 * @private
 */
Redis.prototype.silentEmit = function (eventName) {
    let error;
    if (eventName === "error") {
        error = arguments[1];
        if (this.status === "end") {
            return;
        }
        if (this.manuallyClosing) {
            // ignore connection related errors when manually disconnecting
            if (error instanceof Error &&
                (error.message === utils.CONNECTION_CLOSED_ERROR_MSG ||
                    // @ts-ignore
                    error.syscall === "connect" ||
                    // @ts-ignore
                    error.syscall === "read")) {
                return;
            }
        }
    }
    if (this.listeners(eventName).length > 0) {
        return this.emit.apply(this, arguments);
    }
    if (error && error instanceof Error) {
        console.error("[ioredis] Unhandled error event:", error.stack);
    }
    return false;
};
/**
 * Listen for all requests received by the server in real time.
 *
 * This command will create a new connection to Redis and send a
 * MONITOR command via the new connection in order to avoid disturbing
 * the current connection.
 *
 * @param {function} [callback] The callback function. If omit, a promise will be returned.
 * @example
 * ```js
 * var redis = new Redis();
 * redis.monitor(function (err, monitor) {
 *   // Entering monitoring mode.
 *   monitor.on('monitor', function (time, args, source, database) {
 *     console.log(time + ": " + util.inspect(args));
 *   });
 * });
 *
 * // supports promise as well as other commands
 * redis.monitor().then(function (monitor) {
 *   monitor.on('monitor', function (time, args, source, database) {
 *     console.log(time + ": " + util.inspect(args));
 *   });
 * });
 * ```
 * @public
 */
Redis.prototype.monitor = function (callback) {
    const monitorInstance = this.duplicate({
        monitor: true,
        lazyConnect: false,
    });
    const Promise = promiseContainer.get();
    return built$1.default(new Promise(function (resolve) {
        monitorInstance.once("monitoring", function () {
            resolve(monitorInstance);
        });
    }), callback);
};
transaction.addTransactionSupport(Redis.prototype);
/**
 * Send a command to Redis
 *
 * This method is used internally by the `Redis#set`, `Redis#lpush` etc.
 * Most of the time you won't invoke this method directly.
 * However when you want to send a command that is not supported by ioredis yet,
 * this command will be useful.
 *
 * @method sendCommand
 * @memberOf Redis#
 * @param {Command} command - The Command instance to send.
 * @see {@link Command}
 * @example
 * ```js
 * var redis = new Redis();
 *
 * // Use callback
 * var get = new Command('get', ['foo'], 'utf8', function (err, result) {
 *   console.log(result);
 * });
 * redis.sendCommand(get);
 *
 * // Use promise
 * var set = new Command('set', ['foo', 'bar'], 'utf8');
 * set.promise.then(function (result) {
 *   console.log(result);
 * });
 * redis.sendCommand(set);
 * ```
 * @private
 */
Redis.prototype.sendCommand = function (command$1, stream) {
    if (this.status === "wait") {
        this.connect().catch(lodash.noop);
    }
    if (this.status === "end") {
        command$1.reject(new Error(utils.CONNECTION_CLOSED_ERROR_MSG));
        return command$1.promise;
    }
    if (this.condition.subscriber &&
        !command.default.checkFlag("VALID_IN_SUBSCRIBER_MODE", command$1.name)) {
        command$1.reject(new Error("Connection in subscriber mode, only subscriber commands may be used"));
        return command$1.promise;
    }
    if (typeof this.options.commandTimeout === "number") {
        command$1.setTimeout(this.options.commandTimeout);
    }
    if (command$1.name === "quit") {
        clearInterval(this._addedScriptHashesCleanInterval);
        this._addedScriptHashesCleanInterval = null;
    }
    let writable = this.status === "ready" ||
        (!stream &&
            this.status === "connect" &&
            redisCommands.exists(command$1.name) &&
            redisCommands.hasFlag(command$1.name, "loading"));
    if (!this.stream) {
        writable = false;
    }
    else if (!this.stream.writable) {
        writable = false;
    }
    else if (this.stream._writableState && this.stream._writableState.ended) {
        // https://github.com/iojs/io.js/pull/1217
        writable = false;
    }
    if (!writable && !this.options.enableOfflineQueue) {
        command$1.reject(new Error("Stream isn't writeable and enableOfflineQueue options is false"));
        return command$1.promise;
    }
    if (!writable && command$1.name === "quit" && this.offlineQueue.length === 0) {
        this.disconnect();
        command$1.resolve(Buffer.from("OK"));
        return command$1.promise;
    }
    if (writable) {
        // @ts-ignore
        if (debug$4.enabled) {
            debug$4("write command[%s]: %d -> %s(%o)", this._getDescription(), this.condition.select, command$1.name, command$1.args);
        }
        (stream || this.stream).write(command$1.toWritable());
        this.commandQueue.push({
            command: command$1,
            stream: stream,
            select: this.condition.select,
        });
        if (command.default.checkFlag("WILL_DISCONNECT", command$1.name)) {
            this.manuallyClosing = true;
        }
    }
    else if (this.options.enableOfflineQueue) {
        // @ts-ignore
        if (debug$4.enabled) {
            debug$4("queue command[%s]: %d -> %s(%o)", this._getDescription(), this.condition.select, command$1.name, command$1.args);
        }
        this.offlineQueue.push({
            command: command$1,
            stream: stream,
            select: this.condition.select,
        });
    }
    if (command$1.name === "select" && utils.isInt(command$1.args[0])) {
        const db = parseInt(command$1.args[0], 10);
        if (this.condition.select !== db) {
            this.condition.select = db;
            this.emit("select", db);
            debug$4("switch to db [%d]", this.condition.select);
        }
    }
    return command$1.promise;
};
/**
 * Get description of the connection. Used for debugging.
 * @private
 */
Redis.prototype._getDescription = function () {
    let description;
    if (this.options.path) {
        description = this.options.path;
    }
    else if (this.stream &&
        this.stream.remoteAddress &&
        this.stream.remotePort) {
        description = this.stream.remoteAddress + ":" + this.stream.remotePort;
    }
    else {
        description = this.options.host + ":" + this.options.port;
    }
    if (this.options.connectionName) {
        description += ` (${this.options.connectionName})`;
    }
    return description;
};
[
    "scan",
    "sscan",
    "hscan",
    "zscan",
    "scanBuffer",
    "sscanBuffer",
    "hscanBuffer",
    "zscanBuffer",
].forEach(function (command) {
    Redis.prototype[command + "Stream"] = function (key, options) {
        if (command === "scan" || command === "scanBuffer") {
            options = key;
            key = null;
        }
        return new ScanStream_1.default(lodash.defaults({
            objectMode: true,
            key: key,
            redis: this,
            command: command,
        }, options));
    };
});

var redis = /*#__PURE__*/Object.defineProperty({
	default: _default$5
}, '__esModule', {value: true});

class ClusterAllFailedError extends redisErrors.RedisError {
    constructor(message, lastNodeError) {
        super(message);
        this.lastNodeError = lastNodeError;
        Error.captureStackTrace(this, this.constructor);
    }
    get name() {
        return this.constructor.name;
    }
}
var _default$4 = ClusterAllFailedError;

var ClusterAllFailedError_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$4
}, '__esModule', {value: true});

function getNodeKey(node) {
    node.port = node.port || 6379;
    node.host = node.host || "127.0.0.1";
    return node.host + ":" + node.port;
}
var getNodeKey_1 = getNodeKey;
function nodeKeyToRedisOptions(nodeKey) {
    const portIndex = nodeKey.lastIndexOf(":");
    if (portIndex === -1) {
        throw new Error(`Invalid node key ${nodeKey}`);
    }
    return {
        host: nodeKey.slice(0, portIndex),
        port: Number(nodeKey.slice(portIndex + 1)),
    };
}
var nodeKeyToRedisOptions_1 = nodeKeyToRedisOptions;
function normalizeNodeOptions(nodes) {
    return nodes.map((node) => {
        const options = {};
        if (typeof node === "object") {
            Object.assign(options, node);
        }
        else if (typeof node === "string") {
            Object.assign(options, utils.parseURL(node));
        }
        else if (typeof node === "number") {
            options.port = node;
        }
        else {
            throw new Error("Invalid argument " + node);
        }
        if (typeof options.port === "string") {
            options.port = parseInt(options.port, 10);
        }
        // Cluster mode only support db 0
        delete options.db;
        if (!options.port) {
            options.port = 6379;
        }
        if (!options.host) {
            options.host = "127.0.0.1";
        }
        return options;
    });
}
var normalizeNodeOptions_1 = normalizeNodeOptions;
function getUniqueHostnamesFromOptions(nodes) {
    const uniqueHostsMap = {};
    nodes.forEach((node) => {
        uniqueHostsMap[node.host] = true;
    });
    return Object.keys(uniqueHostsMap).filter((host) => !net_1__default['default'].isIP(host));
}
var getUniqueHostnamesFromOptions_1 = getUniqueHostnamesFromOptions;
function groupSrvRecords(records) {
    const recordsByPriority = {};
    for (const record of records) {
        if (!recordsByPriority.hasOwnProperty(record.priority)) {
            recordsByPriority[record.priority] = {
                totalWeight: record.weight,
                records: [record],
            };
        }
        else {
            recordsByPriority[record.priority].totalWeight += record.weight;
            recordsByPriority[record.priority].records.push(record);
        }
    }
    return recordsByPriority;
}
var groupSrvRecords_1 = groupSrvRecords;
function weightSrvRecords(recordsGroup) {
    if (recordsGroup.records.length === 1) {
        recordsGroup.totalWeight = 0;
        return recordsGroup.records.shift();
    }
    // + `recordsGroup.records.length` to support `weight` 0
    const random = Math.floor(Math.random() * (recordsGroup.totalWeight + recordsGroup.records.length));
    let total = 0;
    for (const [i, record] of recordsGroup.records.entries()) {
        total += 1 + record.weight;
        if (total > random) {
            recordsGroup.totalWeight -= record.weight;
            recordsGroup.records.splice(i, 1);
            return record;
        }
    }
}
var weightSrvRecords_1 = weightSrvRecords;
function getConnectionName(component, nodeConnectionName) {
    const prefix = `ioredis-cluster(${component})`;
    return nodeConnectionName ? `${prefix}:${nodeConnectionName}` : prefix;
}
var getConnectionName_1 = getConnectionName;

var util = /*#__PURE__*/Object.defineProperty({
	getNodeKey: getNodeKey_1,
	nodeKeyToRedisOptions: nodeKeyToRedisOptions_1,
	normalizeNodeOptions: normalizeNodeOptions_1,
	getUniqueHostnamesFromOptions: getUniqueHostnamesFromOptions_1,
	groupSrvRecords: groupSrvRecords_1,
	weightSrvRecords: weightSrvRecords_1,
	getConnectionName: getConnectionName_1
}, '__esModule', {value: true});

const debug$3 = utils.Debug("cluster:connectionPool");
class ConnectionPool extends events_1__default['default'].EventEmitter {
    constructor(redisOptions) {
        super();
        this.redisOptions = redisOptions;
        // master + slave = all
        this.nodes = {
            all: {},
            master: {},
            slave: {},
        };
        this.specifiedOptions = {};
    }
    getNodes(role = "all") {
        const nodes = this.nodes[role];
        return Object.keys(nodes).map((key) => nodes[key]);
    }
    getInstanceByKey(key) {
        return this.nodes.all[key];
    }
    getSampleInstance(role) {
        const keys = Object.keys(this.nodes[role]);
        const sampleKey = utils.sample(keys);
        return this.nodes[role][sampleKey];
    }
    /**
     * Find or create a connection to the node
     *
     * @param {IRedisOptions} node
     * @param {boolean} [readOnly=false]
     * @returns {*}
     * @memberof ConnectionPool
     */
    findOrCreate(node, readOnly = false) {
        const key = util.getNodeKey(node);
        readOnly = Boolean(readOnly);
        if (this.specifiedOptions[key]) {
            Object.assign(node, this.specifiedOptions[key]);
        }
        else {
            this.specifiedOptions[key] = node;
        }
        let redis$1;
        if (this.nodes.all[key]) {
            redis$1 = this.nodes.all[key];
            if (redis$1.options.readOnly !== readOnly) {
                redis$1.options.readOnly = readOnly;
                debug$3("Change role of %s to %s", key, readOnly ? "slave" : "master");
                redis$1[readOnly ? "readonly" : "readwrite"]().catch(utils.noop);
                if (readOnly) {
                    delete this.nodes.master[key];
                    this.nodes.slave[key] = redis$1;
                }
                else {
                    delete this.nodes.slave[key];
                    this.nodes.master[key] = redis$1;
                }
            }
        }
        else {
            debug$3("Connecting to %s as %s", key, readOnly ? "slave" : "master");
            redis$1 = new redis.default(utils.defaults({
                // Never try to reconnect when a node is lose,
                // instead, waiting for a `MOVED` error and
                // fetch the slots again.
                retryStrategy: null,
                // Offline queue should be enabled so that
                // we don't need to wait for the `ready` event
                // before sending commands to the node.
                enableOfflineQueue: true,
                readOnly: readOnly,
            }, node, this.redisOptions, { lazyConnect: true }));
            this.nodes.all[key] = redis$1;
            this.nodes[readOnly ? "slave" : "master"][key] = redis$1;
            redis$1.once("end", () => {
                this.removeNode(key);
                this.emit("-node", redis$1, key);
                if (!Object.keys(this.nodes.all).length) {
                    this.emit("drain");
                }
            });
            this.emit("+node", redis$1, key);
            redis$1.on("error", function (error) {
                this.emit("nodeError", error, key);
            });
        }
        return redis$1;
    }
    /**
     * Remove a node from the pool.
     */
    removeNode(key) {
        const { nodes } = this;
        if (nodes.all[key]) {
            debug$3("Remove %s from the pool", key);
            delete nodes.all[key];
        }
        delete nodes.master[key];
        delete nodes.slave[key];
    }
    /**
     * Reset the pool with a set of nodes.
     * The old node will be removed.
     *
     * @param {(Array<string | number | object>)} nodes
     * @memberof ConnectionPool
     */
    reset(nodes) {
        debug$3("Reset with %O", nodes);
        const newNodes = {};
        nodes.forEach((node) => {
            const key = util.getNodeKey(node);
            // Don't override the existing (master) node
            // when the current one is slave.
            if (!(node.readOnly && newNodes[key])) {
                newNodes[key] = node;
            }
        });
        Object.keys(this.nodes.all).forEach((key) => {
            if (!newNodes[key]) {
                debug$3("Disconnect %s because the node does not hold any slot", key);
                this.nodes.all[key].disconnect();
                this.removeNode(key);
            }
        });
        Object.keys(newNodes).forEach((key) => {
            const node = newNodes[key];
            this.findOrCreate(node, node.readOnly);
        });
    }
}
var _default$3 = ConnectionPool;

var ConnectionPool_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$3
}, '__esModule', {value: true});

const debug$2 = utils.Debug("cluster:subscriber");
class ClusterSubscriber {
    constructor(connectionPool, emitter) {
        this.connectionPool = connectionPool;
        this.emitter = emitter;
        this.started = false;
        this.subscriber = null;
        this.connectionPool.on("-node", (_, key) => {
            if (!this.started || !this.subscriber) {
                return;
            }
            if (util.getNodeKey(this.subscriber.options) === key) {
                debug$2("subscriber has left, selecting a new one...");
                this.selectSubscriber();
            }
        });
        this.connectionPool.on("+node", () => {
            if (!this.started || this.subscriber) {
                return;
            }
            debug$2("a new node is discovered and there is no subscriber, selecting a new one...");
            this.selectSubscriber();
        });
    }
    getInstance() {
        return this.subscriber;
    }
    selectSubscriber() {
        const lastActiveSubscriber = this.lastActiveSubscriber;
        // Disconnect the previous subscriber even if there
        // will not be a new one.
        if (lastActiveSubscriber) {
            lastActiveSubscriber.disconnect();
        }
        if (this.subscriber) {
            this.subscriber.disconnect();
        }
        const sampleNode = utils.sample(this.connectionPool.getNodes());
        if (!sampleNode) {
            debug$2("selecting subscriber failed since there is no node discovered in the cluster yet");
            this.subscriber = null;
            return;
        }
        const { options } = sampleNode;
        debug$2("selected a subscriber %s:%s", options.host, options.port);
        /*
         * Create a specialized Redis connection for the subscription.
         * Note that auto reconnection is enabled here.
         *
         * `enableReadyCheck` is also enabled because although subscription is allowed
         * while redis is loading data from the disk, we can check if the password
         * provided for the subscriber is correct, and if not, the current subscriber
         * will be disconnected and a new subscriber will be selected.
         */
        this.subscriber = new redis.default({
            port: options.port,
            host: options.host,
            username: options.username,
            password: options.password,
            enableReadyCheck: true,
            connectionName: util.getConnectionName("subscriber", options.connectionName),
            lazyConnect: true,
            tls: options.tls,
        });
        // Ignore the errors since they're handled in the connection pool.
        this.subscriber.on("error", utils.noop);
        // Re-subscribe previous channels
        const previousChannels = { subscribe: [], psubscribe: [] };
        if (lastActiveSubscriber) {
            const condition = lastActiveSubscriber.condition || lastActiveSubscriber.prevCondition;
            if (condition && condition.subscriber) {
                previousChannels.subscribe = condition.subscriber.channels("subscribe");
                previousChannels.psubscribe = condition.subscriber.channels("psubscribe");
            }
        }
        if (previousChannels.subscribe.length ||
            previousChannels.psubscribe.length) {
            let pending = 0;
            for (const type of ["subscribe", "psubscribe"]) {
                const channels = previousChannels[type];
                if (channels.length) {
                    pending += 1;
                    debug$2("%s %d channels", type, channels.length);
                    this.subscriber[type](channels)
                        .then(() => {
                        if (!--pending) {
                            this.lastActiveSubscriber = this.subscriber;
                        }
                    })
                        .catch(() => {
                        // TODO: should probably disconnect the subscriber and try again.
                        debug$2("failed to %s %d channels", type, channels.length);
                    });
                }
            }
        }
        else {
            this.lastActiveSubscriber = this.subscriber;
        }
        for (const event of ["message", "messageBuffer"]) {
            this.subscriber.on(event, (arg1, arg2) => {
                this.emitter.emit(event, arg1, arg2);
            });
        }
        for (const event of ["pmessage", "pmessageBuffer"]) {
            this.subscriber.on(event, (arg1, arg2, arg3) => {
                this.emitter.emit(event, arg1, arg2, arg3);
            });
        }
    }
    start() {
        this.started = true;
        this.selectSubscriber();
        debug$2("started");
    }
    stop() {
        this.started = false;
        if (this.subscriber) {
            this.subscriber.disconnect();
            this.subscriber = null;
        }
        debug$2("stopped");
    }
}
var _default$2 = ClusterSubscriber;

var ClusterSubscriber_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$2
}, '__esModule', {value: true});

const debug$1 = utils.Debug("delayqueue");
/**
 * Queue that runs items after specified duration
 *
 * @export
 * @class DelayQueue
 */
class DelayQueue {
    constructor() {
        this.queues = {};
        this.timeouts = {};
    }
    /**
     * Add a new item to the queue
     *
     * @param {string} bucket bucket name
     * @param {Function} item function that will run later
     * @param {IDelayQueueOptions} options
     * @memberof DelayQueue
     */
    push(bucket, item, options) {
        const callback = options.callback || process.nextTick;
        if (!this.queues[bucket]) {
            this.queues[bucket] = new denque();
        }
        const queue = this.queues[bucket];
        queue.push(item);
        if (!this.timeouts[bucket]) {
            this.timeouts[bucket] = setTimeout(() => {
                callback(() => {
                    this.timeouts[bucket] = null;
                    this.execute(bucket);
                });
            }, options.timeout);
        }
    }
    execute(bucket) {
        const queue = this.queues[bucket];
        if (!queue) {
            return;
        }
        const { length } = queue;
        if (!length) {
            return;
        }
        debug$1("send %d commands in %s queue", length, bucket);
        this.queues[bucket] = null;
        while (queue.length > 0) {
            queue.shift()();
        }
    }
}
var _default$1 = DelayQueue;

var DelayQueue_1 = /*#__PURE__*/Object.defineProperty({
	default: _default$1
}, '__esModule', {value: true});

var DEFAULT_CLUSTER_OPTIONS = {
    clusterRetryStrategy: (times) => Math.min(100 + times * 2, 2000),
    enableOfflineQueue: true,
    enableReadyCheck: true,
    scaleReads: "master",
    maxRedirections: 16,
    retryDelayOnMoved: 0,
    retryDelayOnFailover: 100,
    retryDelayOnClusterDown: 100,
    retryDelayOnTryAgain: 100,
    slotsRefreshTimeout: 1000,
    slotsRefreshInterval: 5000,
    useSRVRecords: false,
    resolveSrv: dns_1__default['default'].resolveSrv,
    dnsLookup: dns_1__default['default'].lookup,
    enableAutoPipelining: false,
    autoPipeliningIgnoredCommands: [],
    maxScriptsCachingTime: 60000,
};

var ClusterOptions = /*#__PURE__*/Object.defineProperty({
	DEFAULT_CLUSTER_OPTIONS: DEFAULT_CLUSTER_OPTIONS
}, '__esModule', {value: true});

const utils_2 = utils;





const debug = utils.Debug("cluster");
/**
 * Client for the official Redis Cluster
 *
 * @class Cluster
 * @extends {EventEmitter}
 */
class Cluster extends events_1__default['default'].EventEmitter {
    /**
     * Creates an instance of Cluster.
     *
     * @param {((string | number | object)[])} startupNodes
     * @param {IClusterOptions} [options={}]
     * @memberof Cluster
     */
    constructor(startupNodes, options = {}) {
        super();
        this.slots = [];
        this.retryAttempts = 0;
        this.delayQueue = new DelayQueue_1.default();
        this.offlineQueue = new denque();
        this.isRefreshing = false;
        this.isCluster = true;
        this._autoPipelines = new Map();
        this._groupsIds = {};
        this._groupsBySlot = Array(16384);
        this._runningAutoPipelines = new Set();
        this._readyDelayedCallbacks = [];
        this._addedScriptHashes = {};
        /**
         * Every time Cluster#connect() is called, this value will be
         * auto-incrementing. The purpose of this value is used for
         * discarding previous connect attampts when creating a new
         * connection.
         *
         * @private
         * @type {number}
         * @memberof Cluster
         */
        this.connectionEpoch = 0;
        commander.default.call(this);
        this.startupNodes = startupNodes;
        this.options = utils.defaults({}, options, ClusterOptions.DEFAULT_CLUSTER_OPTIONS, this.options);
        // validate options
        if (typeof this.options.scaleReads !== "function" &&
            ["all", "master", "slave"].indexOf(this.options.scaleReads) === -1) {
            throw new Error('Invalid option scaleReads "' +
                this.options.scaleReads +
                '". Expected "all", "master", "slave" or a custom function');
        }
        this.connectionPool = new ConnectionPool_1.default(this.options.redisOptions);
        this.connectionPool.on("-node", (redis, key) => {
            this.emit("-node", redis);
        });
        this.connectionPool.on("+node", (redis) => {
            this.emit("+node", redis);
        });
        this.connectionPool.on("drain", () => {
            this.setStatus("close");
        });
        this.connectionPool.on("nodeError", (error, key) => {
            this.emit("node error", error, key);
        });
        this.subscriber = new ClusterSubscriber_1.default(this.connectionPool, this);
        if (this.options.lazyConnect) {
            this.setStatus("wait");
        }
        else {
            this.connect().catch((err) => {
                debug("connecting failed: %s", err);
            });
        }
    }
    resetOfflineQueue() {
        this.offlineQueue = new denque();
    }
    clearNodesRefreshInterval() {
        if (this.slotsTimer) {
            clearTimeout(this.slotsTimer);
            this.slotsTimer = null;
        }
    }
    resetNodesRefreshInterval() {
        if (this.slotsTimer) {
            return;
        }
        const nextRound = () => {
            this.slotsTimer = setTimeout(() => {
                debug('refreshing slot caches... (triggered by "slotsRefreshInterval" option)');
                this.refreshSlotsCache(() => {
                    nextRound();
                });
            }, this.options.slotsRefreshInterval);
        };
        nextRound();
    }
    /**
     * Connect to a cluster
     *
     * @returns {Promise<void>}
     * @memberof Cluster
     */
    connect() {
        const Promise = promiseContainer.get();
        return new Promise((resolve, reject) => {
            if (this.status === "connecting" ||
                this.status === "connect" ||
                this.status === "ready") {
                reject(new Error("Redis is already connecting/connected"));
                return;
            }
            // Make sure only one timer is active at a time
            clearInterval(this._addedScriptHashesCleanInterval);
            // Start the script cache cleaning
            this._addedScriptHashesCleanInterval = setInterval(() => {
                this._addedScriptHashes = {};
            }, this.options.maxScriptsCachingTime);
            const epoch = ++this.connectionEpoch;
            this.setStatus("connecting");
            this.resolveStartupNodeHostnames()
                .then((nodes) => {
                if (this.connectionEpoch !== epoch) {
                    debug("discard connecting after resolving startup nodes because epoch not match: %d != %d", epoch, this.connectionEpoch);
                    reject(new redisErrors.RedisError("Connection is discarded because a new connection is made"));
                    return;
                }
                if (this.status !== "connecting") {
                    debug("discard connecting after resolving startup nodes because the status changed to %s", this.status);
                    reject(new redisErrors.RedisError("Connection is aborted"));
                    return;
                }
                this.connectionPool.reset(nodes);
                function readyHandler() {
                    this.setStatus("ready");
                    this.retryAttempts = 0;
                    this.executeOfflineCommands();
                    this.resetNodesRefreshInterval();
                    resolve();
                }
                let closeListener = undefined;
                const refreshListener = () => {
                    this.invokeReadyDelayedCallbacks(undefined);
                    this.removeListener("close", closeListener);
                    this.manuallyClosing = false;
                    this.setStatus("connect");
                    if (this.options.enableReadyCheck) {
                        this.readyCheck((err, fail) => {
                            if (err || fail) {
                                debug("Ready check failed (%s). Reconnecting...", err || fail);
                                if (this.status === "connect") {
                                    this.disconnect(true);
                                }
                            }
                            else {
                                readyHandler.call(this);
                            }
                        });
                    }
                    else {
                        readyHandler.call(this);
                    }
                };
                closeListener = function () {
                    const error = new Error("None of startup nodes is available");
                    this.removeListener("refresh", refreshListener);
                    this.invokeReadyDelayedCallbacks(error);
                    reject(error);
                };
                this.once("refresh", refreshListener);
                this.once("close", closeListener);
                this.once("close", this.handleCloseEvent.bind(this));
                this.refreshSlotsCache(function (err) {
                    if (err && err.message === "Failed to refresh slots cache.") {
                        redis.default.prototype.silentEmit.call(this, "error", err);
                        this.connectionPool.reset([]);
                    }
                }.bind(this));
                this.subscriber.start();
            })
                .catch((err) => {
                this.setStatus("close");
                this.handleCloseEvent(err);
                this.invokeReadyDelayedCallbacks(err);
                reject(err);
            });
        });
    }
    /**
     * Called when closed to check whether a reconnection should be made
     *
     * @private
     * @memberof Cluster
     */
    handleCloseEvent(reason) {
        if (reason) {
            debug("closed because %s", reason);
        }
        let retryDelay;
        if (!this.manuallyClosing &&
            typeof this.options.clusterRetryStrategy === "function") {
            retryDelay = this.options.clusterRetryStrategy.call(this, ++this.retryAttempts, reason);
        }
        if (typeof retryDelay === "number") {
            this.setStatus("reconnecting");
            this.reconnectTimeout = setTimeout(function () {
                this.reconnectTimeout = null;
                debug("Cluster is disconnected. Retrying after %dms", retryDelay);
                this.connect().catch(function (err) {
                    debug("Got error %s when reconnecting. Ignoring...", err);
                });
            }.bind(this), retryDelay);
        }
        else {
            this.setStatus("end");
            this.flushQueue(new Error("None of startup nodes is available"));
        }
    }
    /**
     * Disconnect from every node in the cluster.
     *
     * @param {boolean} [reconnect=false]
     * @memberof Cluster
     */
    disconnect(reconnect = false) {
        const status = this.status;
        this.setStatus("disconnecting");
        clearInterval(this._addedScriptHashesCleanInterval);
        this._addedScriptHashesCleanInterval = null;
        if (!reconnect) {
            this.manuallyClosing = true;
        }
        if (this.reconnectTimeout && !reconnect) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
            debug("Canceled reconnecting attempts");
        }
        this.clearNodesRefreshInterval();
        this.subscriber.stop();
        if (status === "wait") {
            this.setStatus("close");
            this.handleCloseEvent();
        }
        else {
            this.connectionPool.reset([]);
        }
    }
    /**
     * Quit the cluster gracefully.
     *
     * @param {CallbackFunction<'OK'>} [callback]
     * @returns {Promise<'OK'>}
     * @memberof Cluster
     */
    quit(callback) {
        const status = this.status;
        this.setStatus("disconnecting");
        clearInterval(this._addedScriptHashesCleanInterval);
        this._addedScriptHashesCleanInterval = null;
        this.manuallyClosing = true;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        this.clearNodesRefreshInterval();
        this.subscriber.stop();
        const Promise = promiseContainer.get();
        if (status === "wait") {
            const ret = built$1.default(Promise.resolve("OK"), callback);
            // use setImmediate to make sure "close" event
            // being emitted after quit() is returned
            setImmediate(function () {
                this.setStatus("close");
                this.handleCloseEvent();
            }.bind(this));
            return ret;
        }
        return built$1.default(Promise.all(this.nodes().map((node) => node.quit().catch((err) => {
            // Ignore the error caused by disconnecting since
            // we're disconnecting...
            if (err.message === utils_2.CONNECTION_CLOSED_ERROR_MSG) {
                return "OK";
            }
            throw err;
        }))).then(() => "OK"), callback);
    }
    /**
     * Create a new instance with the same startup nodes and options as the current one.
     *
     * @example
     * ```js
     * var cluster = new Redis.Cluster([{ host: "127.0.0.1", port: "30001" }]);
     * var anotherCluster = cluster.duplicate();
     * ```
     *
     * @public
     * @param {((string | number | object)[])} [overrideStartupNodes=[]]
     * @param {IClusterOptions} [overrideOptions={}]
     * @memberof Cluster
     */
    duplicate(overrideStartupNodes = [], overrideOptions = {}) {
        const startupNodes = overrideStartupNodes.length > 0
            ? overrideStartupNodes
            : this.startupNodes.slice(0);
        const options = Object.assign({}, this.options, overrideOptions);
        return new Cluster(startupNodes, options);
    }
    /**
     * Get nodes with the specified role
     *
     * @param {NodeRole} [role='all']
     * @returns {any[]}
     * @memberof Cluster
     */
    nodes(role = "all") {
        if (role !== "all" && role !== "master" && role !== "slave") {
            throw new Error('Invalid role "' + role + '". Expected "all", "master" or "slave"');
        }
        return this.connectionPool.getNodes(role);
    }
    // This is needed in order not to install a listener for each auto pipeline
    delayUntilReady(callback) {
        this._readyDelayedCallbacks.push(callback);
    }
    /**
     * Get the number of commands queued in automatic pipelines.
     *
     * This is not available (and returns 0) until the cluster is connected and slots information have been received.
     */
    get autoPipelineQueueSize() {
        let queued = 0;
        for (const pipeline of this._autoPipelines.values()) {
            queued += pipeline.length;
        }
        return queued;
    }
    /**
     * Change cluster instance's status
     *
     * @private
     * @param {ClusterStatus} status
     * @memberof Cluster
     */
    setStatus(status) {
        debug("status: %s -> %s", this.status || "[empty]", status);
        this.status = status;
        process.nextTick(() => {
            this.emit(status);
        });
    }
    /**
     * Refresh the slot cache
     *
     * @private
     * @param {CallbackFunction} [callback]
     * @memberof Cluster
     */
    refreshSlotsCache(callback) {
        if (this.isRefreshing) {
            if (typeof callback === "function") {
                process.nextTick(callback);
            }
            return;
        }
        this.isRefreshing = true;
        const _this = this;
        const wrapper = function (error) {
            _this.isRefreshing = false;
            if (typeof callback === "function") {
                callback(error);
            }
        };
        const nodes = utils_2.shuffle(this.connectionPool.getNodes());
        let lastNodeError = null;
        function tryNode(index) {
            if (index === nodes.length) {
                const error = new ClusterAllFailedError_1.default("Failed to refresh slots cache.", lastNodeError);
                return wrapper(error);
            }
            const node = nodes[index];
            const key = `${node.options.host}:${node.options.port}`;
            debug("getting slot cache from %s", key);
            _this.getInfoFromNode(node, function (err) {
                switch (_this.status) {
                    case "close":
                    case "end":
                        return wrapper(new Error("Cluster is disconnected."));
                    case "disconnecting":
                        return wrapper(new Error("Cluster is disconnecting."));
                }
                if (err) {
                    _this.emit("node error", err, key);
                    lastNodeError = err;
                    tryNode(index + 1);
                }
                else {
                    _this.emit("refresh");
                    wrapper();
                }
            });
        }
        tryNode(0);
    }
    /**
     * Flush offline queue with error.
     *
     * @param {Error} error
     * @memberof Cluster
     */
    flushQueue(error) {
        let item;
        while (this.offlineQueue.length > 0) {
            item = this.offlineQueue.shift();
            item.command.reject(error);
        }
    }
    executeOfflineCommands() {
        if (this.offlineQueue.length) {
            debug("send %d commands in offline queue", this.offlineQueue.length);
            const offlineQueue = this.offlineQueue;
            this.resetOfflineQueue();
            while (offlineQueue.length > 0) {
                const item = offlineQueue.shift();
                this.sendCommand(item.command, item.stream, item.node);
            }
        }
    }
    natMapper(nodeKey) {
        if (this.options.natMap && typeof this.options.natMap === "object") {
            const key = typeof nodeKey === "string"
                ? nodeKey
                : `${nodeKey.host}:${nodeKey.port}`;
            const mapped = this.options.natMap[key];
            if (mapped) {
                debug("NAT mapping %s -> %O", key, mapped);
                return Object.assign({}, mapped);
            }
        }
        return typeof nodeKey === "string"
            ? util.nodeKeyToRedisOptions(nodeKey)
            : nodeKey;
    }
    sendCommand(command$1, stream, node) {
        if (this.status === "wait") {
            this.connect().catch(utils.noop);
        }
        if (this.status === "end") {
            command$1.reject(new Error(utils_2.CONNECTION_CLOSED_ERROR_MSG));
            return command$1.promise;
        }
        let to = this.options.scaleReads;
        if (to !== "master") {
            const isCommandReadOnly = command$1.isReadOnly ||
                (redisCommands.exists(command$1.name) &&
                    redisCommands.hasFlag(command$1.name, "readonly"));
            if (!isCommandReadOnly) {
                to = "master";
            }
        }
        let targetSlot = node ? node.slot : command$1.getSlot();
        const ttl = {};
        const _this = this;
        if (!node && !command$1.__is_reject_overwritten) {
            // eslint-disable-next-line @typescript-eslint/camelcase
            command$1.__is_reject_overwritten = true;
            const reject = command$1.reject;
            command$1.reject = function (err) {
                const partialTry = tryConnection.bind(null, true);
                _this.handleError(err, ttl, {
                    moved: function (slot, key) {
                        debug("command %s is moved to %s", command$1.name, key);
                        targetSlot = Number(slot);
                        if (_this.slots[slot]) {
                            _this.slots[slot][0] = key;
                        }
                        else {
                            _this.slots[slot] = [key];
                        }
                        _this._groupsBySlot[slot] = _this._groupsIds[_this.slots[slot].join(';')];
                        _this.connectionPool.findOrCreate(_this.natMapper(key));
                        tryConnection();
                        debug("refreshing slot caches... (triggered by MOVED error)");
                        _this.refreshSlotsCache();
                    },
                    ask: function (slot, key) {
                        debug("command %s is required to ask %s:%s", command$1.name, key);
                        const mapped = _this.natMapper(key);
                        _this.connectionPool.findOrCreate(mapped);
                        tryConnection(false, `${mapped.host}:${mapped.port}`);
                    },
                    tryagain: partialTry,
                    clusterDown: partialTry,
                    connectionClosed: partialTry,
                    maxRedirections: function (redirectionError) {
                        reject.call(command$1, redirectionError);
                    },
                    defaults: function () {
                        reject.call(command$1, err);
                    },
                });
            };
        }
        tryConnection();
        function tryConnection(random, asking) {
            if (_this.status === "end") {
                command$1.reject(new redisErrors.AbortError("Cluster is ended."));
                return;
            }
            let redis;
            if (_this.status === "ready" || command$1.name === "cluster") {
                if (node && node.redis) {
                    redis = node.redis;
                }
                else if (command.default.checkFlag("ENTER_SUBSCRIBER_MODE", command$1.name) ||
                    command.default.checkFlag("EXIT_SUBSCRIBER_MODE", command$1.name)) {
                    redis = _this.subscriber.getInstance();
                    if (!redis) {
                        command$1.reject(new redisErrors.AbortError("No subscriber for the cluster"));
                        return;
                    }
                }
                else {
                    if (!random) {
                        if (typeof targetSlot === "number" && _this.slots[targetSlot]) {
                            const nodeKeys = _this.slots[targetSlot];
                            if (typeof to === "function") {
                                const nodes = nodeKeys.map(function (key) {
                                    return _this.connectionPool.getInstanceByKey(key);
                                });
                                redis = to(nodes, command$1);
                                if (Array.isArray(redis)) {
                                    redis = utils_2.sample(redis);
                                }
                                if (!redis) {
                                    redis = nodes[0];
                                }
                            }
                            else {
                                let key;
                                if (to === "all") {
                                    key = utils_2.sample(nodeKeys);
                                }
                                else if (to === "slave" && nodeKeys.length > 1) {
                                    key = utils_2.sample(nodeKeys, 1);
                                }
                                else {
                                    key = nodeKeys[0];
                                }
                                redis = _this.connectionPool.getInstanceByKey(key);
                            }
                        }
                        if (asking) {
                            redis = _this.connectionPool.getInstanceByKey(asking);
                            redis.asking();
                        }
                    }
                    if (!redis) {
                        redis =
                            (typeof to === "function"
                                ? null
                                : _this.connectionPool.getSampleInstance(to)) ||
                                _this.connectionPool.getSampleInstance("all");
                    }
                }
                if (node && !node.redis) {
                    node.redis = redis;
                }
            }
            if (redis) {
                redis.sendCommand(command$1, stream);
            }
            else if (_this.options.enableOfflineQueue) {
                _this.offlineQueue.push({
                    command: command$1,
                    stream: stream,
                    node: node,
                });
            }
            else {
                command$1.reject(new Error("Cluster isn't ready and enableOfflineQueue options is false"));
            }
        }
        return command$1.promise;
    }
    handleError(error, ttl, handlers) {
        if (typeof ttl.value === "undefined") {
            ttl.value = this.options.maxRedirections;
        }
        else {
            ttl.value -= 1;
        }
        if (ttl.value <= 0) {
            handlers.maxRedirections(new Error("Too many Cluster redirections. Last error: " + error));
            return;
        }
        const errv = error.message.split(" ");
        if (errv[0] === "MOVED") {
            const timeout = this.options.retryDelayOnMoved;
            if (timeout && typeof timeout === "number") {
                this.delayQueue.push("moved", handlers.moved.bind(null, errv[1], errv[2]), { timeout });
            }
            else {
                handlers.moved(errv[1], errv[2]);
            }
        }
        else if (errv[0] === "ASK") {
            handlers.ask(errv[1], errv[2]);
        }
        else if (errv[0] === "TRYAGAIN") {
            this.delayQueue.push("tryagain", handlers.tryagain, {
                timeout: this.options.retryDelayOnTryAgain,
            });
        }
        else if (errv[0] === "CLUSTERDOWN" &&
            this.options.retryDelayOnClusterDown > 0) {
            this.delayQueue.push("clusterdown", handlers.connectionClosed, {
                timeout: this.options.retryDelayOnClusterDown,
                callback: this.refreshSlotsCache.bind(this),
            });
        }
        else if (error.message === utils_2.CONNECTION_CLOSED_ERROR_MSG &&
            this.options.retryDelayOnFailover > 0 &&
            this.status === "ready") {
            this.delayQueue.push("failover", handlers.connectionClosed, {
                timeout: this.options.retryDelayOnFailover,
                callback: this.refreshSlotsCache.bind(this),
            });
        }
        else {
            handlers.defaults();
        }
    }
    getInfoFromNode(redis, callback) {
        if (!redis) {
            return callback(new Error("Node is disconnected"));
        }
        // Use a duplication of the connection to avoid
        // timeouts when the connection is in the blocking
        // mode (e.g. waiting for BLPOP).
        const duplicatedConnection = redis.duplicate({
            enableOfflineQueue: true,
            enableReadyCheck: false,
            retryStrategy: null,
            connectionName: util.getConnectionName("refresher", this.options.redisOptions && this.options.redisOptions.connectionName),
        });
        // Ignore error events since we will handle
        // exceptions for the CLUSTER SLOTS command.
        duplicatedConnection.on("error", utils.noop);
        duplicatedConnection.cluster("slots", utils_2.timeout((err, result) => {
            duplicatedConnection.disconnect();
            if (err) {
                return callback(err);
            }
            if (this.status === "disconnecting" ||
                this.status === "close" ||
                this.status === "end") {
                debug("ignore CLUSTER.SLOTS results (count: %d) since cluster status is %s", result.length, this.status);
                callback();
                return;
            }
            const nodes = [];
            debug("cluster slots result count: %d", result.length);
            for (let i = 0; i < result.length; ++i) {
                const items = result[i];
                const slotRangeStart = items[0];
                const slotRangeEnd = items[1];
                const keys = [];
                for (let j = 2; j < items.length; j++) {
                    if (!items[j][0]) {
                        continue;
                    }
                    items[j] = this.natMapper({ host: items[j][0], port: items[j][1] });
                    items[j].readOnly = j !== 2;
                    nodes.push(items[j]);
                    keys.push(items[j].host + ":" + items[j].port);
                }
                debug("cluster slots result [%d]: slots %d~%d served by %s", i, slotRangeStart, slotRangeEnd, keys);
                for (let slot = slotRangeStart; slot <= slotRangeEnd; slot++) {
                    this.slots[slot] = keys;
                }
            }
            // Assign to each node keys a numeric value to make autopipeline comparison faster.
            this._groupsIds = Object.create(null);
            let j = 0;
            for (let i = 0; i < 16384; i++) {
                const target = (this.slots[i] || []).join(';');
                if (!target.length) {
                    this._groupsBySlot[i] = undefined;
                    continue;
                }
                if (!this._groupsIds[target]) {
                    this._groupsIds[target] = ++j;
                }
                this._groupsBySlot[i] = this._groupsIds[target];
            }
            this.connectionPool.reset(nodes);
            callback();
        }, this.options.slotsRefreshTimeout));
    }
    invokeReadyDelayedCallbacks(err) {
        for (const c of this._readyDelayedCallbacks) {
            process.nextTick(c, err);
        }
        this._readyDelayedCallbacks = [];
    }
    /**
     * Check whether Cluster is able to process commands
     *
     * @param {Function} callback
     * @private
     */
    readyCheck(callback) {
        this.cluster("info", function (err, res) {
            if (err) {
                return callback(err);
            }
            if (typeof res !== "string") {
                return callback();
            }
            let state;
            const lines = res.split("\r\n");
            for (let i = 0; i < lines.length; ++i) {
                const parts = lines[i].split(":");
                if (parts[0] === "cluster_state") {
                    state = parts[1];
                    break;
                }
            }
            if (state === "fail") {
                debug("cluster state not ok (%s)", state);
                callback(null, state);
            }
            else {
                callback();
            }
        });
    }
    resolveSrv(hostname) {
        return new Promise((resolve, reject) => {
            this.options.resolveSrv(hostname, (err, records) => {
                if (err) {
                    return reject(err);
                }
                const self = this, groupedRecords = util.groupSrvRecords(records), sortedKeys = Object.keys(groupedRecords).sort((a, b) => parseInt(a) - parseInt(b));
                function tryFirstOne(err) {
                    if (!sortedKeys.length) {
                        return reject(err);
                    }
                    const key = sortedKeys[0], group = groupedRecords[key], record = util.weightSrvRecords(group);
                    if (!group.records.length) {
                        sortedKeys.shift();
                    }
                    self.dnsLookup(record.name).then((host) => resolve({
                        host,
                        port: record.port,
                    }), tryFirstOne);
                }
                tryFirstOne();
            });
        });
    }
    dnsLookup(hostname) {
        return new Promise((resolve, reject) => {
            this.options.dnsLookup(hostname, (err, address) => {
                if (err) {
                    debug("failed to resolve hostname %s to IP: %s", hostname, err.message);
                    reject(err);
                }
                else {
                    debug("resolved hostname %s to IP %s", hostname, address);
                    resolve(address);
                }
            });
        });
    }
    /**
     * Normalize startup nodes, and resolving hostnames to IPs.
     *
     * This process happens every time when #connect() is called since
     * #startupNodes and DNS records may chanage.
     *
     * @private
     * @returns {Promise<IRedisOptions[]>}
     */
    resolveStartupNodeHostnames() {
        if (!Array.isArray(this.startupNodes) || this.startupNodes.length === 0) {
            return Promise.reject(new Error("`startupNodes` should contain at least one node."));
        }
        const startupNodes = util.normalizeNodeOptions(this.startupNodes);
        const hostnames = util.getUniqueHostnamesFromOptions(startupNodes);
        if (hostnames.length === 0) {
            return Promise.resolve(startupNodes);
        }
        return Promise.all(hostnames.map((this.options.useSRVRecords ? this.resolveSrv : this.dnsLookup).bind(this))).then((configs) => {
            const hostnameToConfig = utils_2.zipMap(hostnames, configs);
            return startupNodes.map((node) => {
                const config = hostnameToConfig.get(node.host);
                if (!config) {
                    return node;
                }
                else if (this.options.useSRVRecords) {
                    return Object.assign({}, node, config);
                }
                else {
                    return Object.assign({}, node, { host: config });
                }
            });
        });
    }
}
Object.getOwnPropertyNames(commander.default.prototype).forEach((name) => {
    if (!Cluster.prototype.hasOwnProperty(name)) {
        Cluster.prototype[name] = commander.default.prototype[name];
    }
});
const scanCommands = [
    "sscan",
    "hscan",
    "zscan",
    "sscanBuffer",
    "hscanBuffer",
    "zscanBuffer",
];
scanCommands.forEach((command) => {
    Cluster.prototype[command + "Stream"] = function (key, options) {
        return new ScanStream_1.default(utils.defaults({
            objectMode: true,
            key: key,
            redis: this,
            command: command,
        }, options));
    };
});
transaction.addTransactionSupport(Cluster.prototype);
var _default = Cluster;

var cluster = /*#__PURE__*/Object.defineProperty({
	default: _default
}, '__esModule', {value: true});

var built = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports = module.exports = redis.default;

exports.default = redis.default;

exports.Cluster = cluster.default;

exports.Command = command.default;

exports.ScanStream = ScanStream_1.default;

exports.Pipeline = pipeline.default;

exports.AbstractConnector = AbstractConnector_1.default;

exports.SentinelConnector = SentinelConnector_1.default;
exports.SentinelIterator = SentinelConnector_1.SentinelIterator;
// No TS typings
exports.ReplyError = redisErrors.ReplyError;

Object.defineProperty(exports, "Promise", {
    get() {
        return promiseContainer.get();
    },
    set(lib) {
        promiseContainer.set(lib);
    },
});
function print(err, reply) {
    if (err) {
        console.log("Error: " + err);
    }
    else {
        console.log("Reply: " + reply);
    }
}
exports.print = print;
});

var ioredis = /*@__PURE__*/getDefaultExportFromCjs(built);

/**
 * Checks if the target string ends with the sub string.
 */
/**
 * Validates if a value is an object with the Object prototype (map object).
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object' && obj.constructor === Object;
}
/**
 * Checks if a given value is a string.
 */
function isString(val) {
    return typeof val === 'string' || val instanceof String;
}
/**
 * Deep copy version of Object.assign using recursion.
 * There are some assumptions here. It's for internal use and we don't need verbose errors
 * or to ensure the data types or whatever. Parameters should always be correct (at least have a target and a source, of type object).
 */
function merge(target, source, ...rest) {
    let res = target;
    isObject(source) && Object.keys(source).forEach(key => {
        let val = source[key];
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
        const nextSource = rest.splice(0, 1)[0];
        res = merge(res, nextSource, ...rest);
    }
    return res;
}

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
class SetPoly {
    __setData__ = [];
    // unlike ES6 `Set`, it only accepts an array as first argument iterable
    constructor(values) {
        if (Array.isArray(values))
            values.forEach(value => { this.add(value); });
    }
    clear() {
        if (!this.__setData__.length)
            return;
        this.__setData__.length = 0;
    }
    add(value) {
        if (this.has(value))
            return this;
        this.__setData__.push(value);
        return this;
    }
    delete(value) {
        let index = this.__setData__.indexOf(value);
        if (index === -1)
            return false;
        this.__setData__.splice(index, 1);
        return true;
    }
    has(value) {
        return this.__setData__.indexOf(value) !== -1;
    }
    forEach(callbackfn, thisArg) {
        if (typeof callbackfn !== 'function')
            throw new TypeError(callbackfn + ' is not a function');
        for (let i = 0; i < this.__setData__.length; i++) {
            const value = this.__setData__[i];
            callbackfn.call(thisArg, value, value, this);
        }
    }
    get size() {
        return this.__setData__.length;
    }
}
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
const _Set = __getSetConstructor();

// returns true if the given value is a thenable object
var thenable = (o) => o !== undefined && o !== null && typeof o.then === 'function';

function timeout(ms, promise) {
    if (ms < 1)
        return promise;
    return new Promise((resolve, reject) => {
        const tid = setTimeout(() => {
            reject(new Error(`Operation timed out because it exceeded the configured time limit of ${ms}ms.`));
        }, ms);
        promise.then((res) => {
            clearTimeout(tid);
            resolve(res);
        }, (err) => {
            clearTimeout(tid);
            reject(err);
        });
    });
}

const LOG_PREFIX = 'storage:redis-adapter: ';
// If we ever decide to fully wrap every method, there's a Commander.getBuiltinCommands from ioredis.
const METHODS_TO_PROMISE_WRAP = ['set', 'exec', 'del', 'get', 'keys', 'sadd', 'srem', 'sismember', 'smembers', 'incr', 'rpush', 'pipeline', 'expire', 'mget', 'lrange', 'ltrim'];
// Not part of the settings since it'll vary on each storage. We should be removing storage specific logic from elsewhere.
const DEFAULT_OPTIONS = {
    connectionTimeout: 10000,
    operationTimeout: 5000
};
// Library specifics.
const DEFAULT_LIBRARY_OPTIONS = {
    enableOfflineQueue: false,
    connectTimeout: DEFAULT_OPTIONS.connectionTimeout,
    lazyConnect: false
};
/**
 * Redis adapter on top of the library of choice (written with ioredis) for some extra control.
 */
class RedisAdapter extends ioredis {
    log;
    _options;
    _notReadyCommandsQueue;
    _runningCommands;
    constructor(log, storageSettings) {
        const options = RedisAdapter._defineOptions(storageSettings);
        // Call the ioredis constructor
        super(...RedisAdapter._defineLibrarySettings(options));
        this.log = log;
        this._options = options;
        this._notReadyCommandsQueue = [];
        this._runningCommands = new _Set();
        this._listenToEvents();
        this._setTimeoutWrappers();
        this._setDisconnectWrapper();
        this.id = (Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)).substring(0, 5);
        console.log(`>>>> - ${this.id}`);
    }
    _listenToEvents() {
        this.once('ready', () => {
            const commandsCount = this._notReadyCommandsQueue ? this._notReadyCommandsQueue.length : 0;
            // this.log.info(LOG_PREFIX + `Redis connection established. Queued commands: ${commandsCount}.`);
            this._notReadyCommandsQueue && this._notReadyCommandsQueue.forEach(queued => {
                // this.log.info(LOG_PREFIX + `Executing queued ${queued.name} command.`);
                queued.command().then(queued.resolve).catch(queued.reject);
            });
            // After the SDK is ready for the first time we'll stop queueing commands. This is just so we can keep handling BUR for them.
            this._notReadyCommandsQueue = undefined;
        });
        this.once('close', () => {
            // this.log.info(LOG_PREFIX + 'Redis connection closed.');
        });
    }
    _setTimeoutWrappers() {
        const instance = this;
        METHODS_TO_PROMISE_WRAP.forEach(method => {
            const originalMethod = instance[method];
            instance[method] = function () {
                const params = arguments;
                function commandWrapper() {
                    instance.log.debug(LOG_PREFIX + `Executing ${method}.`);
                    // Return original method
                    const result = originalMethod.apply(instance, params);
                    if (thenable(result)) {
                        // For handling pending commands on disconnect, add to the set and remove once finished.
                        // On sync commands there's no need, only thenables.
                        instance._runningCommands.add(result);
                        const cleanUpRunningCommandsCb = function () {
                            instance._runningCommands.delete(result);
                        };
                        // Both success and error remove from queue.
                        result.then(cleanUpRunningCommandsCb, cleanUpRunningCommandsCb);
                        return timeout(instance._options.operationTimeout, result).catch(err => {
                            instance.log.error(LOG_PREFIX + `${method} operation threw an error or exceeded configured timeout of ${instance._options.operationTimeout}ms. Message: ${err}`);
                            // Handling is not the adapter responsibility.
                            throw err;
                        });
                    }
                    return result;
                }
                if (instance._notReadyCommandsQueue) {
                    return new Promise((res, rej) => {
                        instance._notReadyCommandsQueue.unshift({
                            resolve: res,
                            reject: rej,
                            command: commandWrapper,
                            name: method.toUpperCase()
                        });
                    });
                }
                else {
                    return commandWrapper();
                }
            };
        });
    }
    _setDisconnectWrapper() {
        const instance = this;
        const originalMethod = instance.disconnect;
        instance.disconnect = function disconnect(...params) {
            setTimeout(function deferedDisconnect() {
                if (instance._runningCommands.size > 0) {
                    instance.log.info(LOG_PREFIX + `Attempting to disconnect but there are ${instance._runningCommands.size} commands still waiting for resolution. Defering disconnection until those finish.`);
                    Promise.all(setToArray(instance._runningCommands))
                        .then(() => {
                        instance.log.debug(LOG_PREFIX + 'Pending commands finished successfully, disconnecting.');
                        originalMethod.apply(instance, params);
                    })
                        .catch(e => {
                        instance.log.warn(LOG_PREFIX + `Pending commands finished with error: ${e}. Proceeding with disconnection.`);
                        originalMethod.apply(instance, params);
                    });
                }
                else {
                    instance.log.debug(LOG_PREFIX + 'No commands pending execution, disconnect.');
                    // Nothing pending, just proceed.
                    originalMethod.apply(instance, params);
                }
            }, 10);
        };
    }
    /**
     * Receives the options and returns an array of parameters for the ioredis constructor.
     * Keeping both redis setup options for backwards compatibility.
     */
    static _defineLibrarySettings(options) {
        const opts = merge({}, DEFAULT_LIBRARY_OPTIONS);
        const result = [opts];
        if (!isString(options.url)) {
            merge(opts, {
                host: options.host,
                port: options.port,
                db: options.db,
                password: options.pass
            });
        }
        else { // If it IS the string URL, that'll be the first param for ioredis.
            result.unshift(options.url);
        }
        return result;
    }
    /**
     * Parses the options into what we care about.
     */
    static _defineOptions({ connectionTimeout, operationTimeout, url, host, port, db, pass }) {
        const parsedOptions = {
            connectionTimeout, operationTimeout, url, host, port, db, pass
        };
        return merge({}, DEFAULT_OPTIONS, parsedOptions);
    }
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

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
class MapPoly {
    __mapKeysData__ = [];
    __mapValuesData__ = [];
    // unlike ES6 `Map`, it only accepts an array as first argument iterable
    constructor(entries) {
        if (Array.isArray(entries))
            entries.forEach(entry => { this.set(entry[0], entry[1]); });
    }
    clear() {
        if (!this.__mapKeysData__.length)
            return;
        this.__mapKeysData__.length = 0;
        this.__mapValuesData__.length = 0;
    }
    set(key, value) {
        let index = this.__mapKeysData__.indexOf(key);
        if (index === -1)
            index = this.__mapKeysData__.push(key) - 1;
        this.__mapValuesData__[index] = value;
        return this;
    }
    delete(key) {
        const index = this.__mapKeysData__.indexOf(key);
        if (index === -1)
            return false;
        this.__mapKeysData__.splice(index, 1);
        this.__mapValuesData__.splice(index, 1);
        return true;
    }
    get(key) {
        const index = this.__mapKeysData__.indexOf(key);
        if (index === -1)
            return;
        return this.__mapValuesData__[index];
    }
    get size() {
        return this.__mapKeysData__.length;
    }
}
const _Map = typeof Map !== 'undefined' ? Map : MapPoly;

const LogLevels = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    NONE: 'NONE'
};
const LogLevelRanks = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    NONE: 5
};
// exported for testing purposes only
function _sprintf(format = '', args = []) {
    let i = 0;
    return format.replace(/%s/g, function () {
        return args[i++];
    });
}
const defaultOptions = {
    prefix: 'splitio',
    logLevel: LogLevels.NONE,
    showLevel: true,
};
class Logger {
    options;
    codes;
    logLevel;
    constructor(options, codes) {
        this.options = objectAssign({}, defaultOptions, options);
        this.codes = codes || new _Map();
        this.logLevel = LogLevelRanks[this.options.logLevel];
    }
    setLogLevel(logLevel) {
        this.options.logLevel = logLevel;
        this.logLevel = LogLevelRanks[logLevel];
    }
    debug(msg, args) {
        if (this._shouldLog(LogLevelRanks.DEBUG))
            this._log(LogLevels.DEBUG, msg, args);
    }
    info(msg, args) {
        if (this._shouldLog(LogLevelRanks.INFO))
            this._log(LogLevels.INFO, msg, args);
    }
    warn(msg, args) {
        if (this._shouldLog(LogLevelRanks.WARN))
            this._log(LogLevels.WARN, msg, args);
    }
    error(msg, args) {
        if (this._shouldLog(LogLevelRanks.ERROR))
            this._log(LogLevels.ERROR, msg, args);
    }
    _log(level, msg, args) {
        if (typeof msg === 'number') {
            const format = this.codes.get(msg);
            msg = format ? _sprintf(format, args) : `Message code ${msg}${args ? ', with args: ' + args.toString() : ''}`;
        }
        else {
            if (args)
                msg = _sprintf(msg, args);
        }
        const formattedText = this._generateLogMessage(level, msg);
        console.log(formattedText);
    }
    _generateLogMessage(level, text) {
        const textPre = ' => ';
        let result = '';
        if (this.options.showLevel) {
            result += '[' + level + ']' + (level === LogLevels.INFO || level === LogLevels.WARN ? ' ' : '') + ' ';
        }
        if (this.options.prefix) {
            result += this.options.prefix + textPre;
        }
        return result += text;
    }
    _shouldLog(level) {
        return level >= this.logLevel;
    }
}

/* eslint-disable max-len */
/**
 * Wrapper for our RedisAdapter.
 *
 * @param {Object} redisOptions  Redis options with the format expected at `settings.storage.options`.
 * @returns {import("@splitsoftware/splitio-commons/types/storages/types").ICustomStorageWrapper} Wrapper for IORedis client.
 */

function redisAdapterWrapperFactory(redisOptions) {
  let redis; // eslint-disable-next-line no-unused-vars
  return {
    get(key) {
      return redis.get(key);
    },

    set(key, value) {
      return redis.set(key, value).then(value => value === 'OK');
    },

    getAndSet(key, value) {
      const getResult = redis.get(key);
      return redis.set(key, value).then(() => getResult);
    },

    del(key) {
      return redis.del(key);
    },

    getKeysByPrefix(prefix) {
      return redis.keys(`${prefix}*`);
    },

    getByPrefix(prefix) {
      return this.getKeysByPrefix(prefix).then(keys => redis.mget(...keys));
    },

    getMany(keys) {
      return redis.mget(...keys);
    },

    incr(key) {
      return redis.incr(key);
    },

    decr(key) {
      return redis.decr(key);
    },

    pushItems(key, items) {
      return redis.rpush(key, items);
    },

    popItems(key, count) {
      return redis.lrange(key, 0, count - 1).then(result => {
        return redis.ltrim(key, result.length, -1).then(() => result);
      });
    },

    getItemsCount(key) {
      // if (redisError) return Promise.reject(redisError);
      return redis.llen(key);
    },

    itemContains(key, item) {
      // if (redisError) return Promise.reject(redisError);
      return redis.sismember(key, item).then(matches => matches !== 0);
    },

    addItems(key, items) {
      return redis.sadd(key, items);
    },

    removeItems(key, items) {
      return redis.srem(key, items);
    },

    getItems(key) {
      return redis.smembers(key);
    },

    flushDb() {
      try {
        redis.flushall().then((status) => {
        });
      } catch (error) {
        return Promise.reject(false)
      }
      return Promise.resolve();
    },

    connect() {
      const log = new Logger({
        logLevel: 'NONE'
      });
      redis = new RedisAdapter(log, redisOptions);
      let retriesCount = 0;

      return new Promise((res, rej) => {
        redis.on('error', e => {
          console.log('Connecting to redis, attempt #', retriesCount);
          retriesCount++;

          if (retriesCount === 10) {
            this.close();
            rej('Connection timeout retries');
          }
        });
        redis.on('connect', () => {
          res(true);
        });
      });
    },

    close() {
      console.log(`disconnecting - instance id: ${redis.id}`);
      return redis.quit();
      // return Promise.resolve(redis && redis.quit()); // close the connection
    }
  };
}

module.exports = redisAdapterWrapperFactory;
//# sourceMappingURL=inRedisStorage.cjs.map

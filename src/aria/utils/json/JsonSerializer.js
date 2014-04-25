/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Aria = require("../../Aria");

/**
 * Utility to convert data to a JSON string
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.json.JsonSerializer",
    /**
     * @param {Boolean} optimized If true, an optimized version of the serializer will be used whwnever the options
     * allow to do so
     */
    $constructor : function (optimized) {
        this._optimized = optimized || false;
    },
    $prototype : function () {
        var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, meta = {
            // table of character substitutions
            '\b' : '\\b',
            '\t' : '\\t',
            '\n' : '\\n',
            '\f' : '\\f',
            '\r' : '\\r',
            '"' : '\\"',
            '\\' : '\\\\'
        };

        var specialCharRegexp = /\W/;
        var numberFirstRegexp = /^[0-9]/;

        var quote = function (string) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        };

        var fastSerializer = (function () {
            var JSON = Aria.$global.JSON || {};
            if (JSON.stringify) {
                return JSON.stringify;
            } else {
                // This part was taken from https://github.com/douglascrockford/JSON-js/blob/master/json2.js

                String.prototype.toJSON = Number.prototype.toJSON = Aria.$global.Boolean.prototype.toJSON = function (
                        key) {
                    return this.valueOf();
                };

                var gap, indent;
                var str = function (key, holder) {

                    // Produce a string from holder[key].

                    var i, // The loop counter.
                    k, // The member key.
                    v, // The member value.
                    length, mind = gap, partial, value = holder[key];

                    // If the value has a toJSON method, call it to obtain a replacement value.

                    if (value && typeof value.toJSON === 'function') {
                        value = value.toJSON(key);
                    }

                    // What happens next depends on the value's type.

                    switch (typeof value) {
                        case 'string' :
                            return quote(value);

                        case 'number' :

                            // JSON numbers must be finite. Encode non-finite numbers as null.

                            return isFinite(value) ? String(value) : 'null';

                        case 'boolean' :
                        case 'null' :

                            // If the value is a boolean or null, convert it to a string. Note:
                            // typeof null does not produce 'null'. The case is included here in
                            // the remote chance that this gets fixed someday.

                            return String(value);

                            // If the type is 'object', we might be dealing with an object or an array or
                            // null.

                        case 'object' :

                            // Due to a specification blunder in ECMAScript, typeof null is 'object',
                            // so watch out for that case.

                            if (!value) {
                                return 'null';
                            }

                            // Make an array to hold the partial results of stringifying this object value.

                            gap += indent;
                            partial = [];

                            // Is the value an array?

                            if (Object.prototype.toString.apply(value) === '[object Array]') {

                                // The value is an array. Stringify every element. Use null as a placeholder
                                // for non-JSON values.

                                length = value.length;
                                if (indent) {
                                    for (i = 0; i < length; i += 1) {
                                        partial[i] = str(i, value) || 'null';
                                    }

                                    // Join all of the elements together, separated with commas, and wrap them in
                                    // brackets.

                                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap)
                                            + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                                    gap = mind;
                                } else {
                                    // optimized code that avoids the + string concatenation operator
                                    partial.push('[');
                                    for (i = 0; i < length; i += 1) {
                                        if (i !== 0) {
                                            partial.push(',');
                                        }
                                        partial.push(str(i, value) || 'null');
                                    }
                                    partial.push(']');
                                    v = partial.join('');
                                }
                                return v;
                            }

                            // Otherwise, iterate through all of the keys in the object.

                            if (indent) {
                                for (k in value) {
                                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                                        v = str(k, value);
                                        if (v) {
                                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                        }
                                    }
                                }

                                // Join all of the member texts together, separated with commas,
                                // and wrap them in braces.

                                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n'
                                        + mind + '}' : '{' + partial.join(',') + '}';
                                gap = mind;
                            } else {
                                // optimized code that avoids the + string concatenation operator and minimizes the
                                // number of calls to Array.push method
                                var b = false;
                                partial.push('{');
                                for (k in value) {
                                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                                        v = str(k, value);
                                        if (v) {
                                            if (b) {
                                                partial[partial.length] = ",";
                                            }
                                            partial.push(quote(k), ':', v);
                                            b = true;
                                        }
                                    }
                                }
                                partial.push('}');
                                v = partial.join('');
                            }
                            return v;
                    }
                };

                return function (value, replacer, space) {

                    // The stringify method takes a value and an optional replacer, and an optional
                    // space parameter, and returns a JSON text. The replacer can be a function
                    // that can replace values, or an array of strings that will select the keys.
                    // A default replacer method can be provided. Use of the space parameter can
                    // produce text that is more easily readable.

                    var i;
                    gap = '';
                    indent = '';

                    // If the space parameter is a number, make an indent string containing that
                    // many spaces.

                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }

                        // If the space parameter is a string, it will be used as the indent string.

                    } else if (typeof space === 'string') {
                        indent = space;
                    }

                    // Make a fake root object containing our value under the key of ''.
                    // Return the result of stringifying the value.

                    return str('', {
                        '' : value
                    });
                };
            }
        })();

        var typeUtil = (require("../Type"));

        var defaults = {
            indent : "",
            maxDepth : 100,
            escapeKeyNames : true,
            encodeParameters : false,
            reversible : false,
            serializedDatePattern : "yyyy/MM/dd HH:mm:ss",
            keepMetadata : true
        };

        return {
            /**
             * Normalize the options by calling the protected method _normalizeOptions and call the protected method
             * _serialize
             * @public
             * @param {Object|Array|String|Number|Boolean|Date|RegExp|Function} item item to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeOptions} options options for the serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            serialize : function (item, options) {
                options = (options) ? options : {};
                this._normalizeOptions(options);
                if (this._optimized && options.indent.length <= 10 && options.escapeKeyNames
                        && !options.encodeParameters && options.keepMetadata && options.maxDepth >= 100
                        && !options.reversible) {
                    var dateToJSON = Date.prototype.toJSON;
                    var regexpToJSON = RegExp.prototype.toJSON;
                    var functionToJSON = Function.prototype.toJSON;
                    try {
                        Date.prototype.toJSON = function () {
                            return aria.utils.Date.format(this, options.serializedDatePattern);
                        };
                        RegExp.prototype.toJSON = function () {
                            return this + '';
                        };
                        Function.prototype.toJSON = function () {
                            return "[function]";
                        };
                        return fastSerializer(item, null, options.indent);
                    } catch (e) {
                        return null;
                    } finally {
                        Date.prototype.toJSON = dateToJSON;
                        RegExp.prototype.toJSON = regexpToJSON;
                        Function.prototype.toJSON = functionToJSON;
                    }
                }
                return this._serialize(item, options);
            },

            /**
             * Normalize the options given to serialize
             * @protected
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeOptions} options
             */
            _normalizeOptions : function (options) {
                for (var key in defaults) {
                    if (defaults.hasOwnProperty(key) && !(key in options)) {
                        options[key] = defaults[key];
                    }
                }
            },

            /**
             * Internal method to be called recursively in order to serialize an item. I does not perform options
             * normalization
             * @protected
             * @param {Object|Array|String|Number|Boolean|Date|RegExp} item item to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serialize : function (item, options) {

                if (item === null) {
                    return this._serializeNull(options);
                }
                if (typeUtil.isBoolean(item)) {
                    return this._serializeBoolean(item, options);
                }
                if (typeUtil.isNumber(item)) {
                    return this._serializeNumber(item, options);
                }
                if (typeUtil.isString(item)) {
                    return this._serializeString(item, options);
                }
                if (typeUtil.isDate(item)) {
                    return this._serializeDate(item, options);
                }
                if (typeUtil.isRegExp(item)) {
                    return this._serializeRegExp(item, options);
                }
                if (typeUtil.isArray(item)) {
                    return this._serializeArray(item, options);
                }
                if (typeUtil.isObject(item)) {
                    return this._serializeObject(item, options);
                }
                if (typeUtil.isFunction(item)) {
                    return this._serializeFunction(item, options);
                }

                return '"[' + typeof(item) + ']"';
            },

            /**
             * Protected method that is called whenever an object has to be serialized
             * @protected
             * @param {Object} item object to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeObject : function (item, options) {
                var indent = options.indent, output, baseIndent = (options.baseIndent) ? options.baseIndent : "";
                var subIndent = (indent) ? baseIndent + indent : null;

                if (options.maxDepth < 1) {
                    if (options.reversible) {
                        return null;
                    }
                    return '{...}';
                }
                var res = ["{"];
                if (indent) {
                    res.push("\n");
                }
                var isEmpty = true;

                for (var key in item) {
                    if (item.hasOwnProperty(key) && this.__preserveObjectKey(key, options)) {
                        isEmpty = false;
                        if (indent) {
                            res.push(subIndent);
                        }

                        if (options.escapeKeyNames || specialCharRegexp.test(key) || numberFirstRegexp.test(key)) {
                            res.push(quote(key) + ':');
                        } else {
                            res.push(key + ':');
                        }
                        if (indent) {
                            // to be compatible with JSON.stringify
                            res.push(' ');
                        }
                        var newOptions = require("../Json").copy(options, true);
                        newOptions.baseIndent = subIndent;
                        newOptions.maxDepth = options.maxDepth - 1;
                        output = this._serialize(item[key], newOptions);
                        if (output === null) {
                            return null;
                        }
                        res.push(output);
                        if (indent) {
                            res.push(",\n");
                        } else {
                            res.push(',');
                        }

                    }
                }
                if (!isEmpty) {
                    res[res.length - 1] = ""; // remove last ','
                }
                if (indent) {
                    res.push("\n" + baseIndent + "}");
                } else {
                    res.push("}");
                }
                return res.join('');

            },

            /**
             * Wheter a key should be serialized in the result object or not. Metadata might be excluded depending on
             * the options.
             * @param {String} key Key name
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {Boolean}
             * @private
             */
            __preserveObjectKey : function (key, options) {
                if (!options.keepMetadata) {
                    return !require("../Json").isMetadata(key);
                }
                return true;
            },

            /**
             * Protected method that is called whenever an array has to be serialized
             * @protected
             * @param {Array} item array to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeArray : function (item, options) {
                var indent = options.indent, output, baseIndent = (options.baseIndent) ? options.baseIndent : "";
                var subIndent = (indent) ? baseIndent + indent : null;

                if (options.maxDepth < 1) {
                    if (options.reversible) {
                        return null;
                    }
                    return '[...]';
                }
                var sz = item.length;
                if (sz === 0) {
                    return "[]";
                } else {
                    var res = ["["];
                    if (indent) {
                        res.push("\n");
                    }
                    for (var i = 0; sz > i; i++) {
                        if (indent) {
                            res.push(subIndent);
                        }
                        var newOptions = require("../Json").copy(options, true);
                        newOptions.baseIndent = subIndent;
                        newOptions.maxDepth = options.maxDepth - 1;
                        output = this._serialize(item[i], newOptions);
                        if (output === null) {
                            return null;
                        }
                        res.push(output);
                        if (i != sz - 1) {
                            res.push(",");
                            if (indent) {
                                res.push("\n");
                            }
                        }
                    }
                    if (indent) {
                        res.push("\n" + baseIndent + "]");
                    } else {
                        res.push("]");
                    }
                }
                return res.join('');

            },

            /**
             * Protected method that is called whenever a string has to be serialized
             * @protected
             * @param {String} item string to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeString : function (item, options) {
                var stringContent;
                item = item.replace(/([\\\"])/g, "\\$1").replace(/(\r)?\n/g, "\\n");
                if (options.encodeParameters === true) {
                    stringContent = encodeURIComponent(item);
                } else {
                    stringContent = item;
                }

                return '"' + stringContent + '"';
            },

            /**
             * Protected method that is called whenever a number has to be serialized
             * @protected
             * @param {Number} item number to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeNumber : function (item, options) {
                return item + '';
            },

            /**
             * Protected method that is called whenever a boolean has to be serialized
             * @protected
             * @param {Boolean} item boolean to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeBoolean : function (item, options) {
                return (item) ? 'true' : 'false';
            },

            /**
             * Protected method that is called whenever a date has to be serialized
             * @protected
             * @param {Date} item date to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeDate : function (item, options) {
                if (options.reversible || !aria.utils.Date) {
                    return 'new Date(' + item.getTime() + ')';
                } else {
                    return '"' + aria.utils.Date.format(item, options.serializedDatePattern) + '"';
                }
            },

            /**
             * Protected method that is called whenever a regexp has to be serialized
             * @protected
             * @param {RegExp} item regexp to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeRegExp : function (item, options) {
                if (options.reversible) {
                    return item + "";
                } else {
                    return this._serializeString(item + "", options);
                }
            },

            /**
             * Protected method that is called whenever a function has to be serialized
             * @protected
             * @param {Function} item function to serialize
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeFunction : function (item, options) {
                return '"[function]"';
            },

            /**
             * Protected method that is called whenever null has to be serialized
             * @protected
             * @param {aria.utils.json.JsonSerializerBeans:JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeNull : function () {
                return 'null';
            },

            /**
             * Parse a string as JSON. This uses a partial implementation of <a
             * href="https://github.com/douglascrockford/JSON-js/blob/master/json.js">Douglas Crockford's algorithm</a>
             * to parse JSON strings.<br />
             * It provides some security around the eval and resembles what was done in aria.utils.json.load()
             * @param {String} string The string to parse as JSON
             * @return {Object} JSON object
             * @throws SyntaxError
             */
            parse : function (string) {
                var text = String(string);

                // Run the text against regular expressions that look
                // for non-JSON patterns. We are especially concerned with '()' and 'new'
                // because they can cause invocation, and '=' because it can cause mutation.
                // But just to be safe, we want to reject all unexpected forms.
                // To create date objects from serialized dates we allow new Date().

                // We split the stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}' or 'new Date(])'. If that is so, then the text is safe for eval.
                if (/^((new Date\((\])?\))|([\],:{}\s]))*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                    // this might throw a SyntaxError
                    return eval('(' + text + ')');
                } else {
                    throw new Error('aria.utils.json.JsonSerializer.parse');
                }
            }
        };
    }
});

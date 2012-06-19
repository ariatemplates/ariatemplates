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

/**
 * Utility to convert data to a JSON string
 */
Aria.classDefinition({
    $classpath : "aria.utils.json.JsonSerializer",
    $dependencies : ["aria.utils.Type"],
    $prototype : function () {
        var typeUtil = aria.utils.Type;

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
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeOptions} options options for the serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            serialize : function (item, options) {
                options = (options) ? options : {};
                this._normalizeOptions(options);
                return this._serialize(item, options);
            },

            /**
             * Normalize the options given to serialize
             * @protected
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeOptions} options
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
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
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
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
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

                        if (options.escapeKeyNames || key.match(/\:/)) {
                            res.push('"' + key + '":');
                        } else {
                            res.push(key + ':');
                        }
                        var newOptions = aria.utils.Json.copy(options, true);
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
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {Boolean}
             * @private
             */
            __preserveObjectKey : function (key, options) {
                if (!options.keepMetadata) {
                    return !aria.utils.Json.isMetadata(key);
                }
                return true;
            },

            /**
             * Protected method that is called whenever an array has to be serialized
             * @protected
             * @param {Array} item array to serialize
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
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
                        var newOptions = aria.utils.Json.copy(options, true);
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
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
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
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
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
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
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
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
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
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeRegExp : function (item, options) {
                return item + "";
            },

            /**
             * Protected method that is called whenever a function has to be serialized
             * @protected
             * @param {Function} item function to serialize
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
             * serialization
             * @return {String} the serialized item. It is set to null if there is an error during the serialization
             */
            _serializeFunction : function (item, options) {
                return '"[function]"';
            },

            /**
             * Protected method that is called whenever null has to be serialized
             * @protected
             * @param {aria.utils.json.JsonSerializerBeans.JsonSerializeAdvancedOptions} options options for the
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

                // We split the stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                    // this might throw a SyntaxError
                    return eval('(' + text + ')');
                } else {
                    throw new Error('aria.utils.json.JsonSerializer.parse');
                }
            }
        }
    }
});
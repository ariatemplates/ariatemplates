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
var Aria = require("../Aria");
var ariaUtilsString = require("./String");
var ariaUtilsType = require("./Type");


/**
 * Utility to handle JSON path. NOTE: this could be extended to support XPath like queries
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.Path",
    $singleton : true,
    $statics : {
        WRONG_PATH_SYNTAX : "Syntax for path %1 is not valid. Note that variables cannot be used in paths.",
        RESOLVE_FAIL : "Resolve for path %1 failed, root element does not contain this path"
    },
    $prototype : {
        /**
         * Set a value inside a container object given a path. <code>setValue(obj, "a.b.c", true)</code> corresponds
         * functionally to <code>obj.a.b.c = true</code> however this function creates all the necessary intermediate
         * objects in order to set the value correctly on the specified path. <br />
         * Path can be anything acceptable for parse function, so
         * <ul>
         * <li>dot notation : first.second.third</li>
         * <li>bracket notation : first['second']['third']</li>
         * <li>array notation : array[0][1], in this case array will actaully be an array and not an object. An object
         * with key '0' can be created using array['0']['1']</li>
         * </ul>
         * @param {Object} inside Container object
         * @param {String} path Where the value should be set in the object
         * @param {Object} value What should be set on the given path
         */
        setValue : function (inside, path, value) {
            var typeUtils = ariaUtilsType;
            if (!inside || !path || !typeUtils.isObject(inside)) {
                return;
            }
            if (typeUtils.isString(path)) {
                path = this.parse(path);
            }
            if (!typeUtils.isArray(path) || typeUtils.isNumber(path[0])) {
                return;
            }

            var container = inside, param, next;
            for (var i = 0, len = path.length; i < len; i += 1) {
                param = path[i];

                if (i === len - 1) {
                    container[param] = value;
                } else {
                    next = path[i + 1];
                    if (typeUtils.isNumber(next) && !typeUtils.isArray(container[param])) {
                        container[param] = [];
                    }
                    if (typeUtils.isString(next) && (!typeUtils.isObject(container[param]) || !(param in container))) {
                        container[param] = {};
                    }
                    container = container[param];
                }
            }
        },

        /**
         * Resolve a path inside an object, and return result
         * @param {String|Array} path If a string, will parse it. If Array, specifies the suite of parameters to
         * follow.
         * @param {Object} inside If not specified, window is used.
         */
        resolve : function (path, inside) {
            if (ariaUtilsType.isString(path)) {
                path = this.parse(path);
            }
            inside = inside ? inside : Aria.$window;
            if (ariaUtilsType.isArray(path)) {
                for (var index = 0, param, len = path.length; index < len; index++) {
                    param = path[index];
                    inside = inside[param];
                    if (!inside && index != len - 1) {
                        throw {
                            error : this.RESOLVE_FAIL,
                            args : [path],
                            object : inside
                        };
                    }
                }
                return inside;
            }
            throw {
                error : this.RESOLVE_FAIL,
                args : [path],
                object : inside
            };
        },

        /**
         * Parse a string path and return parameter suite in an array
         * @param {String} path like obj.param1[0]["param2"]
         * @return {Array}
         */
        parse : function (path) {
            return this._paramParse("." + path);
        },

        /**
         * Parse parameters in path
         * @protected
         * @param {String} path like .param1[0]["param2"]
         * @return {Array}
         */
        _paramParse : function (path) {
            // edge case
            if (!path) {
                return [];
            }

            // first letter will give the type
            var first = path.charAt(0), closing, part, next, nextParse;

            // case brackets
            if (first == "[") {
                closing = path.indexOf("]");
                if (closing != -1) {
                    part = path.substring(1, closing);
                    next = path.substring(closing + 1);
                    if (/^\d+$/.test(part)) {
                        nextParse = this._paramParse(next);
                        nextParse.unshift(parseInt(part, 10));
                        return nextParse;
                    } else {
                        // check that part is "something" or 'somethingelse'
                        var strMarker = part.charAt(0), utilString = ariaUtilsString;
                        if ((strMarker == "'" || strMarker == '"')
                                && utilString.indexOfNotEscaped(part, strMarker, 1) == part.length - 1) {
                            nextParse = this._paramParse(next);
                            nextParse.unshift(part.substring(1, part.length - 1).replace(new RegExp("\\\\" + strMarker, "gi"), strMarker));
                            return nextParse;
                        }
                    }
                }
            } else if (first == ".") {
                part = /^[_A-z\$]\w*/.exec(path.substring(1));
                if (part.length) {
                    part = part[0];
                    next = path.substring(part.length + 1);
                    nextParse = this._paramParse(next);
                    nextParse.unshift(part);
                    return nextParse;
                }
            }

            // nothing returned -> throws an exception
            throw {
                error : this.WRONG_PATH_SYNTAX,
                args : [path]
            };
        },

        /**
         * Transform an array of paths part into a path
         * @param {Array} pathParts
         * @return {String}
         */
        pathArrayToString : function (pathParts) {
            var path = [pathParts[0]];
            for (var index = 1, len = pathParts.length; index < len; index++) {
                path.push("[\"" + ("" + pathParts[index]).replace(/"/gi, '\\"') + "\"]");
            }
            return path.join('');
        },

        /**
         * Describe the object referred by a certain path in the container object. Returns an object containing
         * <ul>
         * <li>container : The last containing object, it's the object in which the last property is defined</li>
         * <li>property : The name of the last property in the path</li>
         * <li>value : The value of the property specified by the path</li>
         * </ul>
         * For example calling <code>describe(obj, "a.b.c")</code> returns
         *
         * <pre>
         * {
         *    container : obj.a.b,
         *    property : 'c',
         *    value : 'the value of obj.a.b.c'
         * }
         * </pre>
         *
         * If the path doesn't exist in the container object this function returns null
         * @param {Object} container
         * @param {String} path
         * @return {Object}
         */
        describe : function (container, path) {
            var typeUtils = ariaUtilsType;
            if (!container || !path || !typeUtils.isObject(container)) {
                return;
            }
            if (typeUtils.isString(path)) {
                path = this.parse(path);
            }
            if (!typeUtils.isArray(path) || typeUtils.isNumber(path[0])) {
                return;
            }

            var obj = container, param;
            for (var i = 0, len = path.length; i < len; i += 1) {
                param = path[i];

                if (typeUtils.isNumber(param) && !typeUtils.isArray(obj)) {
                    return null;
                }
                if (typeUtils.isString(param) && (!typeUtils.isObject(obj) || !(param in obj))) {
                    return null;
                }

                if (i === len - 1) {
                    return {
                        container : obj,
                        property : param,
                        value : obj[param]
                    };
                } else {
                    obj = obj[param];
                }
            }
        }
    }
});

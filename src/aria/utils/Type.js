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
 * @class aria.utils.Type Utilities for comparing types
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
    $classpath : 'aria.utils.Type',
    $singleton : true,
    $constructor : function () {},
    $prototype : {

        /**
         * Check if the value is an array
         * @param {Object} value
         * @return {Boolean} isArray
         */
        isArray : function (value) {
            return Object.prototype.toString.apply(value) === "[object Array]";
        },

        /**
         * Check if the value is a string (for example, typeof(new String("my String")) is "object")
         * @param {Object} value
         * @return {Boolean} isString
         */
        isString : function (value) {
            if (typeof(value) === 'string') {
                return true;
            }
            return Object.prototype.toString.apply(value) === "[object String]";
        },

        /**
         * Check if the value is a RegularExpression
         * @param {Object} value
         * @return {Boolean} isRegExp
         */
        isRegExp : function (value) {
            return Object.prototype.toString.apply(value) === "[object RegExp]";
        },

        /**
         * Check if the value is a number
         * @param {Object} value
         * @return {Boolean} isNumber
         */
        isNumber : function (value) {
            if (typeof(value) === 'number') {
                return true;
            }
            return Object.prototype.toString.apply(value) === "[object Number]";
        },

        /**
         * Check if the value is a js Date
         * @param {Object} value
         * @return {Boolean} isDate
         */
        isDate : function (value) {
            return Object.prototype.toString.apply(value) === "[object Date]";
        },

        /**
         * Check if the value is a boolean
         * @param {Object} value
         * @return {Boolean} isBoolean
         */
        isBoolean : function (value) {
            return (value === true || value === false);
        },

        /**
         * Check if the value is a HTML element
         * @param {Object} object
         * @return {Boolean} isHTMLElement
         */
        isHTMLElement : function (object) {
            // http://www.quirksmode.org/dom/w3c_core.html#nodeinformation
            if (object) {
                var nodeName = object.nodeName;
                return object === Aria.$window || aria.utils.Type.isString(nodeName)
                        || object === Aria.$frameworkWindow;
            } else {
                return false;
            }
        },

        /**
         * Check if the value is an object
         * @param {Object} value
         * @return {Boolean} isObject return false if value is null or undefined.
         */
        isObject : function (value) {
            // check that the value is not null or undefined, because otherwise,
            // in IE, if value is undefined or null, the toString method returns Object anyway
            if (value) {
                return Object.prototype.toString.apply(value) === "[object Object]";
            } else {
                return false;
            }
        },

        /**
         * Check if the value is an instance object of the given classpath.
         * @param {Object} value
         * @param {String} classpath
         * @return {Boolean} true is value is an instance of the given classpath, false otherwise
         */
        isInstanceOf : function (value, classpath) {
            var myClass = Aria.getClassRef(classpath);
            if (myClass == null) {
                /* if the classpath is not loaded, the value cannot be an instance of it */
                return false;
            }
            return value instanceof myClass;
        },

        /**
         * Check if the object is a function
         * @param {Object} value
         * @return {Boolean} isFunction
         */
        isFunction : function (value) {
            return Object.prototype.toString.apply(value) === "[object Function]";
        },

        /**
         * Return true if value is an Object or an Array. It will however return false if the value is an instance of
         * aria.core.JsObject
         * @param {Object} value
         * @return {Boolean} isContainer
         */
        isContainer : function (value) {
            return (this.isObject(value) || this.isArray(value)) && !(value instanceof aria.core.JsObject);
        },
        /**
         * Return true if value is undefined aria.core.JsObject
         * @param {Object} value
         * @return {Boolean} isUndefined
         */
        isUndefined : function (value) {
            return typeof(value) === "undefined";
        }
    }
});
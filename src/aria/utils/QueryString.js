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


/**
 * Utils for javascript query strings
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.QueryString",
    $singleton : true,
    $constructor : function () {
        /**
         * Map query string key to their corresponding value
         * @type Object
         */
        this.keyValues = null;
    },
    $prototype : {
        /**
         * Parses current query string (from the window where the framework is loaded) and extracts the key values
         */
        _init : function () {
            var window = Aria.$frameworkWindow;
            if (window != null) {
                this.keyValues = this.parseQueryString(window.location.search);
            } else {
                this.keyValues = {};
            }
        },

        /**
         * Parses a query string and returns a map of parameter/values.
         * @param {String} queryString Query string. Can either be empty, or start with a "?" character.
         * @return {Object}
         */
        parseQueryString : function (queryString) {
            var res = {};
            if (queryString == null || queryString.length === 0) {
                return res;
            }
            queryString = queryString.substr(1, queryString.length); // remove "?" sign

            var pairs = queryString.split("&");
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                var key = decodeURIComponent(pair[0]);
                var value = (pair.length == 2) ? decodeURIComponent(pair[1]) : key;
                res[key] = value;
            }
            return res;
        },

        /**
         * Gets the value of specific query string key (from the window where the framework is loaded,
         * Aria.$frameworkWindow)
         * @param {String} key
         * @return {String}
         */
        getKeyValue : function (key) {
            if (!this.keyValues) {
                this._init();
            }
            return this.keyValues[key];
        }
    }
});

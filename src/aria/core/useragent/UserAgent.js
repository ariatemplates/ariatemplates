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
var UAParser = require('./ua-parser.js');

/**
 * Wraps the use of ua-parser.js to provide its results, and some utilities to analyze them.
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.core.useragent.UserAgent',
    $singleton: true,

    $constructor : function () {
        /**
         * Cache for user agents information.
         *
         * @type {Object}
         */
        this._cache = {};
    },

    $statics: {
        /**
         * Normalizes a string for more flexible matching against others.
         *
         * <p>
         * It turns it lower case and strips all white spaces.
         * </p>
         *
         * @param {String} string The string to normalize
         *
         * @return {String} The normalized string.
         */
        normalizeName : function(string) {
            return string.toLowerCase().replace(/\s*/g, '');
        }
    },

    $prototype: {
        /**
         * Returns the information about the given userAgent.
         *
         * <p>
         * Here is the format of the information object:
         * <code>
         * {
         *     ua // {String} the user agent used to compute the information
         *     results // {Object} The information object resulting from the processing of UAParser (please refer to https://github.com/faisalman/ua-parser-js)
         * }
         * </code>
         * </p>
         *
         * <p>
         * Note that results are cached, which improves time performances (at the cost of (memory) space).
         * </p>
         *
         * @param {String} userAgent The user agent to use. If none is given, the one from the DOM API is read.
         *
         * @return {Object} Information object <em>{ua, results}</em>. See full description for more details.
         */
        getUserAgentInfo : function (userAgent) {
            // -------------------------------------- input arguments processing

            if (userAgent == null) {
                var navigator = Aria.$global.navigator;
                userAgent = navigator ? navigator.userAgent : "";
            }

            // ---------------------------------------------- output computation

            var result;

            // ---------------------------------------- early termination: cache

            var cacheKey = userAgent.toLowerCase();
            if (this._cache.hasOwnProperty(cacheKey)) {
                result = this._cache[cacheKey];
            }
            if (result != null) {
                return result;
            }

            // ----------------------------------------------------- computation

            result = {
                ua: userAgent,
                results: new UAParser(userAgent).getResult()
            };

            // ----------------------------------------- finalization and return

            this._cache[cacheKey] = result;
            return result;
        }
    }
});

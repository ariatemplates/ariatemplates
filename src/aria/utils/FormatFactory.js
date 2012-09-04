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
 * This class contains utilities to build format functions (ex: the formatters used in aria.utils.Date)
 * @deprecated
 */
Aria.classDefinition({
    $classpath : "aria.utils.FormatFactory",
    $dependencies : ["aria.utils.Type"],
    $constructor : function () {
        this.$logError("This class is deprecated. Please stop using it!");

        /**
         * @private Object containing the statements associated with formatting It contains functions that take an
         * object as the scope, and returns a String from this object
         * @type {Object}
         */
        this._statements = {};

        /**
         * @private Regular expression to recognize statements
         * @type {RegExp}
         */
        this._statementsRegExp = /^\$\{[^\}]*\}/;

        /**
         * @private Map of already defined format functions
         */
        this._formatFnCache = {};

    },
    $destructor : function () {
        this._statements = null;
        this._formatFnCache = null;
    },
    $statics : {
        PATTERN_ERROR_MESSAGE : "##PATTERN_ERROR##",
        FORMAT_ERROR_MESSAGE : "##FORMAT_ERROR##",

        // ERROR MESSAGE:
        FORMATTER_STATEMENT_NOT_FOUND : "Following pattern %1 is not defined for this formatter: %2"
    },
    $prototype : {

        /**
         * Set the statements used in this formatter. This object act like a map : The key of this object corresponds to
         * the statement name. The values are function that returns a string from the passed argument : e.g for dates
         * function (value) {return value.getDate().toString() }
         * @param {Object} statements
         */
        setStatements : function (statements) {
            this._statements = statements;
        },

        /**
         * Get an instance of a formatter for a given pattern
         * @param {String} pattern.
         * @return {Function}
         */
        getFormatFunction : function (pattern) {

            var matchArray = [], match = "", fn, statement, formatFunction, litteral = "", workPattern = pattern;

            // retrieve from cache
            if (this._formatFnCache[pattern]) {
                return this._formatFnCache[pattern];
            }

            while (workPattern.length > 0) {

                // deals with statements
                match = workPattern.match(this._statementsRegExp);
                if (match) {
                    // if a litteral is ready to be pushed in the array, push it. Any string in the array will be
                    // display 'as it'
                    if (litteral) {
                        matchArray.push(litteral);
                        litteral = "";
                    }
                    match = match[0];
                    statement = match.slice(2, match.length - 1); // remove ${ at the begining at } at the end
                    fn = this._statements[statement];
                    if (fn) {
                        matchArray.push(fn);
                    } else {
                        this.$logError(this.FORMATTER_STATEMENT_NOT_FOUND, [statement, pattern]);
                        matchArray.push(aria.utils.FormatFactory.PATTERN_ERROR_MESSAGE);
                    }
                }

                if (match) {
                    workPattern = workPattern.slice(match.length);
                } else {
                    // any thing not being a statement is litteral
                    // push first letter in litteral, and remove it from pattern
                    litteral += workPattern.charAt(0);
                    workPattern = workPattern.slice(1);
                }
            }

            // push remaining litteral
            if (litteral) {
                matchArray.push(litteral);
            }

            // create formatter function
            formatFunction = function (entry) {
                var element, result = "";
                try {
                    for (var index = 0, l = matchArray.length; index < l; index++) {
                        element = matchArray[index];
                        if (aria.utils.Type.isFunction(element)) {
                            result += element(entry);
                        } else {
                            result += element;
                        }
                    }
                } catch (e) {
                    result = aria.utils.FormatFactory.FORMAT_ERROR_MESSAGE;
                }
                return result;
            }

            // cache it
            this._formatFnCache[pattern] = formatFunction;

            return formatFunction;

        }

    }
});

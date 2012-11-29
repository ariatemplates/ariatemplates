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
 * Utility to parse and format numbers.
 */
Aria.classDefinition({
    $classpath : "aria.utils.Number",
    $singleton : true,
    $dependencies : ["aria.utils.environment.Number", "aria.utils.String", "aria.utils.Type", "aria.utils.Array"],
    $constructor : function () {

        /**
         * Check that a string contains only digits and the default Javascript decimal separator (.)
         * @private
         * @type RegExp
         */
        this._validDigits = /^(\-|\.|\+)?\d+(\.)?(\d+)?$/;

        /**
         * Check if a string contains only digits.
         * @private
         * @type RegExp
         */
        this._digitsOnly = /^\d+$/;

        /**
         * Regular expression for valid currency patterns. The currency can only be the first or the last character. The
         * number of grouping separators is not important. The grouping separator is always a , and the decimal a .
         * regardless of the AppEnvironment
         * @type RegExp
         * @private
         */
        this._validCurrency = /^([\u00A4])?([,#0]+)(?:\.([#0]+))?([\u00A4])?$/;

        /**
         * Regular expression to escape unsafe characters in String.replace.
         * @private
         * @type RegExp
         */
        this._regExSpecials = new RegExp("(\\" + "/.*+?|()[]{}\\".split("").join("|\\") + ")", "g");

        /**
         * Strip any occurrence of the grouping separator.
         * @private
         * @type RegExp
         */
        this._removeGrouping = null;

        /**
         * Replace the decimal separator with a . (dot) this is the only valid symbol for Number()
         * @private
         * @type RegExp
         */
        this._replaceDecimal = null;

        /**
         * Symbol used as decimal separator
         * @type String
         * @private
         */
        this._decimal = null;

        /**
         * Symbol used as grouping separator
         * @type String
         * @private
         */
        this._grouping = null;

        /**
         * Wheter to be strict or not while checking grouping
         * @type Boolean
         * @private
         */
        this._strictGrouping = true;

        /**
         * Default format used to validate inputs and display output
         * @type String|Function
         * @private
         */
        this._format = null;

        /**
         * Default currency symbol
         * @type String
         * @private
         */
        this._currency = null;

        /**
         * Cache for memoizing _explode function
         * @type Object
         * @private
         */
        this._cache = {};

        /* Backward Compatibility begins here */
        /**
         * Cache of formatting strings for currency formatting. The pattern string is extracted from a function in case
         * it's not already defined as string
         * @see aria.core.environment.EnvironmentBaseCfgBeans.FormatTypes
         * @type Object
         * @private
         */
        this._formatCache = {};
        /* Backward Compatibility ends here */

        aria.core.AppEnvironment.$on({
            "changingEnvironment" : {
                fn : this._appEnvChanged,
                scope : this
            }
        });
        // This function should be called now to build the regular expressions that depend on the appEnv
        this._appEnvChanged.call(this);
    },
    $destructor : function () {
        /* Backward Compatibility begins here */
        this._formatCache = null;
        /* Backward Compatibility ends here */
    },
    $statics : {
        /* Backward Compatibility begins here */
        INVALID_FORMAT_TYPE : "Application config format can only be a string or a function",
        DEPRECATED : "The method '%1' is deprecated. Please check the API docs for alternatives",
        /* Backward Compatibility ends here */

        /**
         * Error message logged when the format pattern is invalid
         * @type String
         */
        INVALID_FORMAT : "The format used for %1 is invalid, please check bean %2",

        /**
         * Bean definition used for Decimal Format Symbols
         * @type String
         */
        DECIMAL_BEAN : "aria.utils.environment.NumberCfgBeans.DecimalFormatSymbols",

        /**
         * Bean definition used for Currency Format
         * @type String
         */
        CURRENCY_BEAN : "aria.utils.environment.NumberCfgBeans.CurrencyFormatsCfg"
    },
    $prototype : {

        /**
         * Turn a string to a number. The string cannot contain grouping separator but only decimal.
         * @param {String} text - the displayed text
         * @return {Number}
         */
        toNumber : function (entryStr) {
            if (!this._validDigits.test(entryStr)) {
                return null;
            }
            return Number(entryStr);
        },

        /**
         * Interpret a String entry as a number if possible. It takes into account the thousand separator that should
         * not be used as a decimal separator. A number cannot start with a grouping (thousand) separator. If
         * formatSymbol.strictGrouping equals true, then the entryStr is validated against a pattern (if no pattern is
         * specified as argument, the default one specified in the AppEnvironment will be taken). The result is a string
         * that can be understood by standard JavaScript methods.
         * @param {String} entryStr The number you want to interpret
         * @param {String} patternString the pattern to be used. If strictGrouping is true entryStr should match this
         * pattern
         * @param {aria.utils.environment.NumberCfgBeans.DecimalFormatSymbols} formatSymbols Optional custom formatting
         * symbols
         * @return {String} The number stripped from thousand separator and with . (dot) as decimal separator.
         */
        interpretNumber : function (entryStr, patternString, formatSymbols) {
            var patternDescription = this._explode(patternString);
            var regexpes, sign = '', grouping, decimal, strict, repeat = patternDescription.regularGroup, buildRegExp = !!formatSymbols;

            formatSymbols = this._normalizeSymbols(formatSymbols);
            grouping = formatSymbols.groupingSeparator;
            decimal = formatSymbols.decimalSeparator;
            strict = formatSymbols.strictGrouping;

            if (buildRegExp) {
                regexpes = this._buildRegEx(grouping, decimal);
            } else {
                regexpes = {
                    group : this._removeGrouping,
                    decimal : this._replaceDecimal
                };
            }

            var first = entryStr.charAt(0);
            if (first === "+" || first === "-") {
                sign = first;

                entryStr = entryStr.substring(1);
                first = entryStr.charAt(0);
            }

            var iOfEntry = entryStr.lastIndexOf(grouping);
            if (iOfEntry > -1) {
                // avoid having grouping separator after a decimal symbol
                var iOfDecimal = entryStr.indexOf(decimal);
                if (iOfDecimal > -1 && iOfDecimal < iOfEntry) {
                    return null;
                }

                if (first === grouping) {
                    return null;
                }

                // strict false there's nothing else to check
                if (strict) {
                    if (!patternDescription.hasGrouping) {
                        // a grouping separator was used in the string but not in the pattern
                        return null;
                    }

                    var patternTokens, tokens = entryStr.split(grouping);
                    if (repeat === 0) {
                        patternTokens = patternDescription.integer.split(",");
                        if (patternTokens.length < tokens.length) {
                            // entry string has more separator than the pattern (which is not regular)
                            return null;
                        }
                    }

                    // The first token has a length constraint only in regular patterns
                    var group = tokens[0];

                    if ((repeat > 0 && group.length > repeat) || !this._digitsOnly.test(group)) {
                        return null;
                    }

                    // Check the other tokens, except the last one (it might contain a comma)
                    for (var i = tokens.length - 2; i > 0; i -= 1) {
                        group = tokens[i];
                        var expectedLength = repeat || patternTokens[i].length;

                        if (group.length !== expectedLength || group.indexOf(decimal) !== -1) {
                            return null;
                        }
                    }

                    // Now check the last one, it's length can be bigger than regularGroup if it contains a
                    // decimal separator after regularGroup letters
                    group = tokens[tokens.length - 1];
                    expectedLength = repeat || patternTokens[patternTokens.length - 1].length;
                    if (group.length !== expectedLength && group.charAt(expectedLength) !== decimal) {
                        return null;
                    }

                }
            }

            entryStr = sign + entryStr.replace(regexpes.group, "");

            // To be valid the string should contain only ., but if we localized the application to have
            // a different decimal separator, . is invalid, check that
            if (decimal !== "." && entryStr.indexOf(".") !== -1) {
                return null;
            }

            // Only here it's safe to replace the decimal symbol with a dot.
            entryStr = entryStr.replace(regexpes.decimal, ".");

            if (!this._validDigits.test(entryStr)) {
                return null;
            }

            return entryStr;
        },

        /**
         * Format a given number by using the pattern specified as argument (or the default one set in the
         * AppEnvironment)
         * @param {Number} number The number you want to format
         * @param {String} patternString the pattern to be used
         * @param {aria.utils.environment.NumberCfgBeans.DecimalFormatSymbols} formatSymbols Optional custom formatting
         * symbols
         * @return {String}
         */
        formatNumber : function (number, patternString, formatSymbols) {
            if (isNaN(number)) {
                return number;
            }
            number = Number(number); // so that I can use some JS methods

            formatSymbols = this._normalizeSymbols(formatSymbols);

            var patternDescription = this._explode(patternString);
            if (!patternDescription) {
                return this.$logError(this.INVALID_FORMAT, ["formatCurrency", this.CURRENCY_BEAN]);
            }

            var nString = Math.abs(number).toString().split(".");
            var nFixed = Math.abs(number).toFixed(patternDescription.maxDecLen).split(".");
            var sign = number < 0 ? "-" : "";

            var integer = nFixed[0], decimalS = nString[1] || "", decimalF = nFixed[1] || "";

            // The integer part should be modified only if it shorter than the minimum length
            if (integer.length < patternDescription.minIntLen) {
                integer = aria.utils.String.pad(integer, patternDescription.minIntLen, "0", true);
            }

            // decimal part
            if (decimalF.length !== decimalS.length) {
                // toFixed cropped or padded the number, remove any unnecessary trailing 0
                decimalF = aria.utils.String.crop(decimalF, patternDescription.minDecLen, "0");
            } // either empty string or already correctly padded (crop is impossible)

            var res = [sign + this._addGrouping(integer, patternDescription, formatSymbols)];
            if (decimalF) {
                res.push(decimalF);
            }

            return res.join(formatSymbols.decimalSeparator);
        },

        /**
         * Take the formatted number from formatNumber and apply currency specific formatting, such as the currency
         * symbol
         * @param {Number} number The number you want to format
         * @param {String} patternString the pattern to be used
         * @param {aria.utils.environment.NumberCfgBeans.DecimalFormatSymbols} formatSymbols Optional custom formatting
         * symbols
         * @return {String}
         */
        formatCurrency : function (number, patternString, formatSymbols) {
            formatSymbols = this._normalizeSymbols(formatSymbols);

            var patternDescription = this._explode(patternString);
            if (!patternDescription) {
                return this.$logError(this.INVALID_FORMAT, ["formatCurrency", this.CURRENCY_BEAN]);
            }

            var currencySymbol = this._currency;
            number = this.formatNumber(number, patternString, formatSymbols);

            if (patternDescription.currencyBegin) {
                return currencySymbol + number;
            } else if (patternDescription.currencyEnd) {
                return number + currencySymbol;
            } else {
                return number;
            }
        },

        /**
         * Check if the pattern is valid or not.
         * @param {String|Function} pattern Format pattern
         * @return {Boolean} True if valid
         */
        isValidPattern : function (pattern) {
            // It's valid if _exploded returns something different from undefined
            // this will also populate the cache
            return !!this._explode(pattern);
        },

        /**
         * Listener for the AppEnvironment change. It generates the Regular Expressions that depends on the symbols used
         * in NumberCfg
         * @param {Object} evt Event raised by the app environment
         * @private
         */
        _appEnvChanged : function (evt) {
            var uArray = aria.utils.Array;
            if (!evt || !evt.changedProperties || uArray.contains(evt.changedProperties, "decimalFormatSymbols")
                    || uArray.contains(evt.changedProperties, "currencyFormats")) {
                var symbols = aria.utils.environment.Number.getDecimalFormatSymbols();
                var formats = aria.utils.environment.Number.getCurrencyFormats();
                var exps = this._buildRegEx(symbols.groupingSeparator, symbols.decimalSeparator);

                if (exps.valid) {
                    this._removeGrouping = exps.group;
                    this._replaceDecimal = exps.decimal;
                    this._decimal = symbols.decimalSeparator;
                    this._grouping = symbols.groupingSeparator;
                    this._strictGrouping = symbols.strictGrouping;
                }

                var uType = aria.utils.Type;
                if (!uType.isString(formats.currencyFormat) && !uType.isFunction(formats.currencyFormat)) {
                    this.$logError(this.INVALID_FORMAT, ["currencyFormat", this.CURRENCY_BEAN]);
                    // still valid for building the regular expressions
                } else {
                    this._format = formats.currencyFormat;
                    this._currency = formats.currencySymbol;
                }
            }
        },

        /**
         * Build the Regular Expressions that depends on the symbols used in NumberCfg. Log an error if the separator's
         * format is invalid.
         * @private
         * @param {String} grouping Grouping separator. Single non digit character
         * @param {String} decimal Decimal separator. Single non digit character
         * @return {Object} Object containing the new regular expression
         *
         * <pre>
         * {
         *    group : {RegExp} @see _removeGrouping,
         *    decimal : {RegExp} @see _replaceDecimal,
         *    valid : {Boolean} true if all symbols are valid
         * }
         * </pre>
         */
        _buildRegEx : function (grouping, decimal) {
            var res = {
                valid : true
            };

            if (!grouping || grouping.length > 1 || /\d/.test(grouping)) {
                this.$logError(this.INVALID_FORMAT, ["groupingSeparator", this.DECIMAL_BEAN]);
                res.valid = false;
            }
            if (!decimal || decimal.length > 1 || /\d/.test(decimal)) {
                this.$logError(this.INVALID_FORMAT, ["decimalSeparator", this.DECIMAL_BEAN]);
                res.valid = false;
            }
            if (grouping === decimal) {
                this.$logError(this.INVALID_FORMAT, ["decimalSeparator", this.DECIMAL_BEAN]);
                res.valid = false;
            }

            if (res.valid) {
                res.group = new RegExp(grouping.replace(this._regExSpecials, "\\$1"), "g");
                res.decimal = new RegExp(decimal.replace(this._regExSpecials, "\\$1")); // no "g", max one decimal
            }

            return res;
        },

        /**
         * Normalize the object describing decimal/grouping symbols. Default values are taken from the AppEnvironment,
         * not from the Bean
         * @private
         * @param {aria.utils.environment.NumberCfgBeans.DecimalFormatSymbols} formatSymbols formatting symbols
         * @return {Object} Normalized symbols
         */
        _normalizeSymbols : function (formatSymbols) {
            if (!formatSymbols) {
                formatSymbols = {
                    decimalSeparator : this._decimal,
                    groupingSeparator : this._grouping,
                    strictGrouping : this._strictGrouping
                };
            } else {
                formatSymbols.decimalSeparator = formatSymbols.decimalSeparator || this._decimal;
                formatSymbols.groupingSeparator = formatSymbols.groupingSeparator || this._grouping;
                formatSymbols.strictGrouping = formatSymbols.strictGrouping != null
                        ? formatSymbols.strictGrouping
                        : this._strictGrouping;
            }

            return formatSymbols;
        },

        /**
         * Extract significative information from the currency pattern.
         * @private
         * @param {String} pattern The pattern to be used
         * @return {Object}
         *
         * <pre>
         * {
         *   currencyBegin : {Boolean} true if there's a currency symbol at the beginning of the pattern,
         *   currencyEnd : {Boolean} true if there's a currency symbol at the end of the pattern,
         *   integer : {String} formatting pattern for the integer part (might contain ','),
         *   decimal : {String} formatting pattern for the decimal part,
         *   minIntLen : {Number} minimum number of digits to represent the integer part,
         *   hasGrouping : {Boolean} true if the integer part requires a grouping separator,
         *   regularGroup : {Number} different from undefined if the , is repeated every X characters,
         *   minDecLen : {Number} minimum number of digits to represent the decimal part,
         *   maxDecLen : {Number} maximum number of digits to represent the decimal part
         * }
         * </pre>
         */
        _explode : function (pattern) {
            if (!pattern) {
                pattern = this._format;
            }

            var typeUtil = aria.utils.Type;
            if (typeUtil.isFunction(pattern)) {
                pattern = pattern();
            }

            if (!typeUtil.isString(pattern)) {
                return;
            }

            // check if it's already in cache
            var res = this._cache[pattern];
            if (res) {
                return res;
            }

            var tokens = this._validCurrency.exec(pattern);

            if (tokens) {
                res = {
                    currencyBegin : !!tokens[1],
                    currencyEnd : !!tokens[4],
                    integer : tokens[2],
                    decimal : tokens[3] || "" // decimal is optional
                };

                // Compute the minimum number of characters needed for the integer part
                var stripped = res.integer.replace(/,/g, "");
                var indexOfZero = stripped.indexOf("0");

                res.minIntLen = indexOfZero > -1 ? stripped.length - indexOfZero : 0;
                res.hasGrouping = stripped.length != res.integer.length;
                if (res.hasGrouping) {
                    if (res.integer.length - stripped.length === 1) {
                        // There is only one comma
                        res.regularGroup = res.integer.length - res.integer.indexOf(",") - 1;
                    } else {
                        // There are more commas, excluing the first token, check if there is a simple pattern
                        var patterns = res.integer.split(",");
                        var initialPattern = res.integer.length - res.integer.lastIndexOf(",") - 1;
                        for (var i = 1, len = patterns.length; i < len; i += 1) {
                            if (patterns[i].length != initialPattern) {
                                initialPattern = 0;
                                break;
                            }
                        }
                        res.regularGroup = initialPattern;
                    }
                }

                // do the same for the decimal part
                res.minDecLen = res.decimal.lastIndexOf("0") + 1;
                res.maxDecLen = res.decimal.length;
            }

            this._cache[pattern] = res;
            return res;
        },

        /**
         * Add the grouping symbol to the integer part of a number by following the desired pattern.
         * @private
         * @param {String} integer Integer part of the number
         * @param {Object} patternDescription description of the pattern as returned by this._explode
         * @param {Object} formatSymbols normalized formatting symbols as returned by this._normalizeSymbols
         * @return {String} Integer part of the number containing grouping separator
         */
        _addGrouping : function (integer, patternDescription, formatSymbols) {
            if (!patternDescription.hasGrouping) {
                // No grouping is used in the pattern, no need to do anything
                return integer;
            }

            var grouping = formatSymbols.groupingSeparator, pattern = patternDescription.integer, repeat = patternDescription.regularGroup;
            var lengths = [];

            if (repeat > 0) {
                lengths = repeat;
            } else {
                // The pattern is not regular, build the array for chunk
                var tokens = pattern.split(",");
                for (var i = tokens.length - 1; i > 0; i -= 1) {
                    // The last token shouldn't be considered because it should contain the remainings
                    lengths.push(tokens[i].length);
                }
            }

            return aria.utils.String.chunk(integer, lengths).join(grouping);
        }

    }
});

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

// //////////////////////////////////////////////////////////////////////////////////////////
// IMPORTANT: no modifier should assume `this === aria.templates.Modifiers` holds.
// Use fully qualified path. Beware especially when refering to statics in this.$logWarn etc.
// //////////////////////////////////////////////////////////////////////////////////////////
(function () {
    /**
     * Map of available modifiers
     * @type {Object}
     */
    var regExSpecials, __modifiers = {
        "eat" : {
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Returns "" for any entry.
             * @name aria.templates.Modifiers.prototype.eat
             * @return {String}
             */
            fn : function () {
                return "";
            }
        },
        /* BACKWARD-COMPATIBILITY-BEGIN (deprecate escape modifier) */
        "escape" : {
            /**
             * Initialization function called when the template is parsed
             * @param {aria.templates.ClassWriter} out
             */
            init : function (out) {
                out.addDependencies(["aria.utils.String"]);
            },
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Escape < > & in the given entry.
             * @name aria.templates.Modifiers.prototype.escape
             * @param {String} str the entry
             * @return {String}
             */
            fn : function (s) {
                this.$logWarn(aria.templates.Modifiers.DEPRECATED_ESCAPE_MODIFIER);
                return aria.utils.String.escapeHTML(String(s));
            }
        },
        /* BACKWARD-COMPATIBILITY-END (deprecate escape modifier) */
        "escapeforhtml" : {
            /**
             * Initialization function called when the template is parsed
             * @param {aria.templates.ClassWriter} out
             */
            init : function (out) {
                out.addDependencies(["aria.utils.String"]);
            },
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Use the <a
             * href="http://ariatemplates.com/aria/guide/apps/apidocs/#aria.utils.String:escapeForHTML:method">aria.utils.String.escapeForHTML</a>
             * utility to process the given input, converting the latter to a string before sending it. However this
             * modifier skips the escaping in several cases, returning the value as is (and thus without type
             * conversion):
             * <ul>
             * <li>if the input is null or undefined</li>
             * <li>if the argument passed to control the escaping finally tells not to escape anything</li>
             * </li>
             * @name aria.templates.Modifiers.prototype.escapeForHTML
             * @param input the input value
             * @param arg the argument forwarded to the <a
             * href="http://ariatemplates.com/aria/guide/apps/apidocs/#aria.utils.String:escapeForHTML:method">aria.utils.String.escapeForHTML</a>
             * method. Please refer to its own documentation for more information.
             * @return the processed input value. See detailed description for more information.
             * @see <a
             * href="http://ariatemplates.com/aria/guide/apps/apidocs/#aria.utils.String:escapeForHTML:method">aria.utils.String.escapeForHTML</a>
             */
            fn : function (input, arg) {
                if (input == null) {
                    return input;
                }

                var infos = {};
                var output = aria.utils.String.escapeForHTML(input + '', arg, infos);

                if (!infos.escaped) {
                    return input;
                }

                return output;
            }
        },
        "capitalize" : {
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Returns the entry in capital letters
             * @name aria.templates.Modifiers.prototype.capitalize
             * @param {String} str the entry
             * @return {String}
             */
            fn : function (s) {
                return String(s).toUpperCase();
            }
        },
        "default" : {
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> if str is null or undefined return the default
             * value
             * @name aria.templates.Modifiers.prototype.default
             * @param {String} str the entry
             * @param {String} defaultValue the default value
             * @return {String}
             */
            fn : function (str, defaultValue) {
                if (str != null) {
                    return str;
                }

                return defaultValue;
            }
        },
        "empty" : {
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> if str is not defined or empty string "", or
             * string composed of whitespaces, return the default value
             * @name aria.templates.Modifiers.prototype.empty
             * @param {String} str the entry
             * @param {String} defaultValue the default value
             * @return {String}
             */
            fn : function (str, defaultValue) {
                if (!!str && !/^\s*$/.test(str)) {
                    return str;
                }

                return defaultValue;
            }
        },
        "pad" : {
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Pad the string with the provided padding
             * character(s) or non-breaking spaces
             * @name aria.templates.Modifiers.prototype.pad
             * @param {String} str the entry
             * @param {Integer} sz the targeted size for the result string
             * @param {Boolean} begin tells if the padding must be added at the beginning (true) or at the end (false)
             * of the string - Default is false
             * @param {String} padStr the HTML string to be used for padding. Default is '&nbsp;'. Note that if this
             * string has javascript length > 1, it will still be used in its entirety for padding, the same number of
             * times as if it was one-character only. This might be useful mainly for passing HTML entities.
             * @return {String}
             */
            fn : function (str, sz, begin, padStr) {
                str = '' + str; // force cast to string
                padStr = padStr || '&nbsp;'; // empty padding string doesn't make sense
                var lgth = str.length;
                if (lgth < sz) {
                    var beg = (begin === true);
                    var a = [], diff = sz - lgth;
                    if (!beg) {
                        a.push(str);
                    }
                    for (var i = 0; diff > i; i++) {
                        a.push(padStr);
                    }
                    if (beg) {
                        a.push(str);
                    }
                    return a.join('');
                }
                return str;
            }
        },
        "dateformat" : {
            /**
             * Initialisation function called when the template is parsed
             * @param {aria.templates.ClassWriter} out
             */
            init : function (out) {
                out.addDependencies(["aria.utils.Date", "aria.utils.Type"]);
            },
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Format a date with a given pattern
             * @name aria.templates.Modifiers.prototype.dateformat
             * @param {Date} date the given entry
             * @param {String} pattern the date pattern
             * @return {String} formatted date
             */
            fn : function (date, pattern) {
                if (aria.utils.Type.isDate(date)) {
                    return aria.utils.Date.format(date, pattern);
                } else {
                    this.$logError(aria.templates.Modifiers.DATEFORMAT_MODIFIER_ENTRY, [date]);
                }
            }
        },
        "timeformat" : {
            /**
             * Initialisation function called when the template is parsed
             * @param {aria.templates.ClassWriter} out
             */
            init : function (out) {
                out.addDependencies(["aria.utils.Date", "aria.utils.Type"]);
            },
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Format a time with a given pattern
             * @name aria.templates.Modifiers.prototype.timeformat
             * @param {Date} time for the given entry
             * @param {String} pattern applied to time
             * @return {String} formatted time
             */
            fn : function (time, pattern) {
                if (aria.utils.Type.isDate(time)) {
                    return aria.utils.Date.format(time, pattern);
                } else {
                    this.$logError(aria.templates.Modifiers.DATEFORMAT_MODIFIER_ENTRY, [time]);
                }
            }

        },
        "highlightfromnewword" : {
            /**
             * Initialisation function called when the template is parsed
             * @param {aria.templates.ClassWriter} out
             */
            init : function (out) {
                out.addDependencies(["aria.utils.String", "aria.utils.Type"]);
            },
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Will highlight with &lt:strong&gt; tag the first
             * occurrence of the entry (starting from a new word - won't highlight in the middle of the word) if it
             * matches the highlight value.
             * @name aria.templates.Modifiers.prototype.highlightfromnewword
             * @param {String} str the entry
             * @param {String} highlight the default value
             * @return {String}
             */
            fn : function (str, highlight) {
                var ariaUtil = aria.utils, highlightLen = highlight.length;
                if (ariaUtil.Type.isString(str) && highlightLen) {
                    highlight = highlight.toLowerCase();
                    var strLowerCased = str.toLowerCase(), firstOccurrenceIdx;
                    if (strLowerCased.indexOf(highlight) === 0) {
                        firstOccurrenceIdx = 0;
                    } else {
                        var highlightRegexSafe = highlight.replace(regExSpecials, "\\$1");
                        var regexResult = new RegExp("\\s" + highlightRegexSafe, "i").exec(strLowerCased);
                        if (!regexResult) {
                            return str;
                        } else {
                            firstOccurrenceIdx = regexResult.index + 1; // +1 for matched whitespace
                        }
                    }
                    var a = firstOccurrenceIdx;
                    var b = firstOccurrenceIdx + highlightLen;
                    var middleOriginal = str.substring(a, b);
                    var middle = ariaUtil.String.stripAccents(middleOriginal).toLowerCase();
                    if (middle === highlight) {
                        return str.substring(0, a) + "<strong>" + middleOriginal + "</strong>" + str.substring(b);
                    }
                }
                return str;
            }
        },
        "starthighlight" : {
            /**
             * Initialisation function called when the template is parsed
             * @param {aria.templates.ClassWriter} out
             */
            init : function (out) {
                out.addDependencies(["aria.utils.String", "aria.utils.Type"]);
            },
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Will highlight with &lt:strong&gt; tag the
             * begining of the entry if it match the highligh value
             * @name aria.templates.Modifiers.prototype.starthighlight
             * @param {String} str the entry
             * @param {String} highlight the default value
             * @return {String}
             */
            fn : function (str, highlight) {
                if (aria.utils.Type.isString(str) && highlight.length) {
                    var beginning = aria.utils.String.stripAccents(str.substring(0, highlight.length)).toLowerCase();
                    highlight = highlight.toLowerCase();
                    if (beginning === highlight) {
                        return "<strong>" + str.substring(0, highlight.length) + "</strong>"
                                + str.substring(highlight.length);
                    }
                }
                return str;
            }
        },
        "highlight" : {
            /**
             * Initialisation function called when the template is parsed
             * @param {aria.templates.ClassWriter} out
             */
            init : function (out) {
                out.addDependencies(["aria.utils.String", "aria.utils.Type"]);
            },
            /**
             * <span style="font-weight: bold">MODIFIER</span> <br/> Will highlight with &lt;strong&gt; tag the
             * beginning of a word that matches any of the words in the highlight value.
             * @example
             * Given the input string, str: "Using highlight"
             * and the matching string, highlight: "us hi"
             * The return value is
             * <strong>Us</strong>ing <strong>hi</strong>ghlight
             * @name aria.templates.Modifiers.prototype.highlight
             * @param {String} str the entry, words are separated by blank space
             * @param {String} highlight words that should be higlighted, separated by blank space
             * @return {String}
             */
            fn : function (str, highlight) {
                if (aria.utils.Type.isString(str) && aria.utils.Type.isString(highlight)) {
                    var toBeMatched = str.split(" ");
                    // sort toBeHighlighted by longest running match
                    var toBeHighlighted = highlight.split(" ").sort(function (first, second) {
                        var aLen = first.length, bLen = second.length;
                        return aLen === bLen ? 0 : (aLen < bLen ? 1 : -1);
                    });
                    aria.utils.Array.forEach(toBeMatched, function (value, index, array) {
                        for (var i = 0, len = toBeHighlighted.length; value && i <= len; i += 1) {
                            if (toBeHighlighted[i] == null || toBeHighlighted[i] === "") {
                                continue;
                            }
                            var frmtdHighlightStr = toBeHighlighted[i].replace(regExSpecials, "\\$1");
                            var highlightStr = new RegExp('\\b' + frmtdHighlightStr, 'gim');
                            if (!!frmtdHighlightStr.match(/\(/)) {
                                highlightStr = new RegExp('[\\b\\(]' + frmtdHighlightStr.replace('\\(', ''), 'gim');
                            }
                            var replaceArr = highlightStr.exec(value);
                            if (replaceArr != null && replaceArr.length > 0) {
                                var replaceStr = "<strong>" + replaceArr[0] + "</strong>";
                                array[index] = value.replace(highlightStr, replaceStr);
                                if (!!value.match(highlightStr)) {
                                    break;
                                }
                            }
                        }
                    });
                    return toBeMatched.join(" ");
                }

                return str;
            }
        }
    };

    /**
     * Template modifiers. Modifiers can be used inside the template syntax
     *
     * <pre>
     * ${'some text'|modifier}
     * </pre>
     *
     * <span style="font-weight: bold">WARNING</span>: below in the <span style="font-style: italic">Public methods</span>
     * section you will see a bunch of methods corresponding to the actual modifier functions. The implementation behind
     * however does not give access to those methods directly. To call them, please use the method <span
     * style="font-style: italic">callModifiers</span> instead, like this:
     *
     * <pre>
     * aria.templates.Mofifiers.callModifier('modifierName', [param1, param2, ...]);
     * </pre>
     *
     * Concerned methods are marked as <span style="font-weight: bold">MODIFIER</span> at the beginning of their
     * descriptions.
     * @singleton
     */
    Aria.classDefinition({
        $classpath : "aria.templates.Modifiers",
        $singleton : true,
        $constructor : function () {
            regExSpecials = new RegExp("(\\" + "/.*+?|()[]{}\\".split("").join("|\\") + ")", "g");
        },
        $statics : {
            UNKNOWN_MODIFIER : "Unknown modifier %1.",
            /* BACKWARD-COMPATIBILITY-BEGIN (deprecate escape modifier) */
            DEPRECATED_ESCAPE_MODIFIER : "Escape modifier is deprecated, please use escapeforhtml modifier instead",
            /* BACKWARD-COMPATIBILITY-END (deprecate escape modifier) */
            DATEFORMAT_MODIFIER_ENTRY : "Entry %1 is not a date."
        },
        $prototype : {
            /**
             * Call the modifier function of a modifier object
             * @param {String} modifierName
             * @param {Array} params
             */
            callModifier : function (modifierName, params) {
                // IMPORTANT: neither this method, nor any modifier, should assume
                // that `this === aria.templates.Modifiers` holds,
                // as they're copied in aria.core.Template (so 'this' is most of the time
                // an object extending aria.core.Template)
                modifierName = "" + modifierName;
                var modifier = __modifiers[modifierName.toLowerCase()];
                if (modifier) {
                    // call the modifier with this, so that this.$log is available
                    return modifier.fn.apply(this, params);
                } else {
                    this.$logError(aria.templates.Modifiers.UNKNOWN_MODIFIER, [modifierName]);
                }
            },

            /**
             * call the init function of a modifier object if it exists. This is done when the template is processed.
             * @param {String} modifierName
             * @param {aria.templates.ClassWriter} out
             */
            initModifier : function (modifierName, out) {
                var modifier = __modifiers[modifierName];
                if (modifier && modifier.init) {
                    modifier.init(out);
                }
            }
        }
    });
})();

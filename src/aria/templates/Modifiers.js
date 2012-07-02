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

(function () {
    /**
     * Map of available modifiers
     * @type {Object}
     */
    var regExSpecials, __modifiers = {
        "eat" : {
            /**
             * Returns "" for any entry.
             * @name aria.templates.Modifiers.eat
             * @return {String}
             */
            fn : function () {
                return "";
            }
        },
        "escape" : {
            /**
             * Initialisation function called when the template is parsed
             * @param {aria.templates.ClassWriter} out
             */
            init : function (out) {
                out.addDependencies(["aria.utils.String"]);
            },
            /**
             * Escape < > & in the given entry.
             * @name aria.templates.Modifiers.escape
             * @param {String} str the entry
             * @return {String}
             */
            fn : function (s) {
                return aria.utils.String.escapeHTML(String(s));
            }
        },
        "capitalize" : {
            /**
             * Returns the entry in capital letters
             * @name aria.templates.Modifiers.capitalize
             * @param {String} str the entry
             * @return {String}
             */
            fn : function (s) {
                return String(s).toUpperCase();
            }
        },
        "default" : {
            /**
             * if str is not defined or empty string "" return the default value
             * @name aria.templates.Modifiers.default
             * @param {String} str the entry
             * @param {String} defaultValue the default value
             * @return {String}
             */
            fn : function (str, defaultValue) {
                return str != null ? str : defaultValue;
            }
        },
        "empty" : {
            /**
             * if str is not defined or empty string "", or string composed of whitespaces, return the default value
             * @name aria.templates.Modifiers.empty
             * @param {String} str the entry
             * @param {String} defaultValue the default value
             * @return {String}
             */
            fn : function (str, defaultValue) {
                return !!str && !/^\s*$/.test(str) ? str : defaultValue;
            }
        },
        "pad" : {
            /**
             * Pad the string with non-breaking spaces
             * @name aria.templates.Modifiers.pad
             * @param {String} str the entry
             * @param {Integer} sz the targetted size for the result string
             * @param {Boolean} begin tells if the padding must be added at the beginning (true) or at the end (false)
             * of the string - Default is false
             * @return {String}
             */
            fn : function (str, sz, begin) {
                str = '' + str; // force cast to string
                var lgth = str.length;
                if (lgth < sz) {
                    var beg = (begin == true);
                    var a = [], diff = sz - lgth, sp = '&nbsp;'
                    if (!beg) {
                        a.push(str);
                    }
                    for (var i = 0; diff > i; i++) {
                        a.push(sp);
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
             * Format a date with a given pattern
             * @name aria.templates.Modifiers.dateformat
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
             * Format a time with a given pattern
             * @name aria.templates.Modifiers.timeformat
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
        "starthighlight" : {
            /**
             * Initialisation function called when the template is parsed
             * @param {aria.templates.ClassWriter} out
             */
            init : function (out) {
                out.addDependencies(["aria.utils.String", "aria.utils.Type"]);
            },
            /**
             * Will highlight with &lt:strong&gt; tag the begining of the entry if it match the highligh value
             * @name aria.templates.Modifiers.starthighlight
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
             * Will highlight with &lt;strong&gt; tag the begining of a word that matches any of the words in the
             * highligh value.
             * @example
             * Given the input string, str: "Using highlight"
             * and the matching string, highlight: "us hi"
             * The return value is
             * <strong>Us</strong>ing <strong>hi</strong>ghlight
             * @name aria.templates.Modifiers.highlight
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
                            if (toBeHighlighted[i] == undefined || toBeHighlighted[i] == "") {
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
     * @class aria.templates.Modifiers Template modifiers
     * @extends aria.core.JsObject
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
            DATEFORMAT_MODIFIER_ENTRY : "Entry %1 is not a date."
        },
        $prototype : {
            /**
             * call the modifier function of a modifier object
             * @param {String} modifierName
             * @param {Array} params
             */
            callModifier : function (modifierName, params) {
                // this method should not suppose 'this' is aria.templates.Modifiers,
                // as it is copied in aria.core.Template (so 'this' is most of the time
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
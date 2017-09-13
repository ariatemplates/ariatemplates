/*
 * Copyright 2015 Amadeus s.a.s.
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
var ariaUtilsString = require("../utils/String");
var ariaUtilsArray = require("../utils/Array");

/**
 * Class to be extended to create a template test case which checks the behavior with
 * the Jaws screen reader. It contains method to help checking what Jaws said.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.JawsTestCase",
    $extends : require("./RobotTestCase"),
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        /**
         * Lines matching one of those regular expressions are considered noise and will be removed by removeNoise.
         */
        this.noiseRegExps = [/^(Aria Templates tests frame|Aria Templates tests document|New tab page)$/i];
    },
    $prototype : {
        /**
         * If set to true, normalizeSpaces is not called in filterJawsHistory.
         */
        skipNormalizeSpaces: false,

        /**
         * If set to true, removeNoise is not called in filterJawsHistory
         */
        skipRemoveNoise: false,

        /**
         * If set to true, removeDuplicates is not called in filterJawsHistory.
         */
        skipRemoveDuplicates: false,

        /**
         * Private helper function, starts the tests once the template has been successfully loaded and rendered
         */
        _startTests : function () {
            // automatically clear Jaws history before starting the test
            this.clearJawsHistory(this.$RobotTestCase._startTests);
        },

        /**
         * Creates an empty text area that completely fills the test document, with a high zIndex,
         * and returns its reference.
         */
        _createFullScreenTextArea : function () {
            var textArea = this.testDocument.createElement("textarea");
            var textAreaStyle = textArea.style;
            textAreaStyle.position = "absolute";
            textAreaStyle.display = "block";
            textAreaStyle.top = "0px";
            textAreaStyle.left = "0px";
            textAreaStyle.width = "100%";
            textAreaStyle.height = "100%";
            textAreaStyle.zIndex = "999999";
            this.testDocument.body.appendChild(textArea);
            return textArea;
        },

        /**
         * Sends the keyboard events necessary to clear Jaws history.
         * In case Jaws is not running, the test is ended.
         * @param {aria.core.CfgBeans:Callback} cb
         */
        clearJawsHistory : function (cb) {
            var textArea = this._createFullScreenTextArea();
            this.synEvent.execute([
                ["click", textArea],
                ["pause", 1000],
                ["type", null, "[<insert>][space][>insert<][<shift>]h[>shift<]"],
                ["pause", 2000]
            ],{
                fn: function () {
                    var textAreaContent = textArea.value;
                    textArea.parentNode.removeChild(textArea);
                    // if there is something in the text area, there is something
                    // wrong in the setup (e.g.: JAWS not enabled or wrong robot
                    // implementation)
                    if (textAreaContent === "") {
                        this.$callback(cb);
                    } else {
                        // ends the test
                        this.raiseFailure("JAWS is not running or wrong robot implementation");
                        this.end();
                    }

                },
                scope: this
            });
        },

        /**
         * Sends the keyboard/mouse events necessary to retrieve Jaws history.
         * The raw history is returned without any processing.
         * @param {aria.core.CfgBeans:Callback} cb
         */
        retrieveJawsHistory : function (cb) {
            var textArea = this._createFullScreenTextArea();
            this.synEvent.execute([
                ["type", null, "[<insert>][space][>insert<]h"], // displays history window
                ["pause", 3000],
                ["type", null, "[<ctrl>]a[>ctrl<]"], // selects the whole text
                ["pause", 1000],
                ["type", null, "[<ctrl>]c[>ctrl<]"], // copies the history to the clipboard
                ["pause", 1000],
                ["type", null, "[<ctrl>]a[>ctrl<]"], // selects the whole text
                ["pause", 1000],
                ["type", null, "[<ctrl>]c[>ctrl<]"], // copies the history to the clipboard
                ["pause", 1000],
                ["type", null, "[<alt>][F4][>alt<]"], // closes history window
                ["pause", 2000],
                ["click", textArea], // clicks on the text area
                ["pause", 2000],
                ["type", null, "[<ctrl>]v[>ctrl<]"], // pastes the whole history in our text area
                ["pause", 2000]
            ], {
                fn: function () {
                    textArea.parentNode.removeChild(textArea);
                    this.$callback(cb, textArea.value);
                },
                scope: this
            });
        },

        /**
         * Applies usual Jaws history filters.
         */
        filterJawsHistory: function (response) {
            if (!this.skipNormalizeSpaces) {
                response = this.normalizeSpaces(response);
            }
            if (!this.skipRemoveNoise) {
                response = this.removeNoise(response);
            }
            if (!this.skipRemoveDuplicates) {
                response = this.removeDuplicates(response);
            }
            return response;
        },

        /**
         * Retrieves Jaws history (with this.retrieveJawsHistory), filters it with
         * both filterJawsHistory and the provided filter function and asserts that
         * the result is equal to the expected string.
         * @param {aria.core.CfgBeans:Callback} cb
         * @param {function} filterFn optionnal. The filter function to apply to the response.
         */
        assertJawsHistoryEquals : function (expectedOutput, callback, filterFn) {
            this.retrieveJawsHistory({
                fn: function (response) {
                    var originalResponse = response;

                    response = this.filterJawsHistory(response);
                    if (filterFn) {
                        response = filterFn.call(this, response);
                    }
                    var changed = response !== originalResponse;

                    var message = [];
                    if (changed) {
                        message.push('History was filtered');
                    } else {
                        message.push('History was not filtered');
                    }
                    message.push("JAWS history" + (changed ? ' (filtered)' : '') + ":", "", response, "");
                    message.push("Expected history:", "", expectedOutput, "");

                    if (changed) {
                        message.push("JAWS history (original): ", "", originalResponse, "");
                    }
                    message = message.join('\n');

                    this.assertEquals(response, expectedOutput, message);
                    this.$callback(callback);
                },
                scope: this
            });
        },

        /**
         * Removes lines which introduce noise in the Jaws history.
         * @param {String} response JAWS response to be processed
         * @return {String}
         */
        removeNoise : function (response) {
            return this.removeMatchingLines(response, this.noiseRegExps);
        },

        /**
         * Removes lines which match the given regular expressions.
         * @param {String} response JAWS response to be processed
         * @param {Array} regExps array of regular expressions
         * @return {String}
         */
        removeMatchingLines : function (response, regExps) {
            var l = regExps.length;
            var lines = ariaUtilsString.trim(response).split("\n");
            lines = ariaUtilsArray.filter(lines, function (line) {
                for (var i = 0; i < l; i++) {
                    if (regExps[i].test(line)) {
                        return false;
                    }
                }
                return true;
            });
            return lines.join("\n");
        },

        /**
         * Normalizes spaces in Jaws history, including:
         * - removing spaces at the beginning and the end of each line
         * - replacing multiples consecutive spaces by a single one
         * - removing blank lines
         * @param {String} response JAWS response to be processed
         * @return {String}
         */
        normalizeSpaces : function (response) {
            var lines = ariaUtilsString.trim(response).split("\n");
            for (var i = lines.length - 1; i >= 0; i--) {
                var curLine = lines[i];
                curLine = curLine.replace(/\s+/g, " ");
                curLine = ariaUtilsString.trim(curLine);
                if (curLine) {
                    lines[i] = curLine;
                } else {
                    lines.splice(i, 1);
                }
            }
            return lines.join("\n");
        },

        /**
         * Removes duplicate lines
         * @param {String} response JAWS response to be processed
         * @return {String}
         */
        removeDuplicates : function (response) {
            return response.replace(/(^|\n)(.*)(\n\2)+(?=\n|$)/ig, "$1$2");
        }
    }
});

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
var ariaUtilsJson = require("../utils/Json");

/**
 * Class to be extended to create a template test case which checks the behavior with
 * the Jaws screen reader. It contains method to help checking what Jaws said.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.JawsTestCase",
    $extends : require("./RobotTestCase"),
    $prototype : {
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
         * The raw history is processed to make it easier to compare between
         * several executions.
         * @param {aria.core.CfgBeans:Callback} cb
         */
        retrieveJawsHistory : function (cb) {
            var textArea = this._createFullScreenTextArea();
            this.synEvent.execute([
                ["type", null, "[<insert>][space][>insert<]h"], // displays history window
                ["pause", 2000],
                ["type", null, "[<ctrl>]a[>ctrl<][<ctrl>]c[>ctrl<]"], // copies the whole history in the clipboard
                ["pause", 1000],
                ["type", null, "[<alt>][F4][>alt<]"], // closes history window
                ["click", textArea],
                ["type", null, "[<ctrl>]v[>ctrl<]"], // pastes history in our text area
                ["pause", 2000]
            ], {
                fn: function () {
                    textArea.parentNode.removeChild(textArea);
                    var textAreaContent = textArea.value;
                    var globalFilterRegExp = /^(Aria Templates tests frame|Aria Templates tests document|New tab page)$/gi;
                    var lines = ariaUtilsString.trim(textAreaContent).split("\n");
                    for (var i = lines.length - 1; i >= 0; i--) {
                        var curLine = lines[i];
                        curLine = curLine.replace(/\s+/g, " ");
                        curLine = ariaUtilsString.trim(curLine);
                        if (curLine && !globalFilterRegExp.test(curLine)) {
                            lines[i] = curLine;
                        } else {
                            lines.splice(i, 1);
                        }
                    }

                    textAreaContent = lines.join("\n");
                    this.$callback(cb, textAreaContent);
                },
                scope: this
            });
        },

        /**
         * Retrieves Jaws history (with this.retrieveJawsHistory) and
         * asserts that it is equal to the expected string.
         * @param {aria.core.CfgBeans:Callback} cb
         * @param {function} filterFn optionnal. The filter function to apply to the response.
         */
        assertJawsHistoryEquals : function (expectedOutput, callback, filterFn) {
            this.retrieveJawsHistory({
                fn: function (response) {
                    var originalResponse = response;

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
                    message.push("JAWS history" + (changed ? ' (filtered)' : '') + ": " + ariaUtilsJson.convertToJsonString(response));
                    message.push("Expected history: " + ariaUtilsJson.convertToJsonString(expectedOutput));

                    if (changed) {
                        message.push("JAWS history (original): " + ariaUtilsJson.convertToJsonString(originalResponse));
                    }
                    message = message.join('.\n') + '.';

                    this.assertEquals(response, expectedOutput, message);
                    this.$callback(callback);
                },
                scope: this
            });
        },

        /**
         * Remove duplicate sentences
         * @param {String} response JAWS response to be processed
         */
        removeDuplicates : function (response) {
            var lines = response.split("\n");
            var newLines = [lines[0]];
            for(var i = 1, ii = lines.length; i < ii; i++) {
                var line = lines[i];
                if (line != lines[i - 1]) {
                    newLines.push(line);
                }
            }
            return newLines.join("\n");
        }
    }
});

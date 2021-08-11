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
var ariaUtilsJson = require("../utils/Json");
var ariaUtilsType = require("../utils/Type");
var ariaJsunitHelpersExecuteFactory = require("./helpers/ExecuteFactory");

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

        /**
         * Text read by JAWS from last check or last call to forgetJawsHistory.
         */
        this.jawsText = [];

        /**
         * Array of listeners on Jaws text.
         * Each listener is an object with a test property containing a regular expression and a callback property
         * that will be called in case the regular expression matches what Jaws said.
         */
        this.jawsListeners = [];

        /**
         * Array of user input actions executed by the test, along with the text Jaws actually read.
         * The content of this array has the same format as the argument expected by the execute function.
         * It is printed at the end of the test so that it is easy to copy and paste it to update a
         * test to match what Jaws said.
         */
        this.recordedActions = [];

        /**
         * JAWS listener causing a failure of the test.
         * By default, it is called when Jaws says "Forms mode".
         * It can be unregistered with this.unregisterJawsListener(this.forbiddenJawsTextListener),
         * or its match property can be adapted for other needs.
         */
        this.forbiddenJawsTextListener = {
            match: [/^\s*(Forms\s+mode)\s*$/i],
            fn: this.lastJawsTextFailure,
            scope: this
        };

        this.registerJawsListener(this.forbiddenJawsTextListener);
    },
    $destructor : function () {
        var unregisterListener = this._unregisterJawsListener;
        if (unregisterListener) {
            this._unregisterJawsListener = null;
            unregisterListener();
        }
        this.$RobotTestCase.$destructor.call(this);
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
         * If set to true, clearJawsHistory is not automatically called before the test starts.
         */
        skipClearHistory: false,

        /**
         * Keeps a reference to the function that allows to unregister JAWS listener.
         */
        _unregisterJawsListener: null,

        /**
         * Methods that can be called with this.execute (in addition to the ones defined in aria.jsunit.SynEvents)
         */
        _methods: {
            waitForJawsToSay: 1,
            forgetJawsHistory: 0,
            clearJawsHistory: 0,
            registerJawsListener: 1,
            unregisterJawsListener: 1
        },

        /**
         * Private helper function, starts the tests once the template has been successfully loaded and rendered
         */
        _startTests : function () {
            if (!this._unregisterJawsListener) {
                var top = Aria.$window.top;
                if (top.registerJawsListener) {
                    this._unregisterJawsListener = Aria.$window.top.registerJawsListener(this.onJawsTalk, this);
                    this.$logInfo("Registered JAWS listener");
                } else {
                    this.fail("JAWS listener could not be registered");
                }
            }
            if (this.skipClearHistory) {
                this.$RobotTestCase._startTests.call(this);
            } else {
                // automatically clear Jaws history before starting the test
                this.clearJawsHistory(this.$RobotTestCase._startTests);
            }
        },

        /**
         * Execute a sequence of asynchronous actions.
         * @param {Array} actions array of actions to execute. Each action is an array with a string
         * as the first item (specifying the name of the function to call), followed by the arguments
         * for that function. The list of available actions include, in addition to the actions available
         * with aria.jsunit.SynEvents.execute:
         * - waitForJawsToSay
         * - forgetJawsHistory
         * - clearJawsHistory
         * - registerJawsListener
         * - unregisterJawsListener
         * @param {aria.core.CfgBeans:Callback} cb callback called when the sequence of actions has
         * successfully been executed.
         */
        execute : ariaJsunitHelpersExecuteFactory.createExecuteFunction(function (methodName) {
            var args = this._methods[methodName];
            var actionInfo = args == null ? this.synEvent.execute.getActionInfo.call(this.synEvent, methodName) : {
                args: args,
                scope: this,
                fn: this[methodName]
            };
            if (actionInfo != null) {
                if (!this.recordedActions || methodName === "waitForJawsToSay") {
                    // don't record this action in this.recordedActions
                    return actionInfo;
                }
                return {
                    args: actionInfo.args,
                    scope: this,
                    fn: function () {
                        var action = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                        action.unshift(methodName);
                        this.recordedActions.push(action);
                        return actionInfo.fn.apply(actionInfo.scope, arguments);
                    }
                };
            }
        }),

        /**
         * Method that is globally registered as a JAWS listener.
         * It is called each time JAWS says something.
         * This method logs the text JAWS said and calls listeners
         * registered locally with this.registerJawsListener.
         * @param {String} text what JAWS says
         */
        onJawsTalk : function (text) {
            this.$logInfo("JAWS says:\n%1", [text]);
            if (this.recordedActions) {
                this.recordedActions.push(["waitForJawsToSay", ariaUtilsString.trim(text)]);
            }
            this.jawsText.push(text);
            for (var i = 0, l = this.jawsListeners.length; i < l; i++) {
                var currentListener = this.jawsListeners[i];
                var match = currentListener.match;
                if (match && !this.isMatch(text, match)) {
                    continue;
                }
                this.$callback(currentListener, text);
            }
        },

        /**
         * Registers a listener to be called when Jaws says something.
         * @param {aria.core.CfgBeans:Callback} listener listener to be called. In addition to the classic
         * callback fields, it is possible to specify an extra "match" field to specify an expression that
         * is matched with what Jaws said. The listener will then only be called if what Jaws said matches
         * the expression. The match expression must be of a type supported by the second argument of the
         * isMatch method.
         * @param {aria.core.CfgBeans:Callback} cb callback called synchronously after the listener has been
         * registered.
         */
        registerJawsListener : function (listener, cb) {
            this.jawsListeners.push(listener);
            this.$callback(cb);
        },

        /**
         * Unregisters a listener previously registered with registerJawsListener.
         * @param {aria.core.CfgBeans:Callback} listener the exact reference to the argument previously passed to
         * registerJawsListener.
         * @param {aria.core.CfgBeans:Callback} cb callback called synchronously after the listener has been unregistered.
         */
        unregisterJawsListener : function (listener, cb) {
            ariaUtilsArray.remove(this.jawsListeners, listener);
            this.$callback(cb);
        },

        /**
         * Forgets what Jaws said recently which was stored in this.jawsText.
         * Note that this is very different from what clearJawsHistory does.
         * @param {aria.core.CfgBeans:Callback} cb callback called synchronously after the jawsText array has been cleared.
         */
        forgetJawsHistory : function (cb) {
            this.jawsText = [];
            this.$callback(cb);
        },

        /**
         * Fails the test with a "Forbidden Jaws text" error message, quoting the last item Jaws said.
         */
        lastJawsTextFailure : function () {
            try {
                this.fail("Forbidden Jaws text: " + this.jawsText[this.jawsText.length - 1]);
            } catch (error) {
                this.handleAsyncTestError(error);
            }
        },

        /**
         * Waits for JAWS to say something.
         * @param {String|Object} arg argument describing what Jaws is expected to say. It has the same
         * type as the argument of the checkJawsText method.
         * @param {aria.core.CfgBeans:Callback} cb callback that is called when Jaws has said what it
         * was expected to say.
         */
        waitForJawsToSay : function (arg, cb) {
            this.waitFor({
                condition: {
                    resIndex: -1,
                    fn: this.checkJawsText,
                    args: arg
                },
                msg: "waitForJawsToSay(" + ariaUtilsJson.convertToJsonString(arg) + ")",
                callback: cb
            });
        },

        /**
         * Returns true if the given jawsText matches the expected expression.
         * @param {String} jawsText text that Jaws said
         * @param {String|RegExp|Function|Array} expected match expression, which can be:
         * - a string: it matches if the string is found inside jawsText
         * - a regular expression: it matches if the test method of the regular expression called with
         * jawsText returns a truthy value
         * - a function: it matches if the function returns a truthy value when called with jawsText
         * - an array of items of the previous types: it matches if one of the items matches (OR operator)
         */
        isMatch : function (jawsText, expected) {
            if (ariaUtilsType.isArray(expected)) {
                for (var i = 0, l = expected.length; i < l; i++) {
                    if (this.isMatch(jawsText, expected[i])) {
                        return true;
                    }
                }
                return false;
            } else if (ariaUtilsType.isString(expected)) {
                return this.normalizeSpaces(jawsText).indexOf(this.normalizeSpaces(expected)) > -1;
            } else if (ariaUtilsType.isRegExp(expected)) {
                return expected.test(jawsText);
            } else if (ariaUtilsType.isFunction(expected)) {
                return expected(jawsText);
            } else {
                throw new Error("Unexpected type for isMatch!");
            }
        },

        /**
         * Checks whether Jaws has said what is described by the argument.
         * If Jaws has said it, unless the skipClear property is set to true, the history
         * until the matched text is cleared.
         * @param {Object|String|RegExp|Function|Array} arg If this argument is an object,
         * it can have the following properties:
         * - find [String|RegExp|Function|Array] expression (same type as the second
         * parameter of the isMatch method) that is looked for in what Jaws said (this.jawsText).
         * - skipClear [Boolean]
         * If the argument is not an object, it is supposed to directly be the value of
         * the find property described above.
         * @returns {Boolean} true if Jaws said the expected text, false if it did not yet
         */
        checkJawsText : function (arg) {
            if (!ariaUtilsType.isObject(arg)) {
                arg = {
                    find: arg,
                    skipClear: false
                };
            }
            var jawsText = this.jawsText;
            var foundIndex = -1;
            for (var i = 0, l = jawsText.length; i < l; i++) {
                if (this.isMatch(jawsText[i], arg.find)) {
                    // found!
                    foundIndex = i;
                    break;
                }
            }
            if (foundIndex == -1) {
                return false;
            }
            if (!arg.skipClear) {
                jawsText.splice(0, foundIndex + 1);
            }
            return true;
        },

        /**
         * Logs the recordedActions array and clears it.
         * This method is automatically called at the end of the test.
         */
        logRecordedActions : function () {
            if (this.recordedActions && this.recordedActions.length > 0) {
                var output = ariaUtilsArray.map(this.recordedActions, function (item) {
                    return ariaUtilsJson.convertToJsonString(item);
                });
                this.$logInfo("Recorded actions: [\n%1\n]", [output.join(",\n")]);
                this.recordedActions = [];
            }
        },

        /**
         * Call this method (or rather the "end" method that is simply an alias of this one) from your Jaws
         * test case when the test is finished.
         */
        notifyTemplateTestEnd : function () {
            this.logRecordedActions();
            this.$RobotTestCase.notifyTemplateTestEnd.call(this);
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
            var savedRecordedActions = this.recordedActions;
            this.recordedActions = null;
            var textArea = this._createFullScreenTextArea();
            this.execute([
                ["click", textArea],
                ["waitFocus", textArea],
                ["forgetJawsHistory"],
                ["type", null, "[<insert>][space][>insert<][<shift>]h[>shift<]"],
                ["waitForJawsToSay","Speech history cleared"]
            ], {
                fn: function () {
                    var textAreaContent = textArea.value;
                    textArea.parentNode.removeChild(textArea);
                    // if there is something in the text area, there is something
                    // wrong in the setup (e.g.: JAWS not enabled or wrong robot
                    // implementation)
                    this.recordedActions = savedRecordedActions;
                    if (textAreaContent === "") {
                        this.jawsText = [];
                        this.$callback(cb);
                    } else {
                        // ends the test
                        this.raiseFailure("JAWS is not running or wrong robot implementation (text area contains: " + ariaUtilsJson.convertToJsonString(textAreaContent) + ")");
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
            var nothingSelectedListener = {
                match: /^Nothing\s+selected/i,
                scope: this,
                fn: function () {
                    this.$logInfo("'Nothing selected' detected! Trying again to send CTRL+A and CTRL+C!");
                    this.execute([
                        ["type", null, "[<ctrl>]a[>ctrl<]"], // selects the whole history
                        ["waitForJawsToSay", "selected"],
                        ["type", null, "[<ctrl>]c[>ctrl<]"] // copies the whole history in the clipboard
                    ]);
                }
            };
            var savedRecordedActions = this.recordedActions;
            this.recordedActions = null;
            var textArea = this._createFullScreenTextArea();
            this.execute([
                ["forgetJawsHistory"],
                ["type", null, "[<insert>][space][>insert<]h"], // displays history window
                ["waitForJawsToSay", "Speech History"],
                ["pause", 500],
                ["type", null, "[<ctrl>]a[>ctrl<]"], // selects the whole history
                ["waitForJawsToSay", "selected"],
                ["registerJawsListener", nothingSelectedListener],
                ["type", null, "[<ctrl>]c[>ctrl<]"], // copies the whole history in the clipboard
                ["waitForJawsToSay", "Copied selection to clipboard"],
                ["unregisterJawsListener", nothingSelectedListener],
                ["type", null, "[<alt>][F4][>alt<]"], // closes history window
                ["pause", 500],
                ["click", textArea],
                ["waitFocus", textArea],
                ["type", null, "[<ctrl>]v[>ctrl<]"], // pastes history in our text area
                ["waitForJawsToSay", "Pasted from clipboard"]
            ], {
                fn: function () {
                    textArea.parentNode.removeChild(textArea);
                    this.recordedActions = savedRecordedActions;
                    var value = textArea.value;
                    this.$logInfo("Raw JAWS history:\n%1", [value]);
                    this.$callback(cb, value);
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

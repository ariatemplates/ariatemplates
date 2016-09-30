/*
 * Copyright 2013 Amadeus s.a.s.
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

var Aria = require('ariatemplates/Aria');

var ariaCoreTimer = require('ariatemplates/core/Timer');

var ariaUtilsType = require('ariatemplates/utils/Type');
var ariaUtilsArray = require('ariatemplates/utils/Array');
var ariaUtilsCaret = require('ariatemplates/utils/Caret');

var MultiAutoCompleteRobotBase = require('../MultiAutoCompleteRobotBase');
var Sequencer = require('./Sequencer');



module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiautocomplete.navigation.RobotBase",
    $extends : MultiAutoCompleteRobotBase,
    $constructor : function (name) {
        // ------------------------------------------------------ initialization

        this.$MultiAutoCompleteRobotBase.constructor.call(this);

        // ---------------------------------------------------------- properties

        this.name = name;

        // ------------------------------------------------------- configuration

        this.defaultDelay = 300;
        this.enableTracing = false;
        this.logTaskInTrace = false;

        // ---------------------------------------------------------- attributes

        var sequencer = new Sequencer({
            scope : this,
            onend : 'end',

            asynchronous : true,
            trace : {
                enable : this.enableTracing,
                collapsed : false,
                logTask : this.logTaskInTrace,
                color : 'blue'
            }
        });
        this.sequencer = sequencer;

        // ---------------------------------------------------------- processing

        // Registers methods that are synchronous
        // The other ones will be considered asynchronous by default regarding the property set above
        // Also, not all methods need that, only those that are going to be used directly in task definitions
        sequencer.registerMethodsProperties(ariaUtilsArray.map([
            'checkCaretAndFocus',
            'checkHighlightedOption',
            'checkInsertedOptionsCount',
            'shouldBeInHighlightedMode',
            'shouldInputFieldBeFocused'
        ], function (name) {
            return {
                name : name,
                asynchronous : false
            };
        }));

        // ------------------------------------------------- internal attributes

        this._toDispose = [];
    },

    $destructor : function () {
        this.sequencer.$dispose();

        ariaUtilsArray.forEach(this._toDispose, function (instance) {
            instance.$dispose();
        });

        this.$MultiAutoCompleteRobotBase.$destructor.call(this);
    },

    $prototype : {
        runTemplateTest : function () {
            this.sequencer.run({
                tasks : [
                    {
                        name : this.name,
                        children : [
                            {
                                name : 'Initialization',
                                children : '_initialization'
                            },
                            {
                                name : 'Test',
                                children : '_test'
                            }
                        ]
                    }
                ]
            });
        },

        ////////////////////////////////////////////////////////////////////////
        // User actions: keyboard, clicks.
        ////////////////////////////////////////////////////////////////////////

        /**
         * Types given keys in one shot into the currently focused element in the page.
         *
         * @param[in] task The task context in which this method is being called.
         * @param[in] {String} keys Key identifiers
         */
        type : function (task, keys) {
            this.synEvent.type(this.getFocusedElement(), keys, {
                fn : task.end,
                scope : task
            });
        },

        /**
         * Enters given sequence of text.
         *
         * @param[in] task The task context in which this method is being called.
         * @param[in] {String|Array{String}} textSequence An array of input or a simple string (corresponding to a
         * sequence with one item)
         * @param[in] {Number} delay An integer corresponding to the time to wait between each input of the given text
         * sequence.
         */
        typeSequence : function (task, textSequence, delay) {
            // -------------------------------------- input arguments processing

            // textSequence ----------------------------------------------------

            if (ariaUtilsType.isString(textSequence)) {
                textSequence = [textSequence];
            } else if (!ariaUtilsType.isArray(textSequence)) {
                throw new Error('Invalid given textSequence. Should be an array or a string, got: ' + textSequence);
            }

            // delay -----------------------------------------------------------

            if (delay == null) {
                delay = this.defaultDelay;
            }

            // ------------------------------------------------------ processing

            var tasks = [];
            ariaUtilsArray.forEach(textSequence, function (text) {
                tasks.push({
                    name : 'Type...',
                    method : 'type',
                    args : [text]
                });
                tasks.push({
                    name : 'Wait...',
                    method : 'wait',
                    args : [delay]
                });
            });

            var sequencer = new Sequencer({
                scope : this,

                asynchronous : true,
                trace : {
                    enable : this.enableTracing,
                    collapsed : false,
                    logTask : this.logTaskInTrace,
                    color : 'green'
                }
            });

            this._toDispose.push(sequencer);

            sequencer.root(tasks).runAsTask(task);
        },

        /**
         * Waits for a given time.
         *
         * @param[in] task The task context in which this method is being called.
         * @param[in] {Number} delay The duration to wait.
         */
        wait : function (task, delay) {
            ariaCoreTimer.addCallback({
                fn : task.end,
                scope : task,
                delay : delay
            });
        },

        /**
         * Presses the key corresponding to the given name.
         *
         * @param[in] task The task context in which this method is being called.
         * @param[in] {String} keyName The name of the key to press.
         * @param[in] {Number} times The number of times to press the key. Defaults to 1.
         */
        pressKey : function (task, keyName, times) {
            // -------------------------------------- input arguments processing

            if (times == null) {
                times = 1;
            }

            // ------------------------------------------------------ processing

            var keySequence = ariaUtilsArray.repeatValue("[" + keyName + "]", times);

            this.typeSequence(task, keySequence);
        },

        /**
         * Presses the left arrow key.
         * @see pressKey
         */
        pressLeftArrow : function () {
            this.pressKey.apply(this, ariaUtilsArray.insert(arguments, 'left', 1));
        },
        /**
         * Presses the right arrow key.
         * @see pressKey
         */
        pressRightArrow : function () {
            this.pressKey.apply(this, ariaUtilsArray.insert(arguments, 'right', 1));
        },
        /**
         * Presses the tab key.
         * @see pressKey
         */
        pressTab : function () {
            this.pressKey.apply(this, ariaUtilsArray.insert(arguments, 'tab', 1));
        },



        ////////////////////////////////////////////////////////////////////////
        // Specific user actions which interact specifically with components of the widget.
        ////////////////////////////////////////////////////////////////////////

        /**
         * Focuses the input field.
         *
         * @param[in] task The task context in which this method is being called.
         */
        focusInputField : function (task) {
            this.synEvent.click(this._getField(), {
                fn : task.end,
                scope : task
            });
        },

        /**
         * Inserts text into the input field.
         *
         * @param[in] task The task context in which this method is being called.
         * @param[in] {String} text The text to enter in the input
         */
        insertText : function (task, text) {
            this.typeSequence(task, text);
        },

        /**
         * Executes all the necessary events in order to select a suggestion from the dropdown list and insert it into
         * the widget.
         *
         * @param[in] task The task context in which this method is being called.
         * @param[in] {Array{String}} inputs A list of text input values to use to match available suggestions. Only the first matching selection gets inserted.
         * @param[in] {Boolean} Whether the current state has to be restored after the selection
         */
        selectSuggestions : function (task, inputs, restore) {
            // ------------------------------------------------------ processing

            // backup state ----------------------------------------------------

            var field = this._getField();
            var backup = {
                focused : this.getFocusedElement(),
                value : field.value,
                caret : ariaUtilsCaret.getPosition(field)
            };

            // insert options --------------------------------------------------

            if (restore) {
                field.value = "";
            }

            var text = [];

            var tasks = [{
                        name : 'Ensures input field is focused first',
                        method : 'focusInputField',
                        asynchronous : true
                    }];

            ariaUtilsArray.forEach(inputs, function (input) {
                tasks.push({
                    name : 'Type sequence',
                    method : 'typeSequence',
                    args : [[input]],
                    asynchronous : true
                });

                tasks.push({
                    name : 'Wait for dropdown',
                    method : 'waitForDropdownState',
                    args : [true],
                    asynchronous : true
                });

                tasks.push({
                    name : 'Type sequence',
                    method : 'typeSequence',
                    args : [["[DOWN]", "[ENTER]"]],
                    asynchronous : true
                });
            });

            if (restore) {
                tasks.push({
                    name : 'Restore state',
                    fn : function () {
                        field.value = backup.value;
                        ariaUtilsCaret.setPosition(field, backup.caret);
                        backup.focused.focus();
                    },
                    asynchronous : false
                });
            }

            var sequencer = new Sequencer({
                scope : this,

                trace : {
                    enable : this.enableTracing,
                    logTask : this.logTaskInTrace,
                    collapsed : false,
                    color : 'orange'
                }
            });

            this._toDispose.push(sequencer);

            sequencer.root(tasks).runAsTask(task);
        },



        ////////////////////////////////////////////////////////////////////////
        // States tests
        ////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////
        // States tests > Helpers
        ////////////////////////////////////////////////////////////////////////

        /**
         * Tells whether the input field is focused or not.
         * @see aria.widgets.form.MultiAutoComplete.isInputFieldFocused
         */
        isInputFieldFocused : function () {
            return this._getWidgetInstance().isInputFieldFocused();
        },

        /**
         * Tells whether the widget is in highlighted mode or not.
         * @see aria.widgets.form.MultiAutoComplete.isInHighlightedMode
         */
        isInHighlightedMode : function () {
            return this._getWidgetInstance().isInHighlightedMode();
        },

        /**
         * Returns the number of currently inserted options.
         * @see aria.widgets.form.MultiAutoComplete.insertedOptionsCount
         */
        getInsertedOptionsCount : function () {
            return this._getWidgetInstance().insertedOptionsCount();
        },

        ////////////////////////////////////////////////////////////////////////
        // States tests > Tasks
        ////////////////////////////////////////////////////////////////////////

        // selected options ----------------------------------------------------

        /**
         * Checks the number of inserted options.
         * @param[in] task The task context in which this method is being called.
         * @param[in] {Number} count The expected number of inserted options.
         * @see getInsertedOptionsCount
         */
        checkInsertedOptionsCount : function (task, count) {
            var actualCount = this.getInsertedOptionsCount();

            this.assertEquals(count, actualCount, "The number of selected options is not as expected: " + actualCount
                    + " instead of " + count);
        },

        // highlighting --------------------------------------------------------

        /**
         * Checks if the widget highlighted mode is in proper state.
         * @param[in] task The task context in which this method is being called.
         * @param[in] {Boolean} should <code>true</code> if it should be in highlighted mode, <code>false</code>
         * otherwise.
         * @see isInHighlightedMode
         */
        shouldBeInHighlightedMode : function (task, should) {
            var isInHighlightedMode = this.isInHighlightedMode();
            if (should) {
                this.assertTrue(isInHighlightedMode, "Widget is not in highlighted mode");
            } else {
                this.assertFalse(isInHighlightedMode, "Widget should not be in highlighted mode");
            }
        },
        /**
         * Check that the inserted option at the given index is the only one currently highlighted.
         * @param[in] task The task context in which this method is being called.
         * @param[in] {Number} index Corresponds to the index of the getHighlight method (1-based)
         */
        checkHighlightedOption : function (task, index) {
            this.checkHighlightedElementsIndices([index]);
        },

        // input field ---------------------------------------------------------

        /**
         * Checks if the input field focus is in proper state.
         *
         * @param[in] task The task context in which this method is being called.
         * @param[in] {Boolean} should <code>true</code> if it should be focused, <code>false</code> otherwise.
         *
         * @see isInputFieldFocused
         */
        shouldInputFieldBeFocused : function (task, should) {
            var isFocused = this.isInputFieldFocused();
            if (should) {
                this.assertTrue(isFocused, "Input field is not focused");
            } else {
                this.assertFalse(isFocused, "Input field should not be focused");
            }
        },

        /**
         * Checks the position of the caret in the input field, and also that the latter is focused.
         *
         * @param[in] task The task context in which this method is being called.
         * @param[in] {Number} expectedPosition The expected position of the caret. Only the start index. 0-based.
         *
         * @see shouldInputFieldBeFocused
         */
        checkCaretAndFocus : function (task, expectedPosition) {
            this.shouldInputFieldBeFocused(null, true);

            var position = ariaUtilsCaret.getPosition(this._getField()).start;
            this.assertEquals(
                position,
                expectedPosition,
                "Actual caret position: " + position + ". Expected: " + expectedPosition
            );
        },

        /**
         * Check that the dropdown is open or closed.
         *
         * @param[in] task The task context in which this method is being called.
         * @param[in] {Boolean} open Whether we want the dropdown to be closed or open before going on with the task.
         */
        waitForDropdownState : function (task, open) {
            this.$MultiAutoCompleteRobotBase.waitForDropdownState.call(this, open, {
                fn : task.end,
                scope : task
            });
        }
    }
});

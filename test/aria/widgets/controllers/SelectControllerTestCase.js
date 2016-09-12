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
     * Insert a pause in a test sequence.
     */
    var pause = function (duration) {
        return {
            action : "pause",
            duration : duration ? duration : 1000
        };
    };

    /**
     * Insert a change of the value in a test sequence.
     */
    var value = function (value, checkText, checkIdx, checkValue) {
        return {
            action : "value",
            value : value,
            checkValue : checkValue ? checkValue : value,
            checkText : checkText,
            checkIdx : checkIdx
        };
    };

    /**
     * Insert a key in a test sequence.
     */
    var key = function (key, checkText, checkIdx, checkValue, valueInReport) {
        var charCode, keyCode;
        if (key.length == 1) {
            charCode = key.charCodeAt(0);
            keyCode = 0;
        } else {
            charCode = 0;
            keyCode = aria.DomEvent["KC_" + key.toUpperCase()];
        }
        return {
            action : "key",
            charCode : charCode,
            keyCode : keyCode,
            checkValue : checkValue,
            checkText : checkText,
            checkIdx : checkIdx,
            valueInReport : valueInReport
        };
    };

    /**
     * Test case for the select controller.
     */
    Aria.classDefinition({
        $classpath : "test.aria.widgets.controllers.SelectControllerTestCase",
        $extends : "aria.jsunit.TestCase",
        $dependencies : ["aria.widgets.controllers.SelectController", "aria.DomEvent"],
        $prototype : {

            /**
             * Create a select controller.
             */
            setUp : function () {
                this.selectController = new aria.widgets.controllers.SelectController();
            },

            /**
             * Disposes the controller.
             */
            tearDown : function () {
                if (this.selectController) {
                    this.selectController.$dispose();
                    this.selectController = null;
                }
            },

            _runSequenceCb : function (params1, params2) {
                try {
                    var params = params2 || params1;
                    var actions = params.actions;
                    var curIdx = params.curIdx;
                    var selectController = this.selectController;
                    var nextItemDelay = 1;
                    if (curIdx >= actions.length) {
                        this.$callback(params.cb);
                    } else {
                        var item = actions[curIdx];
                        if (item.action == "key" || item.action == "value") {
                            var report;
                            if (item.action == "key") {
                                report = selectController.checkKeyStroke(item.charCode, item.keyCode);
                            } else if (item.action == "value") {
                                report = selectController.checkValue(item.value);
                            }
                            if (item.action == "value" || item.valueInReport) {
                                this.assertEquals(report.value, item.checkValue, "Bad value in report in step "
                                        + params.curIdx + " (expected: %2, got: %1)");
                            } else {
                                this.assertTrue(typeof report.value == "undefined", "Value should not be present in the report.");
                            }
                            this.assertEquals(report.text, item.checkText, "Bad text in report in step "
                                    + params.curIdx + " (expected: %2, got: %1)");
                            var dataModel = selectController.getDataModel();
                            this.assertEquals(dataModel.value, item.checkValue, [
                                "Bad value in data model in step ", params.curIdx, " (expected: %2, got: %1)"].join(''));
                            this.assertEquals(dataModel.displayText, item.checkText, [
                                    "Bad displayText in data model in step ", params.curIdx, " (expected: %2, got: %1)"].join(''));
                            this.assertEquals(dataModel.displayIdx, item.checkIdx, [
                                    "Bad displayIdx in data model in step ", params.curIdx, " (expected: %2, got: %1)"].join(''));
                            this.assertEquals(dataModel.selectedIdx, item.checkIdx, [
                                    "Bad selectedIdx in data model in step ", params.curIdx, " (expected: %2, got: %1)"].join(''));
                            report.$dispose();
                        } else if (item.action == "pause") {
                            nextItemDelay = item.duration;
                        }
                        params.curIdx++;
                        aria.core.Timer.addCallback({
                            fn : this._runSequenceCb,
                            scope : this,
                            args : params,
                            delay : nextItemDelay
                        });
                    }
                } catch (ex) {
                    this.handleAsyncTestError(ex);
                }
            },

            _runSequence : function (keysArray) {
                var params = {
                    actions : keysArray,
                    curIdx : 0,
                    cb : {
                        fn : this.notifyTestEnd,
                        scope : this
                    }
                };
                this._runSequenceCb(null, params);
            },

            _setOptions1 : function () {
                this.selectController.setListOptions([{
                            value : "value-aa",
                            label : "aa"
                        }, {
                            value : "value-ac",
                            label : "ac"
                        }, {
                            value : "value-ab",
                            label : "ab"
                        }, {
                            value : "value-ad",
                            label : "ad"
                        }, {
                            value : "value-ba",
                            label : "ba"
                        }, {
                            value : "value-ca",
                            label : "ca"
                        }]);
            },

            _setOptionsEmpty : function () {
                this.selectController.setListOptions([]);
            },

            /**
             * Check what's happening when typing repeateadly the same key (first: exact match, then looping over
             * options starting with that letter).
             */
            testAsyncCheckLetterRepeatedly : function () {
                this._setOptions1();
                this._runSequence([value("value-ac", "ac", 1) /* start with the second option (ac) */,
                        /*
                         * We press 'a' and 'a' again quickly after. The match must be on aa (exact match) and not on ad
                         * (match on starting letter).
                         */
                        key("a", "ab", 2, "value-ab"), key("a", "aa", 0, "value-aa"),
                        /*
                         * We press 'a' again, there is no more exact match, and we should loop over all options
                         * starting with 'a'.
                         */
                        key("a", "ac", 1, "value-ac"), key("a", "ab", 2, "value-ab"), key("a", "ad", 3, "value-ad"),
                        key("a", "aa", 0, "value-aa"), key("a", "ac", 1, "value-ac")

                ]);
            },

            /**
             * Check what's happening when there is no match.
             */
            testAsyncNoMatch : function () {
                this._setOptions1();
                this._runSequence([value("value-ac", "ac", 1) /* start with the second option (ac) */,
                        /*
                 * We press 'z' (no match). Stay on the same letter, even when typing later b (which would have
                 * matches if typed as the first letter).
                 */
                        key("z", "ac", 1, "value-ac"), key("b", "ac", 1, "value-ac")

                ]);
            },

            /**
             * Check that a pause clears saved keys.
             */
            testAsyncCheckPauseClearsSavedKeys : function () {
                this._setOptions1();
                this._runSequence([
                        value("value-aa", "aa", 0) /* start with the first option (aa) */,
                        /*
                         * Press 'b' once, and then 'a' repeatedly. Should stay on 'ba' until keys are cleared (by a
                         * pause of 1s).
                         */
                        key("b", "ba", 4, "value-ba"), key("a", "ba", 4, "value-ba"), key("a", "ba", 4, "value-ba"),
                        key("a", "ba", 4, "value-ba"), pause(400), key("a", "ba", 4, "value-ba"), pause(1000),
                        key("a", "aa", 0, "value-aa")]);
            },

            /**
             * Check the behavior of the up or left key.
             */
            _testAsyncUpOrLeftKey : function (upOrLeft) {
                this._setOptions1();
                this._runSequence([value("value-aa", "aa", 0) /* start with the first option (aa) */,
                        /*
                         * Press 'b' once, and then 'a' repeatedly. Should stay on 'ba'.
                         */
                        key("b", "ba", 4, "value-ba"), key("a", "ba", 4, "value-ba"), key("a", "ba", 4, "value-ba"),
                        key("a", "ba", 4, "value-ba"),
                        /*
                         * Press the up or left arrow key, should go up in the list, and clear saved keys so that
                         * pressing 'a' again should go to "aa".
                         */
                        key(upOrLeft, "ad", 3, "value-ad"), key("a", "aa", 0, "value-aa"),
                        /* Pressing the up or left arrow key when already at the top of the list does nothing. */
                        key(upOrLeft, "aa", 0, "value-aa")]);
            },

            /**
             * Check the behavior of the up key.
             */
            testAsyncUpKey : function () {
                this._testAsyncUpOrLeftKey("up");
            },

            /**
             * Check the behavior of the left key.
             */
            testAsyncLeftKey : function () {
                this._testAsyncUpOrLeftKey("left");
            },

            /**
             * Check the behavior of the down or right key.
             */
            _testAsyncDownOrRightKey : function (downOrRight) {
                this._setOptions1();
                this._runSequence([value("value-aa", "aa", 0) /* start with the first option (aa) */,
                        /*
                         * Press 'b' once, and then 'a' repeatedly. Should stay on 'ba'.
                         */
                        key("b", "ba", 4, "value-ba"), key("a", "ba", 4, "value-ba"), key("a", "ba", 4, "value-ba"),
                        key("a", "ba", 4, "value-ba"),
                        /*
                         * Press the down or right arrow key, should go down in the list, and clear saved keys so that
                         * pressing 'a' again should go to "aa".
                         */
                        key(downOrRight, "ca", 5, "value-ca"), key("a", "aa", 0, "value-aa"),
                        /* Pressing the down or right arrow key when already at the bottom of the list does nothing. */
                        value("value-ca", "ca", 5), key(downOrRight, "ca", 5, "value-ca")]);
            },

            /**
             * Check the behavior of the up key.
             */
            testAsyncRightKey : function () {
                this._testAsyncDownOrRightKey("right");
            },

            /**
             * Check the behavior of the down key.
             */
            testAsyncDownKey : function () {
                this._testAsyncDownOrRightKey("down");
            },

            /**
             * Check the behavior of page up/page down keys.
             */
            testAsyncPageUpDownKeys : function () {
                this._setOptions1();
                var dataModel = this.selectController.getDataModel();
                // with a pageSize of 4 (4 items are displayed before scrolling), pressing page up or page down should
                // navigate by 3 items (when the first item of the page is selected, pressing page down should select
                // the last item of the page without scrolling)
                aria.utils.Json.setValue(dataModel, "pageSize", 4);
                this._runSequence([value("value-aa", "aa", 0) /* start with the first option (aa) */,
                        key("page_down", "ad", 3, "value-ad"), key("page_down", "ca", 5, "value-ca"),
                        key("page_up", "ab", 2, "value-ab"), key("page_up", "aa", 0, "value-aa")]);
            },

            /**
             * Check the behavior of home and end keys.
             */
            testAsyncHomeEndKeys : function () {
                this._setOptions1();
                var dataModel = this.selectController.getDataModel();
                this._runSequence([value("value-ab", "ab", 2) /* start with the third option (ab) */,
                        key("end", "ca", 5, "value-ca"), key("end", "ca", 5, "value-ca"),
                        key("home", "aa", 0, "value-aa"), key("home", "aa", 0, "value-aa"),
                        key("end", "ca", 5, "value-ca"), key("home", "aa", 0, "value-aa")]);
            },

            /**
             * Check the behavior of the backspace key.
             */
            testAsyncBackspaceKey : function (downOrRight) {
                this._setOptions1();
                this._runSequence([
                        value("value-ba", "ba", 4) /* start with the 5th option (ba) */,
                        /*
                         * Press 'a' once, and then 'b'
                         */
                        key("a", "aa", 0, "value-aa"),
                        key("b", "ab", 2, "value-ab"),
                        /*
                         * Press backspace (which removes b from saved keys, but stay at the same place)
                         */
                        key("backspace", "ab", 2, "value-ab"),
                        /*
                         * Press 'c', should go to 'ac'.
                         */
                        key("c", "ac", 1, "value-ac"),
                        /*
                         * Press backspace twice (which removes everything from saved keys, but stays at the same place)
                         */
                        key("backspace", "ac", 1, "value-ac"),
                        key("backspace", "ac", 1, "value-ac"),
                        /*
                         * Then press 'c', should go to ca
                         */
                        key("c", "ca", 5, "value-ca"),
                        /*
                         * Press backspace again twice (does nothing).
                         */
                        key("backspace", "ca", 5, "value-ca"),
                        key("backspace", "ca", 5, "value-ca"),
                        /*
                         * Press 'a' repeatedly, then backspace. When pressing backspace, there should be no change.
                         */
                        key("a", "aa", 0, "value-aa"), key("a", "aa", 0, "value-aa"), key("a", "ac", 1, "value-ac"),
                        key("a", "ab", 2, "value-ab"), key("backspace", "ab", 2, "value-ab"),
                        key("backspace", "ab", 2, "value-ab"), key("backspace", "ab", 2, "value-ab"),
                        key("backspace", "ab", 2, "value-ab")

                ]);
            },

            /**
             * Check the behavior of the enter key.
             */
            testEnterKey : function () {
                this._setOptions1();
                var listWidget = {};// mocked list widget
                var controller = this.selectController;

                // if pressing enter when the popup is open, should close the popup, and should cancel default:
                controller.setListWidget(listWidget);
                // change the highlighted item (similar to a mouse move over the item):
                aria.utils.Json.setValue(controller.getDataModel(), "selectedIdx", 2);
                var report = controller.checkKeyStroke(0, aria.DomEvent.KC_ENTER);
                this.assertFalse(report.displayDropDown);
                this.assertTrue(report.cancelKeyStroke);
                this.assertEquals(report.value, "value-ab"); // corresponds to index 2
                report.$dispose();

                // if pressing enter when the popup is closed, should not and should cancel default:
                controller.setListWidget(null);
                report = controller.checkKeyStroke(0, aria.DomEvent.KC_ENTER);
                this.assertFalse(report.cancelKeyStroke);
                this.assertEquals(report.value, "value-ab");
                report.$dispose();
            },

            /**
             * Check the behavior of the escape key.
             */
            testEscapeKey : function () {
                this._setOptions1();
                var listWidget = {};// mocked list widget
                var controller = this.selectController;
                var dataModel = controller.getDataModel();
                // if pressing escape when the popup is open, should close the popup:
                controller.setListWidget(listWidget);
                // change the highlighted item (similar to a mouse move over the item). This change is ignored because
                // pressing escape does not validate it.
                aria.utils.Json.setValue(dataModel, "selectedIdx", 2);
                var report = controller.checkKeyStroke(0, aria.DomEvent.KC_ESCAPE);
                this.assertTrue(report.displayDropDown === false);
                this.assertTrue(report.cancelKeyStroke === true);
                this.assertTrue(typeof report.value == "undefined"); // pressing escape must not update the data
                // model
                this.assertEquals(dataModel.selectedIdx, dataModel.displayIdx);
                this.assertEquals(dataModel.displayIdx, 0);
                report.$dispose();

                // pressing escape when the popup is closed (should have no effect: report is null)
                controller.setListWidget(null);
                report = controller.checkKeyStroke(0, aria.DomEvent.KC_ESCAPE);
                this.assertTrue(report == null);
            },

            /**
             * Check the behavior of the tab key.
             */
            testTabKey : function () {
                this._setOptions1();
                var listWidget = {};// mocked list widget
                var controller = this.selectController;

                controller.setListWidget(listWidget);
                // change the highlighted item (similar to a mouse move over the item):
                aria.utils.Json.setValue(controller.getDataModel(), "selectedIdx", 2);
                // change the highlighted item (similar to a mouse move over the item). This change is ignored because
                // pressing tab does not validate it.
                var report = controller.checkKeyStroke(0, aria.DomEvent.KC_TAB);
                this.assertFalse(report.displayDropDown);
                this.assertFalse(report.cancelKeyStroke);
                this.assertEquals(report.value, "value-aa");
                report.$dispose();

                // pressing tab when the popup is closed:
                controller.setListWidget(null);
                report = controller.checkKeyStroke(0, aria.DomEvent.KC_TAB);
                this.assertFalse(report.cancelKeyStroke);
                this.assertEquals(report.value, "value-aa");
                report.$dispose();
            },

            /**
             * Check the behavior of the checkText method.
             */
            testCheckText : function () {
                this._setOptions1();
                // checkText should do nothing for the select controller (but it must be present so that it stays
                // compatible with DropDownTextInput widgets)
                this.assertTrue(this.selectController.checkText() == null);
            },

            /**
             * Check the behavior of the toggleDropDown method.
             */
            testToggleDropDown : function () {
                this._setOptions1();
                var listWidget = {};// mocked list widget
                var controller = this.selectController;

                // popup is open, toggleDropDown closes it:
                controller.setListWidget(listWidget);
                var report = controller.toggleDropdown();
                this.assertTrue(report.displayDropDown === false);
                report.$dispose();

                // popup is closed, toggleDropDown opens it:
                controller.setListWidget(null);
                report = report = controller.toggleDropdown();
                this.assertTrue(report.displayDropDown === true);
                report.$dispose();
            },

            /**
             * Check the behavior with an empty array for options (no error, value is always null and selectedIdx is
             * -1).
             */
            testEmptyOptionsArray : function () {
                this._setOptionsEmpty();
                var controller = this.selectController;
                this._runSequence([value(null, "", -1), key("a", "", -1, null), key("enter", "", -1, null)]);
            }

        }
    });
})();

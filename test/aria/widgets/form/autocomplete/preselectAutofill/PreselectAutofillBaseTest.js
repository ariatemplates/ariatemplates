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

/**
 * This is a base class to extend for all tests dealing with preselect and autofill options in the AutoComplete. It
 * performs the following scenario:
 *
 * <pre>
 * 1 - type
 * 'p'  in the field
 * 2 - type the selection key (can be configured, it defaults to [ENTER])
 * 3 - type 'p1' in the field. In this case there is an exact match, because 'p1' is the code of one returned suggestion.
 * 4 - type the selection key
 * 5 - type 'p1', then [BACKSPACE] in the field (the widget and the data model should be in the same status as step 1)
 * 6 - type the selection key  (the widget and the data model should be in the same status as step 2)
 * 7 - type 'p1', then [BACKSPACE] and [DOWN] in the field. In this case, a navigation in the displayed list is triggered
 * 8 - type the selection key
 *
 * For each of these steps, a set of assertions is performed on the input field value, the data model, the highlighted suggestions in the dropdown, the element which has focus.
 *
 * The scenario is performed twice: the first time the AutoComplete freeText configuration property is set to true, the second time it is set to false.
 *
 * The reference values are not explicitly set in this test, but are contained in this.allTestvalues class property. It is up to extending classes to provide these values.
 *
 * Many test options can be configured:
 * 1 - the preselect option for the AutoComplete
 * 2 - the autofill option for the AutoComplete
 * 3 - the selection key (either [ENTER] or [TAB])
 * 4 - the template to test
 * 5 - the resources handler to use
 * </pre>
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.preselectAutofill.PreselectAutofillBaseTest",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.popups.PopupManager", "aria.resources.handlers.LCResourcesHandler", "aria.utils.Array",
            "aria.utils.Type", "aria.core.Browser"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        if (aria.core.Browser.isPhantomJS || aria.core.Browser.isIE7) {
            this.defaultTestTimeout = 40000;
        }
        this.resourcesHandler = this.resourcesHandler || new aria.resources.handlers.LCResourcesHandler();
        this.resourcesHandler.setSuggestions([{
                    label : "P2. TESTER B",
                    code : "P2"
                }, {
                    label : "P1. TESTER A",
                    code : "P1"
                }, {
                    label : "P3. TESTER C",
                    code : "P3"
                }, {
                    label : "P4. TESTER D",
                    code : "P4"
                }]);

        this.data = {
            resourcesHandler : this.resourcesHandler,
            value : null
        };

        if (this.preselect !== undefined) {
            this.data.preselect = this.preselect;
        }

        if (this.autofill !== undefined) {
            this.data.autofill = this.autofill;
        }

        this.selectionKey = "[ENTER]";

        this.testTemplate = this.testTemplate
                || "test.aria.widgets.form.autocomplete.preselectAutofill.PreselectAutofillCommonTemplate";

        this.setTestEnv({
            template : this.testTemplate,
            data : this.data
        });
        this.field = null;

        if (!this.allTestValues) {

            /**
             * <pre>
             * It contains two objects (one for the freeText=true scenario, the other for the freeText=false scenario), each containing, for each of the steps described in the comment above the class the expected values for
             * 1 - the input's value
             * 2 - the value in the data model
             * 3 - the status of the dropdown (the first entry being the number of suggestions, the second one an array containing the indices of highlighted items)
             *
             * Notice that the status after step 5 and 6 should be the same as step 1 and 2, respectively. That's why there are only six entries in the arrays.
             * </pre>
             */
            this.allTestValues = {
                freetext : {
                    input : [],
                    dataModel : [],
                    items : []
                },
                noFreetext : {
                    input : [],
                    dataModel : [],
                    items : []
                }
            };
        }

        this.scenario = null;

    },
    $destructor : function () {
        this.resourcesHandler.$dispose();
        this.field = null;
        this.$RobotTestCase.$destructor.call(this);
    },
    $prototype : {

        runTemplateTest : function () {
            this._runScenario("freetext");
        },

        _runScenario : function (scenario) {
            this.scenario = scenario;
            this.data.freeText = (scenario == "freetext");
            this.testValues = this.allTestValues[scenario];
            this._reset();

            var field = this.field;

            /**
             * type 'p'
             */
            this.synEvent.execute([["click", field], ["type", field, "p"]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [0, "_afterFirstTyping"]
            });
        },

        /**
         * test status after suggestions for 'p' have been retrieved, then type the selection key
         */
        _afterFirstTyping : function () {
            this._testAll(0);

            this.synEvent.execute([["type", this.field, this.selectionKey]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [1, "_afterSecondTyping"]
            });
        },

        /**
         * test status after the slection key has been pressed, then refresh the template to start a new scenario. 'p1'
         * is typed, it corresponds to the code of one of the suggestions
         */
        _afterSecondTyping : function () {
            this._testAll(1);
            this._reset();
            this.synEvent.execute([["click", this.field], ["type", this.field, "p1"]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [2, "_afterThirdTyping"]
            });

        },

        /**
         * test status after suggestions for 'p1' have been retrieved, then type the selection key
         */
        _afterThirdTyping : function () {
            this._testAll(2);
            this.synEvent.execute([["type", this.field, this.selectionKey]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [3, "_afterFourthTyping"]
            });
        },

        /**
         * test status after the slection key has been pressed, then refresh the template to start a new scenario. 'p1',
         * then [BACKSPACE] is typed.
         */
        _afterFourthTyping : function () {
            this._testAll(3);
            this._reset();

            this.synEvent.execute([["click", this.field], ["type", this.field, "p1"],
                    ["type", this.field, "[BACKSPACE]"]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [0, "_afterFifthTyping"]
            });
        },

        /**
         * test status after suggestions for 'p' have been retrieved. The same situation as _afterFirstTyping should
         * occur. Then type the selection key
         */
        _afterFifthTyping : function () {
            this._testAll(0);
            this.synEvent.execute([["type", this.field, this.selectionKey]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [1, "_afterSixthTyping"]
            });
        },

        /**
         * test status after the slection key has been pressed. The same situation as _afterSecondTyping should occur.
         * Then refresh the template to start a new scenario. 'p1', then [BACKSPACE] and [DOWN] is typed.
         */
        _afterSixthTyping : function () {
            this._testAll(1);
            this._reset();

            this.synEvent.execute([["click", this.field], ["type", this.field, "p1"],
                    ["type", this.field, "[BACKSPACE][DOWN]"]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [4, "_afterSeventhTyping"]
            });
        },

        /**
         * test status after suggestions for 'p' have been retrieved and a navigation down the list of suggestions has
         * been performed. Then type the selection key
         */
        _afterSeventhTyping : function () {
            this._testAll(4);
            this.synEvent.execute([["type", this.field, this.selectionKey]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [5, "_afterEighthTyping"]
            });
        },

        /**
         * test status after the slection key has been pressed.
         */
        _afterEighthTyping : function () {
            this._testAll(5);
            this._furtherTests();
        },

        _testPopupOpen : function (res, args) {
            var isOpen = this.testValues.items[args[0]][0] > 0 ? 1 : 0;
            this.waitFor({
                condition : function () {
                    var openedPopups = aria.popups.PopupManager.openedPopups;
                    return openedPopups.length == isOpen;
                },
                callback : {
                    fn : this[args[1]],
                    scope : this
                }
            });
        },

        /**
         * Test the input value, the data model value and the dropdown displayed and highlighted suggestions. Every
         * second step, the status of the focus is also tested.
         * @param {Integer} index used in order to retrieve the reference values from the object containing them all
         */
        _testAll : function (index) {
            this._testInputText(this.testValues.input[index]);
            this._testDataModel(this.testValues.dataModel[index]);
            this._testDisplayedItems.apply(this, this.testValues.items[index]);
            if (index % 2 == 1) {
                this._testFocusAfterSelection();
            }
        },

        _testInputText : function (value) {
            this.assertEquals(this.field.value, value, "Value in input field is not correct. Expected: \"" + value
                    + "\", found \"" + this.field.value + "\" instead.");
        },

        _testDataModel : function (value) {
            var jsonUtil = aria.utils.Json;
            var dmDirtyValue = this.data.value, dmValue = dmDirtyValue;
            if (aria.utils.Type.isObject(dmDirtyValue)) {
                dmValue = {
                    label : dmDirtyValue.label,
                    code : dmDirtyValue.code
                };
            } else if (aria.utils.Type.isArray(dmDirtyValue)) {
                dmValue = [];
                for (var i = 0, len = dmDirtyValue.length; i < len; i++) {
                    if (aria.utils.Type.isObject(dmDirtyValue[i])) {
                        dmValue.push({
                            label : dmDirtyValue[i].label,
                            code : dmDirtyValue[i].code
                        });
                    } else {
                        dmValue.push(dmDirtyValue[i]);
                    }
                }
            }
            this.assertJsonEquals(dmValue, value, "Value in data model is not correct. Expected: \""
                    + jsonUtil.convertToJsonString(value) + "\", found \"" + jsonUtil.convertToJsonString(dmValue)
                    + "\" instead.");
        },

        _testDisplayedItems : function (count, highlighted) {
            if (count > 0) {
                highlighted = highlighted || [];
                var selectionRegExp = /SelectedItem_/, shouldBeSelected, arrayUtil = aria.utils.Array;
                var list = this.getElementById("myList", false, this.getWidgetInstance("ac").controller.getListWidget()._subTplCtxt);
                var items = list.children, len = items.length;
                this.assertEquals(len - 1, count, "The number of displayed items is not correct. Expected " + count
                        + ", found " + len - 1);
                for (var i = 0; i < len - 1; i++) {
                    shouldBeSelected = arrayUtil.contains(highlighted, i);
                    if (shouldBeSelected) {
                        this.assertTrue(selectionRegExp.test(items[i + 1].className), "Item " + i
                                + " should be selected. It is not.");
                    } else {
                        this.assertFalse(selectionRegExp.test(items[i + 1].className), "Item " + i
                                + " should not be selected. It is.");
                    }
                }
            }
        },

        _testFocusAfterSelection : function () {
            var focused = Aria.$window.document.activeElement;
            if (this.selectionKey == "[ENTER]") {
                this.assertEquals(this.field, focused, "The wrong element is focused after selection");
            } else {
                this.assertEquals(this.getElementById("focusTest"), focused, "The wrong element is focused after selection");
            }
        },

        _reset : function () {
            this.data.value = null;
            for (var key in this.data) {
                if (this.data.hasOwnProperty(key) && aria.utils.Json.isMetadata(key)) {
                    delete this.data[key];
                }
            }
            this._refreshTestTemplate();
            this.field = this.getInputField("ac");
        },

        /**
         * This method has to be implemented in order to add steps in the scenario
         */
        _furtherTests : function () {
            this.end();
        },

        end : function () {
            if (this.scenario == "freetext") {
                this._runScenario("noFreetext");
            } else {
                this.$RobotTestCase.end.call(this);
            }
        }

    }
});

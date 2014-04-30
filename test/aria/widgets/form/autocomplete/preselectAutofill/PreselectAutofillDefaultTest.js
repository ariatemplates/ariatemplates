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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.preselectAutofill.PreselectAutofillDefaultTest",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.popups.PopupManager", "aria.resources.handlers.LCResourcesHandler", "aria.utils.Array",
            "aria.utils.Type"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
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
            this.allTestValues = {
                freetext : {
                    input : ["p", "p", "p1", "P1. TESTER A", "P4. TESTER D", "P4. TESTER D"],
                    dataModel : [null, "p", null, {
                                label : "P1. TESTER A",
                                code : "P1"
                            }, null, {
                                label : "P4. TESTER D",
                                code : "P4"
                            }],
                    items : [[4], [0], [1, [0]], [0], [4, [0]], [0]]
                }
            };

            this.allTestValues.noFreetext = aria.utils.Json.copy(this.allTestValues.freetext);
            this.allTestValues.noFreetext.dataModel[1] = undefined;
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

            this.synEvent.execute([["click", field], ["type", field, "p"]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [0, "_afterFirstTyping"]
            });
        },

        _afterFirstTyping : function () {
            this._testAll(0);

            this.synEvent.execute([["type", this.field, this.selectionKey]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [1, "_afterSecondTyping"]
            });
        },

        _afterSecondTyping : function () {
            this._testAll(1);
            this._reset();
            this.synEvent.execute([["click", this.field], ["type", this.field, "p1"]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [2, "_afterThirdTyping"]
            });

        },

        _afterThirdTyping : function () {
            this._testAll(2);
            this.synEvent.execute([["type", this.field, this.selectionKey]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [3, "_afterFourthTyping"]
            });
        },

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

        _afterFifthTyping : function () {
            this._testAll(0);
            this.synEvent.execute([["type", this.field, this.selectionKey]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [1, "_afterSixthTyping"]
            });
        },

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

        _afterSeventhTyping : function () {
            this._testAll(4);
            this.synEvent.execute([["type", this.field, this.selectionKey]], {
                fn : this._testPopupOpen,
                scope : this,
                args : [5, "_afterEighthTyping"]
            });
        },

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

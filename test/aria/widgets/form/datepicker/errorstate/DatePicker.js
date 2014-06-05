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
    $classpath : "test.aria.widgets.form.datepicker.errorstate.DatePicker",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.core.Browser"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        // TODO this test is ridiculously long, split it
        this.defaultTestTimeout = 40000;
        if (aria.core.Browser.isIE7) {
            this.defaultTestTimeout = 50000;
        } else if (aria.core.Browser.isPhantomJS) {
            this.defaultTestTimeout = 60000;
        }
        this.setTestEnv({
            template : "test.aria.widgets.form.datepicker.errorstate.DatePickerTpl"
        });
        this.datePickerId = "Date1";
        this.validation = false;
        this.testName = "";
    },
    $prototype : {
        runTemplateTest : function () {
            this._clickTest("Date1", this.typeDateScenario1);
        },
        /**
         * Test cases applied when validation is switched off.
         */

        // Scenario 1: start
        // Type "a" in the first Date Picker and give focus to the second Date Picker: error state should be false.
        clearFieldsScenario1 : function () {
            this._clearFields(this.typeDateScenario1);
        },
        typeDateScenario1 : function () {
            this._typeTest(this.focusDateScenario1);
        },
        focusDateScenario1 : function () {
            this._clickTest("Date2", this.checkScenario1);
        },
        checkScenario1 : function () {
            this.testName = "checkScenario1";
            this._checkErrorState();
            this.clearFieldsScenario2();
        },

        // Scenario 2: start
        // Type "a" in the first Date Picker and click the clear button: error state should be false, the value should
        // be reset.
        clearFieldsScenario2 : function () {
            this._clearFields(this.typeDateScenario2);
        },
        typeDateScenario2 : function () {
            this._typeTest(this.focusDateScenario2);
        },
        focusDateScenario2 : function () {
            this._clickTest("Date2", this.clearInvalidTextAndValueScenario2);
        },
        clearInvalidTextAndValueScenario2 : function () {
            this._clickTest("Button1", this.checkScenario2);
        },
        checkScenario2 : function () {
            this.testName = "checkScenario2";
            this._checkErrorState();
            this._checkValue('');
            this.clearFieldsScenario3();
        },

        // Scenario 3: start
        // Type "a" in the first Date Picker and click on the refresh button: error state should be false, "a" should
        // still be displayed.
        clearFieldsScenario3 : function () {
            this._clearFields(this.initialFocusDateScenario3);
        },
        initialFocusDateScenario3 : function () {
            this._clickTest("Date1", this.typeDateScenario3);
        },
        typeDateScenario3 : function () {
            this._typeTest(this.focusDateScenario3);
        },
        focusDateScenario3 : function () {
            this._clickTest("Date2", this.refreshScenario3);
        },
        refreshScenario3 : function () {
            this._clickTest("Button2", this.checkScenario3);
        },
        checkScenario3 : function () {
            this.testName = "checkScenario3";
            this._checkErrorState();
            this._checkValue('a');
            this.clearFieldsScenario4();
        },

        // Scenario 4: start
        // Type "a" in the first Date Picker and click on the refresh button, then click on the clear button: error
        // state should be false, and the value should be cleared.
        clearFieldsScenario4 : function () {
            this._clearFields(this.typeDateScenario4);
        },
        typeDateScenario4 : function () {
            this._typeTest(this.focusDateScenario4);
        },
        focusDateScenario4 : function () {
            this._clickTest("Date2", this.refreshScenario4);
        },
        refreshScenario4 : function () {
            this._clickTest("Button2", this.clearInvalidTextScenario4);
        },
        clearInvalidTextScenario4 : function () {
            this._clickTest("Button1", this.checkScenario4);
        },
        checkScenario4 : function () {
            this.testName = "checkScenario4";
            this._checkErrorState();
            this._checkValue('');
            this.clearFieldsScenario5();
        },

        // Scenario 5: start
        // Type "a" in the first Date Picker and click on the clear button, then click on the refresh button: error
        // state should be false, and the value should be cleared.
        clearFieldsScenario5 : function () {
            this._clearFields(this.typeDateScenario5);
        },
        typeDateScenario5 : function () {
            this._typeTest(this.focusDateScenario5);
        },
        focusDateScenario5 : function () {
            this._clickTest("Date2", this.clearInvalidTextScenario5);
        },
        clearInvalidTextScenario5 : function () {
            this._clickTest("Button1", this.refreshScenario5);
        },
        refreshScenario5 : function () {
            this._clickTest("Button2", this.checkScenario5);
        },
        checkScenario5 : function () {
            this.testName = "checkScenario5";
            this._checkErrorState();
            this._checkValue('');
            this.clearFieldsScenario6();
        },

        // Scenario 6: start
        // Type a valid value in the first Date Picker and click on the refresh button: error state should
        // be false, and valid value should still be displayed.
        clearFieldsScenario6 : function () {
            this._clearFields(this.initialFocusDateScenario6);
        },
        initialFocusDateScenario6 : function () {
            this._clickTest("Date1", this.typeDateScenario6);
        },
        typeDateScenario6 : function () {
            this._typeTest(this.focusDateScenario6, true);
        },
        focusDateScenario6 : function () {
            this._clickTest("Date2", this.refreshScenario6);
        },
        refreshScenario6 : function () {
            this._clickTest("Button2", this.checkScenario6);
        },
        checkScenario6 : function () {
            this.testName = "checkScenario6";
            this._checkErrorState();
            this._checkValue('1/1/01');
            this.clearFieldsScenario7();
        },

        // Scenario 7: start
        // Set a valid value into the data model, clear the invalidText property: error state should be
        // false, and valid value should still be displayed.
        clearFieldsScenario7 : function () {
            this._clearFields(this.initialFocusDateScenario7);
        },
        initialFocusDateScenario7 : function () {
            this._clickTest("Date1", this.typeDateScenario7);
        },
        typeDateScenario7 : function () {
            this._typeTest(this.focusDateScenario7, true);
        },
        focusDateScenario7 : function () {
            this._clickTest("Date2", this.clearInvalidText7);
        },
        clearInvalidText7 : function () {
            this._clickTest("Button3", this.checkScenario7);
        },
        checkScenario7 : function () {
            this.testName = "checkScenario7";
            this._checkErrorState();
            this._checkValue('1/1/01');
            this.clearFieldsScenario8();
        },

        // Scenario 8: start
        // Type "a" in the first Date Picker, set invalidText to "b": invalidText should be "b".
        clearFieldsScenario8 : function () {
            this._clearFields(this.typeDateScenario8);
        },
        typeDateScenario8 : function () {
            this._typeTest(this.setInvalidTextScenario8);
        },
        setInvalidTextScenario8 : function () {
            this._clickTest("Button4", this.checkScenario8);
        },
        checkScenario8 : function () {
            this.testName = "checkScenario8";
            this._checkErrorState();
            this._checkValue('b');
            this.clearFieldsScenario9();
        },

        /**
         * Test cases applied when validation is switched on.
         */

        // Scenario 9: start
        // Type "a" in the second Date Picker and give focus to the first Date Picker: error state should be true.
        clearFieldsScenario9 : function () {
            this._clearFields(this.initialFocusDateScenario9);
        },
        initialFocusDateScenario9 : function () {
            this._clickTest("Date2", this.typeDateScenario9);
        },
        typeDateScenario9 : function () {
            this.datePickerId = "Date2";
            this.validation = true;
            this._typeTest(this.focusDateScenario9);
        },
        focusDateScenario9 : function () {
            this._clickTest("Date1", this.checkScenario9);
        },
        checkScenario9 : function () {
            this.testName = "checkScenario9";
            this._checkErrorState();
            this.clearFieldsScenario10();
        },

        // Scenario 10: start
        // Type "a" in the second Date Picker and click the clear button: error state should be false, the value should
        // be reset.
        clearFieldsScenario10 : function () {
            this._clearFields(this.typeDateScenario10);
        },
        typeDateScenario10 : function () {
            this.validation = false;
            this._typeTest(this.focusDateScenario10);
        },
        focusDateScenario10 : function () {
            this._clickTest("Date1", this.clearInvalidTextScenario10);
        },
        clearInvalidTextScenario10 : function () {
            this._clickTest("Button1", this.checkScenario10);
        },
        checkScenario10 : function () {
            this.testName = "checkScenario10";
            this._checkErrorState();
            this._checkValue('');
            this.clearFieldsScenario11();
        },

        // Scenario 11: start
        // Type "a" in the second Date Picker and click on the refresh button: error state should be true, "a" should
        // still be displayed.
        clearFieldsScenario11 : function () {
            this._clearFields(this.initialFocusDateScenario11);
        },
        initialFocusDateScenario11 : function () {
            this._clickTest("Date2", this.typeDateScenario11);
        },
        typeDateScenario11 : function () {
            this.validation = true;
            this._typeTest(this.focusDateScenario11);
        },
        focusDateScenario11 : function () {
            this._clickTest("Date1", this.refreshScenario11);
        },
        refreshScenario11 : function () {
            this._clickTest("Button2", this.checkScenario11);
        },
        checkScenario11 : function () {
            this.testName = "checkScenario11";
            this._checkErrorState();
            this._checkValue('a');
            this.clearFieldsScenario12();
        },

        // Scenario 12: start
        // Type "a" in the second Date Picker and click on the refresh button, then click on the clear button: error
        // state should be false, and the value should be cleared.
        clearFieldsScenario12 : function () {
            this._clearFields(this.typeDateScenario12);
        },
        typeDateScenario12 : function () {
            this.validation = false;
            this._typeTest(this.focusDateScenario12);
        },
        focusDateScenario12 : function () {
            this._clickTest("Date1", this.refreshScenario12);
        },
        refreshScenario12 : function () {
            this._clickTest("Button2", this.clearInvalidTextScenario12);
        },
        clearInvalidTextScenario12 : function () {
            this._clickTest("Button1", this.checkScenario12);
        },
        checkScenario12 : function () {
            this.testName = "checkScenario12";
            this._checkErrorState();
            this._checkValue('');
            this.clearFieldsScenario13();
        },

        // Scenario 13: start
        // Type "a" in the second Date Picker and click on the clear button, then click on the refresh button: error
        // state should be false, and the value should be cleared.
        clearFieldsScenario13 : function () {
            this._clearFields(this.typeDateScenario13);
        },
        typeDateScenario13 : function () {
            this._typeTest(this.focusDateScenario13);
        },
        focusDateScenario13 : function () {
            this._clickTest("Date1", this.clearInvalidTextScenario13);
        },
        clearInvalidTextScenario13 : function () {
            this._clickTest("Button1", this.refreshScenario13);
        },
        refreshScenario13 : function () {
            this._clickTest("Button2", this.checkScenario13);
        },
        checkScenario13 : function () {
            this.testName = "checkScenario13";
            this._checkErrorState();
            this._checkValue('');
            this.clearFieldsScenario14();
        },

        // Scenario 14: start
        // Type a valid value in the second Date Picker and click on the refresh button: error state
        // should
        // be false, and valid value should still be displayed.
        clearFieldsScenario14 : function () {
            this._clearFields(this.initialFocusDateScenario14);
        },
        initialFocusDateScenario14 : function () {
            this._clickTest("Date2", this.typeDateScenario14);
        },
        typeDateScenario14 : function () {
            this._typeTest(this.focusDateScenario14, true);
        },
        focusDateScenario14 : function () {
            this._clickTest("Date1", this.refreshScenario14);
        },
        refreshScenario14 : function () {
            this._clickTest("Button2", this.checkScenario14);
        },
        checkScenario14 : function () {
            this.testName = "checkScenario14";
            this._checkErrorState();
            this._checkValue('1/1/01');
            this.clearFieldsScenario15();
        },

        // Scenario 15: start
        // Set a valid value into the data model, clear the invalidText property: error state should be
        // false, and valid value should still be displayed.
        clearFieldsScenario15 : function () {
            this._clearFields(this.setValueScenario15);
        },
        setValueScenario15 : function () {
            this._clickTest("Button5", this.clearInvalidText15);
        },
        clearInvalidText15 : function () {
            this._clickTest("Button3", this.checkScenario15);
        },
        checkScenario15 : function () {
            this.testName = "checkScenario15";
            this._checkErrorState();
            this._checkValue('1/1/01');
            this.clearFieldsScenario16();
        },

        // Scenario 16: start
        // Type "a" in the second Date Picker, set invalidText to "b": invalidText should be "b".
        clearFieldsScenario16 : function () {
            this._clearFields(this.typeDateScenario16);
        },
        typeDateScenario16 : function () {
            this._typeTest(this.setInvalidTextScenario16);
        },
        setInvalidTextScenario16 : function () {
            this._clickTest("Button4", this.checkScenario16);
        },
        checkScenario16 : function () {
            this.testName = "checkScenario16";
            this._checkValue('b');
            this.finishTest();
        },

        // Helpers
        _clickTest : function (id, cb) {
            this.synEvent.click(this.getElementById(id), {
                fn : cb,
                scope : this
            });
        },
        _typeTest : function (cb, valid) {
            var value = (valid) ? "1/1/01" : "a";
            this.synEvent.type(this.getInputField(this.datePickerId), value, {
                fn : cb,
                scope : this
            });
        },
        _checkErrorState : function () {
            var widget = this.getWidgetInstance(this.datePickerId);
            var widgetState = (widget._cfg.formatErrorMessages.length) ? true : false;
            this.assertTrue(widgetState === this.validation, "Test: " + this.testName
                    + " - The Date Pickers error state which is currently: " + widgetState
                    + " is not correct when framework validation is currently set to:'" + this.validation + "'.");
        },
        _checkValue : function (value) {
            var element = this.getInputField(this.datePickerId);
            this.assertTrue(element.value === value, "Test: " + this.testName
                    + " - The value for the date picker should be:'" + value + "'.");
        },
        _clearFields : function (cb) {
            // chrome and IE are not playing nicely thus need to include two approaches to acheive the same result...
            var button1 = this.getElementById("Button1");
            if (button1.click) {
                // PhantomJS doesn't have function click
                button1.click();
            }

            this._clickTest("Button1", cb);
        },

        finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});

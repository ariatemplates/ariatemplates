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

/**
 * Test case for aria.widgets.form.NumberField
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.NumberFieldTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.widgets.form.TextInput"],
    $prototype : {

        /**
         * main test method, checks if the Data Model is consistent with the initialization value a small number of
         * significant values are used for the test outputs an error message if a value did not pass the test
         */
        testAsyncValuesSuite : function () {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The first test hence becomes asynchronous
            Aria.load({
                classes : ["aria.widgets.form.NumberField"],
                oncomplete : {
                    fn : this._startValuesTest,
                    scope : this
                }
            });
        },

        _startValuesTest : function () {
            var values = [50, -0, 0.1234124, 1, -1, 0.0001, 1234621389461782346, -0.127836478923619478612938476];
            for (var i = 0; i < values.length; i++) {
                if (this._testValueInit(values[i]) !== true) {
                    this.$logError("_testValueInit failed for val=" + values[i]);
                }
            }

            this.notifyTestEnd("testAsyncValuesSuite");
        },

        /**
         * helper method, called by testValuesSuite(). creates a NumberField with a given initialization value
         * (testValue) and checks if the data model is consistent afterwards returns true if the model is consistent for
         * the given input value
         * @protected
         * @param {}
         */
        _testValueInit : function (testVal) {

            // configuration data for the widget, uses the input parameter as value
            var cfg = {
                label : "Number Field:",
                labelPos : "left",
                labelAlign : "right",
                helptext : "Enter a number",
                width : 100,
                block : true,
                mandatory : true,
                value : testVal,
                errorMessages : ["Please type in a number"]
            };

            // widget creation and initialization
            var instance = this.createAndInit("aria.widgets.form.NumberField", cfg);

            // res is what we want to assert. it is then returned for more handling by caller method.
            var res = (instance.controller.getDataModel().number == testVal);
            this.assertTrue(res);
            instance.$dispose();
            this.outObj.clearAll();

            return res;
        },

        /**
         * Test bindings
         */
        testAsyncBindings : function () {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The last test hence becomes asynchronous (because it will be the first one to be executed in
            // IE)
            Aria.load({
                classes : ["aria.widgets.form.NumberField"],
                oncomplete : {
                    fn : this._testBindings,
                    scope : this
                }
            });
        },

        _testBindings : function () {
            var data = {}, helptext = "Enter a number";

            // configuration data for the widget, uses the input parameter as value
            var cfg = {
                label : "Number Field:",
                helptext : helptext,
                bind : {
                    value : {
                        inside : data,
                        to : 'number'
                    }
                }
            };

            // widget creation and initialization
            var instance = this.createAndInit("aria.widgets.form.NumberField", cfg);

            var input = instance.getTextInputField();
            this.assertTrue(input.value == helptext, "Helptext not set on input");

            aria.utils.Json.setValue(data, "number", 13);
            this.assertTrue(input.value == "13", "Value 13 not propagated to input");

            aria.utils.Json.setValue(data, "number", 0);
            this.assertTrue(input.value == "0", "Value 0 not propagated to input");

            aria.utils.Json.setValue(data, "number", null);
            this.assertTrue(input.value == helptext, "Input not reverted to original state with helptext");

            aria.utils.Json.setValue(data, "number", "13");
            this.assertErrorInLogs(aria.widgets.form.TextInput.WIDGET_VALUE_IS_WRONG_TYPE, "No error raised for value with wrong type");

            instance.$dispose();
            this.outObj.clearAll();

            this.notifyTestEnd("testAsyncBindings");
        }

    }
});

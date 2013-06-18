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

Aria.classDefinition({
    $classpath : "test.aria.html.radioButton.RadioButtonTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.html.RadioButton", "aria.utils.json", "aria.utils.FireDomEvent"],
    $prototype : {

        testWithoutInitialValue : function () {
            var container = {};

            var bindingConfig = {
                selectedValue : {
                    inside : container,
                    to : "selectedRadioButton"
                }
            };

            var cfg1 = {
                name : "group1",
                value : "a",
                bind : bindingConfig
            };
            var cfg2 = {
                name : "group1",
                value : "b",
                bind : bindingConfig
            };

            var widget1 = this.createAndInit("aria.html.RadioButton", cfg1);
            var widget2 = this.createAndInit("aria.html.RadioButton", cfg2);

            this.assertEquals(widget1._domElt.checked, false, "Widget1's checked property should be initially %2 but was %1");
            this.assertEquals(widget2._domElt.checked, false, "Widget2's checked property should be initially %2 but was %1");

            aria.utils.Json.setValue(container, "selectedRadioButton", "b");

            this.assertEquals(widget1._domElt.checked, false, "Widget1's checked property should be %2 but was %1");
            this.assertEquals(widget2._domElt.checked, true, "Widget2's checked property should be %2 but was %1");

            aria.utils.Json.setValue(container, "selectedRadioButton", "c");

            this.assertEquals(widget1._domElt.checked, false, "Widget1's checked property should be %2 but was %1");
            this.assertEquals(widget2._domElt.checked, false, "Widget2's checked property should be %2 but was %1");

            widget1.$dispose();
            widget2.$dispose();
            this.outObj.clearAll();
        },

        testWithInitialValue : function () {
            var container = {
                "selectedRadioButton" : "a"
            };

            var bindingConfig = {
                selectedValue : {
                    inside : container,
                    to : "selectedRadioButton"
                }
            };

            var cfg1 = {
                name : "group1",
                value : "a",
                bind : bindingConfig
            };
            var cfg2 = {
                name : "group1",
                value : "b",
                bind : bindingConfig
            };

            var widget1 = this.createAndInit("aria.html.RadioButton", cfg1);
            var widget2 = this.createAndInit("aria.html.RadioButton", cfg2);

            this.assertEquals(widget1._domElt.checked, true, "Widget1's checked property should be initially %2 but was %1");
            this.assertEquals(widget2._domElt.checked, false, "Widget2's checked property should be initially %2 but was %1");

            aria.utils.Json.setValue(container, "selectedRadioButton", "b");

            this.assertEquals(widget1._domElt.checked, false, "Widget1's checked property should be %2 but was %1");
            this.assertEquals(widget2._domElt.checked, true, "Widget2's checked property should be %2 but was %1");

            widget1.$dispose();
            widget2.$dispose();
            this.outObj.clearAll();
        },

        testTransformFromWidget : function () {
            var container = {
                "selectedRadioButton" : "a"
            };

            var cfg = {
                name : "group1",
                value : "a",
                bind : {
                    selectedValue : {
                        inside : container,
                        to : "selectedRadioButton",
                        transform : {
                            fromWidget : function (value) {
                                return value.toUpperCase();
                            },
                            toWidget : function (value) {
                                return value.toLowerCase();
                            }
                        }
                    }
                }
            };

            var widget = this.createAndInit("aria.html.RadioButton", cfg);

            this.assertEquals(widget._domElt.checked, true, "Transform to widget true: " + widget._domElt.checked);

            aria.utils.Json.setValue(container, "selectedRadioButton", 'WrongValue');
            this.assertEquals(widget._domElt.checked, false, "Transform to widget false: " + widget._domElt.checked);

            aria.utils.Json.setValue(container, "selectedRadioButton", 'A');
            this.assertEquals(widget._domElt.checked, true, "Transform to widget false: " + widget._domElt.checked);
            widget.$dispose();

            this.outObj.clearAll();
        },

        testReactOnClick : function () {
            var container = {};

            var cfg = {
                name : "group1",
                value : "a",
                bind : {
                    selectedValue : {
                        inside : container,
                        to : "selectedRadioButton"
                    }
                }
            };

            var widget = this.createAndInit("aria.html.RadioButton", cfg);

            this.assertEquals(widget._domElt.checked, false, "Radio button should not have been checked before click");

            aria.utils.FireDomEvent.fireEvent("click", widget._domElt);

            this.assertEquals(widget._domElt.checked, true, "Check click on dom: " + widget._domElt.checked);
            this.assertEquals(container.selectedRadioButton, "a", "Check click on data: expected value was %2 but got %1.");

            widget.$dispose();
            this.outObj.clearAll();
        },

        testNoBinding : function () {
            var container = {};

            var cfg = {
                name : "group1",
                value : "a"
            };

            var widget = this.createAndInit("aria.html.RadioButton", cfg);

            this.assertErrorInLogs(aria.html.InputElement.BINDING_NEEDED);

            widget.$dispose();
            this.outObj.clearAll();
        }

    }
});

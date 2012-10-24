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
 * Test case for binding transforms
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.WidgetTest",
    $dependencies : ["aria.widgets.controllers.TextDataController"],
    $extends : "aria.jsunit.WidgetTestCase",
    $prototype : {

        _createTextField : function (cfg, numElements) {
            var o = new aria.widgets.form.TextField(cfg, this.outObj.tplCtxt);
            o.writeMarkup(this.outObj);
            this.outObj.putInDOM();
            // init widget
            o.initWidget();
            return {
                o : o,
                dom : this.outObj.testArea.childNodes[numElements]
            };
        },

        testAsyncBindingTransformation : function () {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The first test hence becomes asynchronous
            Aria.load({
                classes : ["aria.widgets.form.TextField"],
                oncomplete : {
                    fn : this._testBindingTransformation,
                    scope : this
                }
            });
        },

        _testBindingTransformation : function () {

            var data = {
                prop : 5
            };

            var numElements = 0;

            // Create a text input that we bind to data to perform the test
            var tf = this._createTextField({
                label : "TESTLABEL",
                bind : {
                    value : {
                        to : "prop",
                        inside : data,
                        transform : {
                            toWidget : function (val) {
                                return val * 3;
                            },
                            fromWidget : function (val) {
                                return val / 3;
                            }
                        }
                    }
                }
            }, numElements);
            numElements++;

            var o = tf.o;
            var dom = tf.dom;

            // Check first initialized value (from data model)
            var initializedValue = o.getProperty("value");
            this.assertTrue(initializedValue == 15, "Wrong initialization value");

            // Change the data model value and verify that the control is updated correctly
            aria.utils.Json.setValue(data, 'prop', 10);
            var newValue = o.getProperty('value');
            this.assertTrue(newValue == 30, "Wrong transformed value after changing data model");

            // Change the widget value through setProperty
            // (same as widget should use itself when dom changes)
            // and verify that the data model is updated correctly
            o.setProperty('value', 60);
            var newDataModelValue = data.prop;
            this.assertTrue(newDataModelValue == 20, "Wrong transformed value after changing widget value");

            // Create new widget to test double initialization (cfg and bind)
            var tf2 = this._createTextField({
                label : "TESTLABEL2",
                value : "MyDefaultValue",
                bind : {
                    value : {
                        to : "prop2",
                        inside : data
                    }
                }
            }, numElements);
            numElements++;

            var o2 = tf2.o;
            var dom2 = tf2.dom;

            // Check first initialized value (from data model)
            var initializedValue2 = o2.getProperty('value');
            this.assertTrue(initializedValue2 == "MyDefaultValue", "Wrong initialization widget value");
            this.assertTrue(data.prop2 == "MyDefaultValue", "Wrong initialization data model value");

            // Clean up
            o.$dispose();
            o2.$dispose();
            this.outObj.clearAll();

            this.notifyTestEnd("testAsyncBindingTransformation");
        },

        /**
         * use case for PTR 04528812
         */
        testAsyncAdvancedTransform : function () {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The last test hence becomes asynchronous (as it will be executed first in IE)
            Aria.load({
                classes : ["aria.widgets.form.TextField"],
                oncomplete : {
                    fn : this._testAdvancedTransform,
                    scope : this
                }
            });
        },

        _testAdvancedTransform : function () {

            var data = {
                prop : [1, 2, 3]
            };

            var textfield = new aria.widgets.form.TextField({
                label : "TESTLABEL",
                bind : {
                    value : {
                        to : "prop",
                        inside : data,
                        transform : {
                            toWidget : function (val) {
                                return val.length;
                            },
                            fromWidget : function (val) {
                                return [];
                            }
                        }
                    }
                }
            }, this.outObj.tplCtxt);

            textfield._registerBindings();

            // mock textfield methods
            textfield.getTextInputField = function () {
                return {};
            };
            textfield._updateState = function () {};

            // Check first initialized value (from data model)
            var initializedValue = textfield.getProperty('value');
            this.assertTrue(initializedValue == 3, "Wrong initialization value");

            // remove one element in original array, but without notifying the widget
            data.prop.pop();

            // creates a new array with length of 2 and set it in the datamodel : value of widget should be updated as
            // transformed value as changed (stored value should not be computed from previous datamodel value)
            var newArray = [1, 2];

            aria.utils.Json.setValue(data, 'prop', newArray);
            var newValue = textfield.getProperty('value');
            this.assertTrue(newValue == 2, "Wrong transformed value after changing data model");

            // Clean up
            textfield.$dispose();
            this.outObj.clearAll();

            this.notifyTestEnd("testAsyncAdvancedTransform");
        }
    }
});
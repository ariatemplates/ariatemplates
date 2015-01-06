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
 * Test case for aria.widgets.form.Textarea
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.TextareaTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.widgets.form.Textarea", "aria.core.Browser"],
    $prototype : {

        /**
         * Creates a Textarea instance and push it in the DOM
         * @protected
         * @param {Object} cfg
         * @return {Object} instance and dom
         */
        _createTextarea : function (cfg) {
            // use textfield to have a simple controller
            var instance = new aria.widgets.form.Textarea(cfg, this.outObj.tplCtxt);
            instance.writeMarkup(this.outObj);
            this.outObj.putInDOM();
            // init widget
            instance.initWidget();
            var dom = instance.getDom();
            if (aria.core.Browser.isIE7) {
                dom = dom.firstChild;
            }
            return {
                instance : instance,
                dom : dom
            };
        },

        /**
         * Destroy an instance and clean DOM
         * @protected
         * @param {Object} _instance
         */
        _destroyTextarea : function (instance) {
            instance.$dispose();
            this.outObj.clearAll();
        },

        /**
         * Create and destroy an instance with given configuration
         * @protected
         * @param {Object} cfg
         */
        _textFieldTestHelper : function (cfg) {
            var tf = this._createTextarea(cfg);
            var instance = tf.instance;
            this._destroyTextarea(instance);
        },

        /**
         * Test bindings on a textfield
         */
        testAsyncBinding : function () {

            // Need to load the widget class at test execution time because
            // otherwise aria.widgets.AriaSkinInterface is
            // not defined. The first test hence becomes asynchronous
            Aria.load({
                classes : ["aria.widgets.form.Textarea"],
                oncomplete : {
                    fn : this._testBinding,
                    scope : this
                }
            });
        },

        _testBinding : function () {

            var data = {
                prop : "value"
            };
            var array = ["value", ['error']];
            // test binding with array. Bind formatErrorMessage that will be
            // changed on widget creation
            var tf = this._createTextarea({
                label : "TESTLABEL",
                bind : {
                    value : {
                        to : 0,
                        inside : array
                    },
                    formatErrorMessages : {
                        to : 1,
                        inside : array
                    }
                },
                formatError : false
            });
            var instance = tf.instance;
            this.assertTrue(instance._cfg.value == "value");
            this.assertEquals(tf.dom.getElementsByTagName('textarea')[0].value, "value", "Value %1 not propagated to DOM");

            // change value through binding
            aria.utils.Json.setValue(array, 0, null);

            this.assertEquals(tf.dom.getElementsByTagName('textarea')[0].value, "", "Empty value not propagated to DOM");

            this._destroyTextarea(instance);

            tf = this._createTextarea({
                label : "TESTLABEL",
                bind : {
                    value : {
                        to : "prop",
                        inside : data
                    }
                }
            });
            instance = tf.instance;
            this.assertTrue(instance._cfg.value == "value");

            this._destroyTextarea(instance);

            // test prefill binding
            tf = this._createTextarea({
                bind : {
                    prefill : {
                        to : "prop",
                        inside : data
                    }
                }
            });
            instance = tf.instance;

            this.assertTrue(instance._cfg.prefill == "value");
            // test the automatic binding of the prefillError property
            this.assertTrue(aria.utils.Type.isObject(instance._cfg.bind.prefillError));
            // test the state of the Textarea
            this.assertTrue(instance._state == "prefill" && instance._isPrefilled && !instance._helpTextSet);
            // test that the prefill has not been copied to the value
            this.assertTrue(instance._cfg.value === undefined);

            this._destroyTextarea(instance);

            this.notifyTestEnd("testAsyncBinding");
        },

        /**
         * Test the structure of an input
         */
        testBaseNormalMarkup : function () {
            var tf = this._createTextarea({
                label : "TESTLABEL"
            });
            var instance = tf.instance;
            var dom = tf.dom;

            // test top level dom span
            this.assertTrue(dom.tagName === "SPAN");

            this.assertTrue(dom.childNodes.length === 2);

            // test label
            var label = dom.childNodes[0];
            this.assertTrue(label.tagName === "LABEL");
            this.assertTrue(label.innerHTML === "TESTLABEL");

            this._destroyTextarea(instance);
        },

        /**
         * Test a configuration with disable
         */
        testDisabled : function () {
            this._textFieldTestHelper({
                label : "TESTLABEL",
                disabled : true
            });
        },

        /**
         * Test a configuration with readonly
         */
        testReadOnly : function () {
            this._textFieldTestHelper({
                label : "TESTLABEL",
                readOnly : true
            });
        },

        /**
         * Test an error configuration
         */
        testErrorNormal : function () {
            this._textFieldTestHelper({
                label : "TESTLABEL",
                error : true
            });
        },

        testAutoSelect : function () {
            // test autoselect is turned on
            var tf1 = this._createTextarea({
                label : "TESTLABEL",
                value : "Selected?",
                autoselect : true
            });

            // autoselect on
            var instance1 = tf1.instance;
            instance1._hasFocus = true;
            instance1._dom_onclick();
            if (!aria.core.Browser.isOldIE) {
                this.assertTrue(instance1._textInputField.selectionStart === 0);
                this.assertTrue(instance1._textInputField.selectionEnd === instance1._textInputField.value.length);
            }

            // autoselect off
            instance1._textInputField.selectionEnd = 0;
            instance1._cfg.autoselect = false;
            instance1._dom_onclick();
            if (!aria.core.Browser.isOldIE) {
                this.assertTrue(instance1._textInputField.selectionEnd === 0);
            }
            this._destroyTextarea(instance1);
        },

        /**
         * Test the setPrefillText method
         */
        testSetPrefillText : function () {
            var tf = this._createTextarea({
                label : "TESTLABEL"
            });
            var instance = tf.instance;

            instance.setPrefillText(true, "prefill", true);
            var field = instance.getTextInputField();
            // test that the field value is updated
            this.assertTrue(field.value == "prefill");
            // test that the widget state is updated too
            this.assertTrue(instance._state == "prefill");
            this._destroyTextarea(instance);

            tf = this._createTextarea({
                label : "TESTLABEL"
            });
            instance = tf.instance;

            instance.setPrefillText(true, "prefill", false);
            field = instance.getTextInputField();
            // test that the field value is updated
            this.assertTrue(field.value == "prefill");
            // test that the field value is not updated because of the false
            // parameter
            this.assertTrue(instance._isPrefilled);
            this.assertFalse(instance._state == "prefill");
            this._destroyTextarea(instance);

            tf = this._createTextarea({
                label : "TESTLABEL"
            });
            instance = tf.instance;
            instance._cfg.prefillError = true;
            instance.setPrefillText(true, "prefill", true);
            field = instance.getTextInputField();
            // test that the widget is not updated when an prefill error occurs
            this.assertFalse(field.value == "prefill");
            this.assertFalse(instance._isPrefilled);
            this.assertFalse(instance._state == "prefill");
            this._destroyTextarea(instance);

            tf = this._createTextarea({
                label : "TESTLABEL"
            });
            instance = tf.instance;
            instance.setPrefillText(true, "prefill", true);
            field = instance.getTextInputField();
            instance.setPrefillText(true, "");
            // test that the widget exits the prefill state when the prefill
            // value is ""
            this.assertFalse(instance._state == "prefill");
            this._destroyTextarea(instance);

            tf = this._createTextarea({
                label : "TESTLABEL"
            });
            instance = tf.instance;
            instance.setPrefillText(true, "prefill", true);
            field = instance.getTextInputField();
            instance.setPrefillText(false);
            // test that the widget exits the prefill state when the prefill
            // value is ""
            this.assertFalse(instance._isPrefilled);
            // no state update
            this.assertTrue(instance._state == "prefill");
            this._destroyTextarea(instance);

            tf = this._createTextarea({
                label : "TESTLABEL"
            });
            instance = tf.instance;
            instance.setPrefillText(true, "prefill", true);
            field = instance.getTextInputField();
            instance.setPrefillText(false, null, true);
            // test that the widget exits the prefill state when the prefill
            // value is ""
            this.assertFalse(instance._isPrefilled);
            // state update
            this.assertFalse(instance._state == "prefill");
            this._destroyTextarea(instance);

        },

        /**
         * Test mandatory and error at the same time
         */
        testAsyncErrorMandatory : function () {
            // Need to load the widget class at test execution time because
            // otherwise aria.widgets.AriaSkinInterface is
            // not defined. The last test hence becomes asynchronous (because it
            // is the first one to be executed in IE)
            Aria.load({
                classes : ["aria.widgets.form.Textarea"],
                oncomplete : {
                    fn : this._testErrorMandatory,
                    scope : this
                }
            });
        },

        _testErrorMandatory : function () {
            this._textFieldTestHelper({
                label : "TESTLABEL",
                mandatory : true,
                error : true
            });
            this.notifyTestEnd("testAsyncErrorMandatory");
        },

        /**
         * Create an instance of a text input with the given configuration, and check the autoselect internal value of
         * the widget after it is created.
         * @param {Object} cfg
         * @param {Boolean} expectedValue
         */
        _testAutoSelectFromEnvHelper : function (cfg, expectedValue) {
            var tf = this._createTextarea(cfg);
            var instance = tf.instance;
            this.assertTrue(instance._cfg.autoselect == expectedValue, "Unexpected value for autoselect: "
                    + instance._cfg.autoselect + " (expected: " + expectedValue + ")");
            this._destroyTextarea(instance);
        },

        /**
         * Test that the value set in the environment for the autoselect widget setting is actually used by the widget.
         * (PTR 05165010)
         */
        testAutoSelectFromEnv : function () {
            aria.core.AppEnvironment.setEnvironment({
                widgetSettings : {
                    autoselect : true
                }
            });

            this._testAutoSelectFromEnvHelper({}, true);
            this._testAutoSelectFromEnvHelper({
                autoselect : true
            }, true);
            this._testAutoSelectFromEnvHelper({
                autoselect : false
            }, false);

            aria.core.AppEnvironment.setEnvironment({
                widgetSettings : {
                    autoselect : false
                }
            });

            this._testAutoSelectFromEnvHelper({}, false);
            this._testAutoSelectFromEnvHelper({
                autoselect : true
            }, true);
            this._testAutoSelectFromEnvHelper({
                autoselect : false
            }, false);

            aria.core.AppEnvironment.setEnvironment({});
        },

        testEncodedCharacters : function () {
            var data = {
                value : "&currency&cent"
            };
            var tf = this._createTextarea({
                label : "TESTLABEL",
                bind : {
                    value : {
                        to : "value",
                        inside : data
                    }
                }
            });
            var instance = tf.instance;
            this.assertEquals(tf.dom.getElementsByTagName('textarea')[0].value, data.value, "Value has been transformed incorrectly");
            this._destroyTextarea(instance);
        }
    }
});

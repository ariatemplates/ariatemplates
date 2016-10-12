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
 * Test case for aria.widgets.form.CheckBox
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.CheckBoxTestCase",
    $dependencies : ["aria.utils.Json"],
    $extends : "aria.jsunit.WidgetTestCase",
    $prototype : {
        /**
         * Async helper that creates a checkbox
         * @param {Object} cfg
         * @param {Object} callback
         * @return {Object}
         */
        _createCheckBox : function (cfg, callback) {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The first test hence becomes asynchronous
            Aria.load({
                classes : ["aria.widgets.form.CheckBox"],
                oncomplete : {
                    fn : function () {
                        var instance = new aria.widgets.form.CheckBox(cfg, this.outObj.tplCtxt);
                        instance.writeMarkup(this.outObj);
                        this.outObj.putInDOM();
                        // init widget
                        instance.initWidget();
                        var dom = instance.getDom();
                        if (aria.core.Browser.isIE7) {
                            dom = dom.firstChild;
                        }
                        this.$callback(callback, {
                            instance : instance,
                            dom : dom
                        });
                    },
                    scope : this
                }
            });

        },

        /**
         * Helper to destroy a checkbox
         * @param {Object} inst
         */
        _destroyCheckBox : function (inst) {
            inst.$dispose();
            this.outObj.clearAll();
        },

        /**
         * Test base layout
         */
        testAsyncBaseNormalMarkup : function () {
            this._createCheckBox({
                label : "TESTLABEL",
                labelPos : "right",
                value : "true"
            }, {
                fn : this._testBaseNormalMarkup,
                scope : this
            });
        },

        /**
         * Execute test scenario for testAsyncBaseNormalMarkup
         * @param {Object} checkbox
         */
        _testBaseNormalMarkup : function (checkbox) {
            var instance = checkbox.instance;
            var dom = checkbox.dom;

            // test top level dom span
            this.assertTrue(dom.tagName === "SPAN");
            this.assertTrue(dom.childNodes.length === 3);
            // display:inline-block has been moved from inline style to the CSS file
            // this.assertTrue(dom.style.display === "inline-block");

            // test icon
            var icon = dom.childNodes[0];
            this.assertTrue(icon.tagName === "SPAN");
            // display:inline-block has been moved from inline style to the CSS file
            // this.assertTrue(icon.style.display === "inline-block");
            this.assertTrue(icon.className.indexOf("xICNcheckBoxes") != -1);
            this.assertTrue(icon.style.backgroundPosition !== "");

            // test hidden input field
            var input = dom.childNodes[1];
            this.assertTrue(input.tagName === "INPUT");
            this.assertTrue(input.value === "true");
            this.assertTrue(input.checked === true);

            // test check box label
            var sndSpan = dom.childNodes[2];
            this.assertTrue(sndSpan.tagName === "SPAN");

            var label = sndSpan.childNodes[0];
            this.assertTrue(label.tagName === "LABEL");
            // display:inline-block has been moved from inline style to the CSS file
            // this.assertTrue(label.style.display === "inline-block");
            this.assertTrue(label.innerHTML === "TESTLABEL");

            this._destroyCheckBox(instance);

            this.notifyTestEnd("testAsyncBaseNormalMarkup");

        },

        testAsyncFocusAndBlur : function () {
            this._createCheckBox({
                label : "TESTLABEL2",
                labelPos : "right",
                value : "true"
            }, {
                fn : this._testFocusAndBlur,
                scope : this
            });
        },

        /**
         * Execute test scenario for testAsyncFocusAndBlur
         * @param {Object} checkbox
         */
        _testFocusAndBlur : function (checkbox) {

            var instance = checkbox.instance;
            var dom = checkbox.dom;

            // fire the focus method
            instance._dom_onfocus();

            // fire the blur method
            instance._dom_onblur();

            this._destroyCheckBox(instance);

            this.notifyTestEnd("testAsyncFocusAndBlur");
        },

        /**
         * Test listener resulting in checknox destruction
         */
        testAsyncOnChange : function () {

            // create data holder
            this.testData = {
                "testValue" : true
            };

            this._createCheckBox({
                label : "TESTLABEL3",
                labelPos : "right",
                bind : {
                    value : {
                        to : "testValue",
                        inside : this.testData
                    }
                },
                onchange : {
                    fn : function () {
                        this.testData.changed = true;
                    },
                    scope : this
                }
            }, {
                fn : this._testOnChange,
                scope : this
            });
        },

        /**
         * Execute test scenario for testAsyncOnChange
         * @param {Object} checkbox
         */
        _testOnChange : function (checkbox) {

            var instance = checkbox.instance;
            var dom = checkbox.dom;

            // creates a listener that will destroy the checkbox
            aria.utils.Json.addListener(this.testData, "testValue", {
                fn : function () {
                    this._destroyCheckBox(instance);
                },
                scope : this
            });

            // simulate checkbox click > this should not raise any error
            instance._toggleValue();

            // this.assertTrue(this.testData.changed, "onchanged not called");

            this.notifyTestEnd("testAsyncOnChange");
        }

    }
});

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
    $classpath : "test.aria.html.DisabledTraitTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.html.Select", "aria.html.CheckBox", "aria.html.RadioButton", "aria.html.TextInput",
            "aria.utils.Json"],
    $prototype : {

        testDisabledBinding : function () {

            var container = {
                disabled : true,
                value : ""
            };

            var cfg = {
                bind : {
                    disabled : {
                        inside : container,
                        to : "disabled"
                    }
                }
            };

            this._select = this.createAndInit("aria.html.Select", cfg);
            this._checkBox = this.createAndInit("aria.html.CheckBox", cfg);
            this._radioButton = this.createAndInit("aria.html.RadioButton", cfg);
            this._textInput = this.createAndInit("aria.html.TextInput", cfg);

            this._assertDisabled(true);
            aria.utils.Json.setValue(container, "disabled", false);
            this._assertDisabled(false);

            this._disposeCreatedWidgets();
        },

        testDisabledBindingInitTrue : function () {

            var container = {};

            var cfg = {
                bind : {
                    disabled : {
                        inside : container,
                        to : "disabled"
                    }
                }
            };

            this._select = this.createAndInit("aria.html.Select", cfg);
            this._checkBox = this.createAndInit("aria.html.CheckBox", cfg);
            this._radioButton = this.createAndInit("aria.html.RadioButton", cfg);
            this._textInput = this.createAndInit("aria.html.TextInput", cfg);

            this._assertDisabled(false);

            this._disposeCreatedWidgets();
        },

        testDisabledBindingInitFalse : function () {

            var container = {};

            var cfg = {
                bind : {
                    disabled : {
                        inside : container,
                        to : "disabled"
                    }
                }
            };

            var cfgTwo = {
                bind : {
                    disabled : {
                        inside : container,
                        to : "disabled"
                    }
                },
                attributes : {
                    disabled : "disabled"
                }
            };

            this._select = this.createAndInit("aria.html.Select", cfgTwo);
            this._checkBox = this.createAndInit("aria.html.CheckBox", cfg);
            this._radioButton = this.createAndInit("aria.html.RadioButton", cfg);
            this._textInput = this.createAndInit("aria.html.TextInput", cfg);

            this._assertDisabled(true);
            aria.utils.Json.setValue(container, "disabled", false);
            this._assertDisabled(false);

            this._disposeCreatedWidgets();
        },

        _assertDisabled : function (value) {
            var additionalText = value ? "" : "not ";
            this.assertEquals(this._select._domElt.disabled, value, "Select should" + additionalText + " be disabled");
            this.assertEquals(this._checkBox._domElt.disabled, value, "CheckBox should" + additionalText
                    + " be disabled");
            this.assertEquals(this._radioButton._domElt.disabled, value, "radioButton should" + additionalText
                    + " be disabled");
            this.assertEquals(this._textInput._domElt.disabled, value, "textInput should" + additionalText
                    + " be disabled");
        },

        _disposeCreatedWidgets : function () {
            this._select.$dispose();
            this._checkBox.$dispose();
            this._radioButton.$dispose();
            this._textInput.$dispose();
            this.outObj.clearAll();
        }

    }
});
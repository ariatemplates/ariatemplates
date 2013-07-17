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
    $classpath : "test.aria.html.inputElement.InputElementBaseTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.html.InputElement", "aria.utils.Json"],
    $statics : {
        WIDGET_CLASS_NOT_SET : "Property _widgetClass has not been properly set. Beware: this test cannot be executed by itslef, it has to be extended."
    },
    $prototype : {

        /**
         * Class of the widget to test. It must be set in the inheriting test class
         * @type String
         * @protected
         */
        _widgetClass : null,

        testDisabledBinding : function () {

            if (!this._widgetClass) {
                this.$logError(this.WIDGET_CLASS_NOT_SET);
                return;
            }
            var container = {
                disabled : true
            };

            var cfg = {
                bind : {
                    disabled : {
                        inside : container,
                        to : "disabled"
                    }
                }
            };

            var widget = this.createAndInit(this._widgetClass, cfg);

            this.assertEquals(widget._domElt.disabled, true, "CheckBox should be disabled");

            aria.utils.Json.setValue(container, "disabled", false);
            this.assertEquals(widget._domElt.disabled, false, "CheckBox should not be disabled");

            widget.$dispose();
            this.outObj.clearAll();
        },

        testDisabledInitialTrueValue : function () {
            if (!this._widgetClass) {
                this.$logError(this.WIDGET_CLASS_NOT_SET);
                return;
            }

            var container = {};

            var cfg = {
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

            var widget = this.createAndInit(this._widgetClass, cfg);

            this.assertEquals(widget._domElt.disabled, true, "CheckBox should be disabled");
            this.assertEquals(container.disabled, true, "Data model bound to \"disabled\" should be set to true");

            aria.utils.Json.setValue(container, "disabled", false);
            this.assertEquals(widget._domElt.disabled, false, "CheckBox should not be disabled");

            widget.$dispose();
            this.outObj.clearAll();
        },

        testDisabledInitialFalseValue : function () {
            if (!this._widgetClass) {
                this.$logError(this.WIDGET_CLASS_NOT_SET);
                return;
            }

            var container = {
                disabled : "invalidType"
            };

            var cfg = {
                bind : {
                    disabled : {
                        inside : container,
                        to : "disabled"
                    }
                }
            };

            var widget = this.createAndInit(this._widgetClass, cfg);

            this.assertEquals(widget._domElt.disabled, false, "CheckBox should not be disabled");
            this.assertEquals(container.disabled, false, "Data model bound to \"disabled\" should be set to false");

            widget.$dispose();
            this.outObj.clearAll();
        }

    }
});
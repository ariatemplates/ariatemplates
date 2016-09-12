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
    $classpath : "test.aria.widgets.form.datefield.issue303.InvalidState",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.widgets.form.DateField", "aria.utils.Date", "aria.utils.Dom"],
    $prototype : {
        tearDown : function () {
            aria.jsunit.helpers.OutObj.clearAll();
        },

        createInstance : function (cfg) {
            // Ignore most of the options because those are normalized from other widgets
            var config = {
                bind : cfg.bind,
                helptext : cfg.helptext,
                minValue : cfg.minValue,
                maxValue : cfg.maxValue
            };
            // doing a json.clone won't work because it'll recreate the datamodel

            var widget = new aria.widgets.form.DateField(config, aria.jsunit.helpers.OutObj.tplCtxt);

            // Prevent the popup from opening
            widget._validationPopupShow = Aria.empty;

            return widget;
        },

        initializeWidgets : function (/* list of widgets*/) {
            var widget;
            for (var i = 0; i < arguments.length; i += 1) {
                widget = arguments[i];
                widget.writeMarkup(this.outObj);
            }

            this.outObj.putInDOM();

            for (i = 0; i < arguments.length; i += 1) {
                widget = arguments[i];
                widget.initWidget();
                widget.initWidgetDom();
            }
        },

        /**
         * When the value is not bound, check that changing from valid/invalid still works
         */
        testInvalidtoValid : function () {
            var datamodel = {
                value : ""
            };

            var cfg = {
                helptext : "help",
                minValue : new Date(2000, 0, 1),
                maxValue : new Date(2100, 11, 31)
            };

            var widget = this.createInstance(cfg);
            this.initializeWidgets(widget);

            var input = widget.getTextInputField();

            // Set the widgets as invalid
            widget._dom_onfocus();
            input.value = "invalid";
            widget._dom_onblur();

            this.assertEquals(input.value, "invalid", "Input value should be %2, got %1.");

            // Now try to have a valid value
            var today = new Date();
            var formatted = aria.utils.Date.format(today, widget.controller._pattern);

            widget._dom_onfocus();
            input.value = formatted.replace(/\//g, "-");
            widget._dom_onblur();

            this.assertEquals(input.value, formatted, "Input value should be %2, got %1.");

            widget.$dispose();
        },

        /**
         * When the value is not bound, check that changing from valid/invalid still works
         */
        testValidToValid : function () {
            var datamodel = {
                value : ""
            };

            var cfg = {
                helptext : "help",
                minValue : new Date(2000, 0, 1),
                maxValue : new Date(2100, 11, 31)
            };

            var widget = this.createInstance(cfg);
            this.initializeWidgets(widget);

            var input = widget.getTextInputField();

            // Set the widgets as invalid
            var today = new Date();
            var formatted = aria.utils.Date.format(today, widget.controller._pattern);

            widget._dom_onfocus();
            input.value = formatted;
            widget._dom_onblur();

            this.assertEquals(input.value, formatted, "Input value should be %2, got %1.");

            // Now set another valid date
            var tomorrow = aria.utils.Date.interpret("+1");
            formatted = aria.utils.Date.format(tomorrow, widget.controller._pattern);

            widget._dom_onfocus();
            input.value = formatted.replace(/\//g, "-");
            widget._dom_onblur();

            this.assertEquals(input.value, formatted, "Input value should be %2, got %1.");

            widget.$dispose();
        },

        /**
         * When the value is not bound, check that changing from valid/invalid still works
         */
        testValidToInvalid : function () {
            var datamodel = {
                value : ""
            };

            var cfg = {
                helptext : "help",
                minValue : new Date(2000, 0, 1),
                maxValue : new Date(2100, 11, 31)
            };

            var widget = this.createInstance(cfg);
            this.initializeWidgets(widget);

            var input = widget.getTextInputField();

            // Set the widgets as valid
            var today = new Date();
            var formatted = aria.utils.Date.format(today, widget.controller._pattern);

            widget._dom_onfocus();
            input.value = formatted;
            widget._dom_onblur();

            this.assertEquals(input.value, formatted, "Input value should be %2, got %1.");

            // Now set it invalid
            widget._dom_onfocus();
            input.value = "invalid";
            widget._dom_onblur();

            this.assertEquals(input.value, "invalid", "Input value should be %2, got %1.");
            // but we should also check it's style
            var color = aria.utils.Dom.getStyle(input, "color");
            var isBlack = color === "black" || color === "rgb(0, 0, 0)" || /\#000(000)?/.test(color);
            this.assertTrue(isBlack, "Input should be black got color '" + color + "'");

            widget.$dispose();
        }
    }
});

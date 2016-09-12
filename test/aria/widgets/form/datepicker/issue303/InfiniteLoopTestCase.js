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
    $classpath : "test.aria.widgets.form.datepicker.issue303.InfiniteLoopTestCase",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.widgets.form.DatePicker", "aria.utils.Date"],
    $prototype : {
        tearDown : function () {
            aria.jsunit.helpers.OutObj.clearAll();
        },

        createInstance : function (cfg) {
            // Ignore most of the options because those are normalized from other widgets
            var config = {
                bind : cfg.bind,
                helptext : cfg.helptext
            };
            // doing a json.clone won't work because it'll recreate the datamodel

            var widget = new aria.widgets.form.DatePicker(config, aria.jsunit.helpers.OutObj.tplCtxt);

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
         * There used to be an infinite loop when setting an invalid text on a datepicker bound to the same value as
         * another datepicker. With this test I recreate the issue, set the value and assert that nothing bad happens
         */
        testInfiniteLoop : function () {
            var today = new Date();
            var datamodel = {
                value : today
            };

            var cfg = {
                bind : {
                    value : {
                        inside : datamodel,
                        to : "value"
                    }
                }
            };

            var widget = this.createInstance(cfg);
            var otherListener = this.createInstance(cfg);
            this.initializeWidgets(widget, otherListener);

            var input = widget.getTextInputField();

            var formatted = aria.utils.Date.format(today, widget.controller._pattern);
            this.assertEquals(input.value, formatted, "Input value should be %2, got %1");

            // Now simulate a type
            try {
                widget._dom_onfocus();
                input.value = "invalid text";
                widget._dom_onblur();
            } catch (ex) {
                this.$logError("Changing the value shouldn't throw.\nError message: %1", [ex.message], ex);
            }

            widget.$dispose();
            otherListener.$dispose();

            this.assertLogsEmpty();
        },

        /**
         * This test verifies that two datepicker bound both to value and invalid text work as expected. At any stage
         * they should have the same value and invalid text is more important than value. It should be kept even after
         * typing on a field that has already a value (it's old)
         */
        testDualBinding : function () {
            var today = new Date();
            var datamodel = {
                value : today,
                invalid : "wrong"
            };

            var cfg = {
                bind : {
                    value : {
                        inside : datamodel,
                        to : "value"
                    },
                    invalidText : {
                        inside : datamodel,
                        to : "invalid"
                    }
                }
            };

            var widget = this.createInstance(cfg);
            var other = this.createInstance(cfg);
            this.initializeWidgets(widget, other);

            var inputOne = widget.getTextInputField();
            var inputTwo = other.getTextInputField();

            var formatted = aria.utils.Date.format(today, widget.controller._pattern);
            this.assertEquals(inputOne.value, formatted, "Input value 1 should be %2, got %1");
            this.assertEquals(inputTwo.value, formatted, "Input value 2 should be %2, got %1");

            // Now simulate a type
            widget._dom_onfocus();
            inputOne.value = "invalid text";
            widget._dom_onblur();

            this.assertEquals(inputTwo.value, "invalid text", "Input value 2 should be %2, got %1");

            var tomorrow = aria.utils.Date.interpret("+1");
            var formattedTomorrow = aria.utils.Date.format(tomorrow, widget.controller._pattern);

            widget._dom_onfocus();
            inputOne.value = formattedTomorrow;
            widget._dom_onblur();

            // Input two should just be the same
            this.assertEquals(inputOne.value, formattedTomorrow, "Input value 1 should be %2, got %1");
            this.assertEquals(inputTwo.value, formattedTomorrow, "Input value 2 should be %2, got %1");
            // Date might differ on the time
            this.assertTrue(aria.utils.Date.isSameDay(datamodel.value, tomorrow), "Value in data model is not tomorrow");

            widget.$dispose();
            other.$dispose();
        },

        /**
         * This test verifies that the prefill is added correctly on both datepicker. Prefill is bindable and should be
         * used when the value is empty
         */
        testInvalidTextAndPrefill : function () {
            var today = new Date();
            var tomorrow = aria.utils.Date.interpret("+1");
            var datamodel = {
                value : today,
                invalid : "wrong",
                prefill : tomorrow
            };

            var cfg = {
                bind : {
                    invalidText : {
                        inside : datamodel,
                        to : "invalid"
                    },
                    prefill : {
                        inside : datamodel,
                        to : "prefill"
                    }
                }
            };

            var widget = this.createInstance(cfg);
            var other = this.createInstance(cfg);
            this.initializeWidgets(widget, other);

            var inputOne = widget.getTextInputField();
            var inputTwo = other.getTextInputField();

            var formatted = aria.utils.Date.format(tomorrow, widget.controller._pattern);

            // I expect to see the invalidText
            this.assertEquals(inputOne.value, "wrong", "Input value 1 should be %2, got %1");
            this.assertEquals(inputTwo.value, "wrong", "Input value 2 should be %2, got %1");

            // Now simulate canceling everything
            widget._dom_onfocus();
            inputOne.value = "";
            widget._dom_onblur();

            this.assertEquals(inputOne.value, formatted, "Input value 1 should be %2, got %1");
            this.assertEquals(inputTwo.value, formatted, "Input value 2 should be %2, got %1");

            widget.$dispose();
            other.$dispose();
        },

        /**
         * This test verifies the presence of help text in both datepickers. The helptext should be used when there's no
         * value
         */
        testHelpText : function () {
            var today = new Date();
            var datamodel = {
                value : today,
                invalid : "wrong"
            };

            var cfg = {
                bind : {
                    invalidText : {
                        inside : datamodel,
                        to : "invalid"
                    }
                },
                helptext : "help me!"
            };

            var widget = this.createInstance(cfg);
            var other = this.createInstance(cfg);
            this.initializeWidgets(widget, other);

            var inputOne = widget.getTextInputField();
            var inputTwo = other.getTextInputField();

            // I expect to see the invalidText
            this.assertEquals(inputOne.value, "wrong", "Input value 1 should be %2, got %1");
            this.assertEquals(inputTwo.value, "wrong", "Input value 2 should be %2, got %1");

            // Now simulate canceling everything
            widget._dom_onfocus();
            inputOne.value = "";
            widget._dom_onblur();

            this.assertEquals(inputOne.value, "help me!", "Input value 1 should be %2, got %1");
            this.assertEquals(inputTwo.value, "help me!", "Input value 2 should be %2, got %1");

            widget.$dispose();
            other.$dispose();
        }
    }
});

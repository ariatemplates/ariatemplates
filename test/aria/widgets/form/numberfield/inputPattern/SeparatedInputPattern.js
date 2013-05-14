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

/**
 * This test is pretty much like InputPattern with the difference that here we try to write numbers with a grouping
 * separator
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.numberfield.inputPattern.SeparatedInputPattern",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.core.JsonValidator"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.form.numberfield.inputPattern.InputPatternTpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.assertErrorInLogs(aria.core.JsonValidator.INVALID_CONFIGURATION);

            aria.core.AppEnvironment.setEnvironment({
                "decimalFormatSymbols" : {
                    decimalSeparator : "(",
                    groupingSeparator : ")",
                    strictGrouping : true
                },
                "currencyFormats" : {
                    currencyFormat : function () {
                        return "##,##0.00";
                    },
                    currencySymbol : "$"
                }
            });

            this.clickAndType("noPattern", "1)000", {
                fn : this.checkNoPattern,
                scope : this
            });
        },

        checkNoPattern : function () {
            var fieldValue = this.getInputField("noPattern").value;
            var widget = this.getWidgetInstance("noPattern");
            var widgetDMvalue = widget.controller._dataModel.number;

            // Having a default pattern I expect the number to be formatted
            this.assertEquals("1)000(00", fieldValue, "w/o pattern is not correct, got " + fieldValue);
            this.assertEquals(widgetDMvalue, 1000, "value stored in the datamodel is wrong, got " + widgetDMvalue);

            this.clickAndType("pattern", "1)0)0)0", {
                fn : this.checkPattern,
                scope : this
            });
        },

        checkPattern : function () {
            var fieldValue = this.getInputField("pattern").value;
            var widget = this.getWidgetInstance("noPattern");
            var widgetDMvalue = widget.controller._dataModel.number;

            // Having a default pattern I expect the number to be formatted
            this.assertEquals("1)0)0)0(0", fieldValue, "w/ pattern is not correct, got " + fieldValue);
            this.assertEquals(widgetDMvalue, 1000, "value stored in the datamodel is wrong, got " + widgetDMvalue);

            this.end();
        }
    }
});

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

var Aria = require("ariatemplates/Aria");
var AppEnvironment = require("ariatemplates/core/AppEnvironment");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.input.InputBaseTestCase",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : this.myTemplate
        });
    },
    $prototype : {
        run : function () {
            AppEnvironment.setEnvironment({
                appSettings : {
                    waiAria : null
                }
            }, {
                scope : this,
                fn : this.$TemplateTestCase.run
            });
        },

        checkAttributes : function () {
            // get widgets to be tested
            this.widgetDefaultWithLabel = this.getWidgetInstance("default - with label");
            this.widgetDefaultNoLabel = this.getWidgetInstance("default - no label");
            this.widgetEnabledWithLabelHidden = this.getWidgetInstance("enabled - with label hidden");
            this.widgetEnabledWithBoundLabelHidden = this.getWidgetInstance("enabled - with bound label hidden");
            this.widgetEnabledWithLabel = this.getWidgetInstance("enabled - with label");
            this.widgetEnabledNoLabel = this.getWidgetInstance("enabled - no label");
            this.widgetDisabledWithLabel = this.getWidgetInstance("disabled - with label");
            this.widgetDisabledNoLabel = this.getWidgetInstance("disabled - no label");

            // start test cases
            this.checkAccessibilityUndefined();
            this.checkAccessibilityEnabled();
            this.checkAccessibilityDisabled();
            this.notifyTemplateTestEnd();
        },

        checkAccessibility : function (widget) {
            var widgetWithLabel = this[widget + "WithLabel"];
            var inputWithLabel = widgetWithLabel.getTextInputField();
            var inputNoLabel = this[widget + "NoLabel"].getTextInputField();

            // if there is a label: aria-labelledby is not added to the input element
            this.assertNull(inputWithLabel.getAttribute('aria-labelledby'), "If there is a label the attribute aria-labelledby is not added to the input element.");

            // if there isn't a label: aria-label is not added to the input element
            this.assertNull(inputNoLabel.getAttribute('aria-label'), "If there isn't a label the attribute aria-label is not added to the input element.");

            // if there is a label then an id is not automatically added to the label element
            this.assertFalsy(widgetWithLabel.getLabel().id, "There is no id generated for the label element.");
        },

        checkAccessibilityUndefined : function () {
            this.checkAccessibility("widgetDefault");
        },

        checkAccessibilityDisabled : function () {
            this.checkAccessibility("widgetDisabled");
        },

        checkAccessibilityEnabled : function () {
            // No need to test label bindings, as a change in the value of the label doesn't impact the attributes set
            var inputWithLabelHidden = this.widgetEnabledWithLabelHidden.getTextInputField();
            var inputWithBoundLabelHidden = this.widgetEnabledWithBoundLabelHidden.getTextInputField();
            var inputWithLabel = this.widgetEnabledWithLabel.getTextInputField();
            var inputNoLabel = this.widgetEnabledNoLabel.getTextInputField();

            // if there is a label then an id is automatically added to the label element
            this.assertTruthy(this.widgetEnabledWithLabel.getLabel().id, "There is no id generated for the label element.");

            // if there is a label: aria-labelledby is added to the input element
            this.assertNotNull(inputWithLabel.getAttribute('aria-labelledby'), "checkAccessibilityEnabled: if there is a label the attribute aria-labelledby is added to the input element.");

            // if there is a label: aria-labelledby is added to the input element, value is the id of the widget
            this.assertEquals(this.widgetEnabledWithLabel.getLabel().id, inputWithLabel.getAttribute('aria-labelledby'), "checkAccessibilityEnabled: if there is a label the attribute aria-labelledby is added to the input element, value is the id of the widget.");

            // if there isn't a label: aria-label is not added to the input element
            this.assertNull(inputNoLabel.getAttribute('aria-label'));

            // if there is a label defined but it is hidden using the hideLabel property: aria-label is added to the
            // input element with the value of the label property
            this.assertEquals(inputWithLabelHidden.getAttribute('aria-label'), "enabled - with label hidden");

            // If there is a label defined but it is hidden using the hideLabel property and the value of the label
            // property is updated through bidings: aria-label is added to the input element with the value of the label
            // property, and then aria-label is changed to contain the new value updated through the label bindings
            this.assertEquals(inputWithBoundLabelHidden.getAttribute('aria-label'), "enabled - with bound label hidden");

            // update label value
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "label", "enabled - with bound label hidden and updated value through bindings");

            // test updated label value is now the new value of aria-label
            this.assertEquals(inputWithBoundLabelHidden.getAttribute('aria-label'), "enabled - with bound label hidden and updated value through bindings");
        },

        runTemplateTest : function () {
            this.checkAttributes();
        }
    }
});

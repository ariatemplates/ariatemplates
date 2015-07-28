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
    $classpath : "test.aria.widgets.wai.input.checkBox.CheckBoxBaseTestCase",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : this.myTemplate,
            data : this.myData
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
            var checkboxWidget = this[widget + "WithLabel"];
            var focusedElement = checkboxWidget._getFocusableElement();

            // CHECK ROLE ATTRIBUTES

            // role is not added to the focused element
            this.assertNull(focusedElement.getAttribute('aria-role'), "The role attribute should not be added to the focused element.");

            if (!checkboxWidget._skinObj.simpleHTML) {
                // role is not added to the icon element
                this.assertNull(checkboxWidget._icon.getDom().getAttribute('aria-role'), "The role attribute should not be added to the icon element.");
            }

            // CHECK CHECKED ATTRIBUTE

            // aria-checked is not added to the focused element
            this.assertNull(focusedElement.getAttribute('aria-checked'), "The aria-checked attribute should not be added to the focused element when not ticked.");

            // tick the checkbox
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "checkedValue", true);

            // aria-checked is not added to the focused element
            this.assertNull(focusedElement.getAttribute('aria-checked'), "The aria-checked attribute should not be added to the focused element when ticked.");

            // untick the checkbox
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "checkedValue", false);

            // CHECK DISABLED ATTRIBUTE

            // aria-disabled is not added to the focused element
            this.assertNull(focusedElement.getAttribute('aria-disabled'), "The aria-disabled attribute should not be added to the focused element.");

            // disable the checkbox
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "disableCheckbox", true);

            // aria-disabled is not added to the focused element
            this.assertNull(focusedElement.getAttribute('aria-disabled'), "The aria-disabled attribute should not be added to the focused element when disabled.");

            // reset value for disabled to false
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "disableCheckbox", false);

            // CHECK LABEL RELATED ATTRIBUTES

            var inputWithLabel = this[widget + "WithLabel"]._getFocusableElement();
            var inputNoLabel = this[widget + "NoLabel"]._getFocusableElement();

            // if there is a label: aria-labelledby is not added to the input element
            this.assertNull(inputWithLabel.getAttribute('aria-labelledby'), "If there is a label the attribute aria-labelledby is not added to the focusable element.");

            // if there isn't a label: aria-label is not added to the input element
            this.assertNull(inputNoLabel.getAttribute('aria-label'), "If there isn't a label the attribute aria-label is not added to the focusable element.");

            // if there is a label then an id is not automatically added to the label element
            this.assertFalsy(checkboxWidget.getLabel().id, "There is no id generated for the label element.");

        },

        checkAccessibilityUndefined : function () {
            this.checkAccessibility("widgetDefault");
        },

        checkAccessibilityDisabled : function () {
            this.checkAccessibility("widgetDisabled");
        },

        checkAccessibilityEnabled : function () {
            var checkboxWidget = this.widgetEnabledWithLabelHidden;
            var inputWithLabelHidden = this.widgetEnabledWithLabelHidden._getFocusableElement();
            var inputWithBoundLabelHidden = this.widgetEnabledWithBoundLabelHidden._getFocusableElement();
            var inputWithLabel = this.widgetEnabledWithLabel._getFocusableElement();
            var inputNoLabel = this.widgetEnabledNoLabel._getFocusableElement();

            // CHECK ROLE ATTRIBUTES

            var focusedElement = checkboxWidget._getFocusableElement();

            // the attribute role is added to the focused element
            this.assertNotNull(focusedElement.getAttribute('role'), "checkAccessibilityEnabled: the attribute role should be added to the focused element.");

            // the value of attribute role should be checkbox
            this.assertEquals(focusedElement.getAttribute('role'), "checkbox", "checkAccessibilityEnabled: the attribute role should have the value checkbox.");

            if (!checkboxWidget._skinObj.simpleHTML) {
                var iconElement = checkboxWidget._icon.getDom();

                // the attribute role is added to the icon element
                this.assertNotNull(iconElement.getAttribute('role'), "checkAccessibilityEnabled: the attribute role should be added to the icon element.");

                // the value of attribute role should be presentation
                this.assertEquals(iconElement.getAttribute('role'), "presentation", "checkAccessibilityEnabled: the attribute role should have the value presentation.");

            }

            // CHECK CHECKED ATTRIBUTE

            // the attribute aria-checked should be false
            this.assertEquals(focusedElement.getAttribute('aria-checked'), "false", "checkAccessibilityEnabled: the attribute aria-checked should be false.");

            // tick the checkbox
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "checkedValue", true);

            // the attribute aria-checked should be true
            this.assertEquals(focusedElement.getAttribute('aria-checked'), "true", "checkAccessibilityEnabled: the attribute aria-checked should be true.");

            // untick the checkbox
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "checkedValue", false);

            // CHECK DISABLED ATTRIBUTE

            // the attribute aria-disabled should be false
            this.assertEquals(focusedElement.getAttribute('aria-disabled'), "false", "checkAccessibilityEnabled: the attribute aria-disabled should be false.");

            // disable the checkbox
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "disableCheckbox", true);

            // the attribute aria-disabled should be true
            this.assertEquals(focusedElement.getAttribute('aria-disabled'), "true", "checkAccessibilityEnabled: the attribute aria-disabled should be true.");

            // reset value for disabled to false
            aria.utils.Json.setValue(this.templateCtxt._tpl.data, "disableCheckbox", false);

            // CHECK LABEL RELATED ATTRIBUTES

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
            // property is updated through bindings: aria-label is added to the input element with the value of the
            // label
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

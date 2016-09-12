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

        checkAccessibility : function () {
            var widget = this.getWidgetInstance("enabled");
            var widgetWithLabelHidden = this.getWidgetInstance("enabled - with aria label hidden");
            var input = widget.getTextInputField ? widget.getTextInputField() : widget._getFocusableElement();
            var label = widgetWithLabelHidden.getLabel();
            this.assertEquals(input.getAttribute('aria-labelledby'), 'waiLabelledBy', "If there is an ariaLabelledBy property defined the attribute aria-labelledby is added to the input element. %1 is not equal to %2.");
            this.assertEquals(input.getAttribute('aria-describedby'), 'waiDescribedBy', "If there is an waiDescribedBy property defined the attribute aria-describedby is added to the input element. %1 is not equal to %2.");
            this.assertEquals(input.getAttribute('aria-label'), 'waiLabel', "If there is an waiLabel property defined the attribute aria-label is added to the input element. %1 is not equal to %2.");
            this.assertFalsy(input.getAttribute('aria-hidden'), "If there is an ariaLabelHidden property defined and set to false the attribute aria-hidden is not added to the label element.");
            this.assertEquals(label.getAttribute('aria-hidden'), "true", "If there is an ariaLabelHidden property defined and set to true the attribute aria-hidden is added to the label element. %1 is not equal to %2.");
        },

        runTemplateTest : function () {
            this.checkAccessibility();
            this.notifyTemplateTestEnd();
        }
    }
});

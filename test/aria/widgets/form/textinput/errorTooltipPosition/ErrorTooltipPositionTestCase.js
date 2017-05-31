/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.textinput.errorTooltipPosition.ErrorTooltipPositionTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependency : ["aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            var inputField = this.tfField = this.getInputField("tf");
            this.synEvent.click(inputField, {
                scope: this,
                fn: this.afterClick
            });
        },

        afterClick : function () {
            var inputFieldWidget = this.tfWidgetInstance = this.getWidgetInstance("tf");
            this.waitFor({
                condition : function () {
                    return inputFieldWidget._onValidatePopup && inputFieldWidget._onValidatePopup._validationPopup;
                },
                callback : this.afterPopupDisplayed
            });
        },

        afterPopupDisplayed : function () {
            var popup = this.tfWidgetInstance._onValidatePopup._validationPopup.domElement;
            var fieldPosition = aria.utils.Dom.getGeometry(this.tfField);
            var popupPosition = aria.utils.Dom.getGeometry(popup);
            this.assertTrue(popupPosition.x < fieldPosition.x + fieldPosition.width, "Popup is too much on the right.");
            this.assertTrue(popupPosition.x + popupPosition.width > fieldPosition.x + fieldPosition.width, "Popup is too much on the left.");
            this.assertTrue(popupPosition.y + popupPosition.height <= fieldPosition.y, "Popup is not fully above the field.");
            this.assertTrue(popupPosition.y + popupPosition.height + 10 > fieldPosition.y, "Popup is too much above the field.");
            this.end();
        }
    }
});

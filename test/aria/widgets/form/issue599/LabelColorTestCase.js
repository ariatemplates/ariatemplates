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
    $classpath : "test.aria.widgets.form.issue599.LabelColorTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $prototype : {

        runTemplateTest : function () {
            var enabledElement = this.getElementById("enabledLabel");
            this.refColorEnabled = aria.utils.Dom.getStyle(enabledElement, "color");
            var widgetsList = ["TextField", "Textarea", "PasswordField", "DateField", "DatePicker", "MultiSelect",
                    "TimeField", "NumberField", "AutoComplete", "SelectBox", "Select"];
            for (var i = 0, l = widgetsList.length; i < l; i++) {
                this.checkForWidget(widgetsList[i]);
            }
            this.end();
        },

        assertLabelEnabled : function (widgetId, enabled) {
            var widget = this.getWidgetInstance(widgetId);
            var label = widget.getLabel();
            var realColor = aria.utils.Dom.getStyle(label, "color");
            if (enabled) {
                this.assertEquals(realColor, this.refColorEnabled, "Label of widget " + widgetId
                        + " should be enabled (color %2), but has color %1.");
            } else {
                this.assertNotEquals(realColor, this.refColorEnabled, "Label of widget " + widgetId
                        + " should be disabled, but has the same color as an enabled label: " + this.refColorEnabled);
            }
        },

        checkForWidget : function (widgetId) {
            var data = this.templateCtxt.data;
            this.assertLabelEnabled(widgetId, true);
            aria.utils.Json.setValue(data, widgetId + "_disabled", true);
            this.assertLabelEnabled(widgetId, false);
            this.templateCtxt.$refresh();
            this.assertLabelEnabled(widgetId, false);
            aria.utils.Json.setValue(data, widgetId + "_disabled", false);
            this.assertLabelEnabled(widgetId, true);
            this.templateCtxt.$refresh();
            this.assertLabelEnabled(widgetId, true);
            aria.utils.Json.setValue(data, widgetId + "_disabled", true);
            this.assertLabelEnabled(widgetId, false);
        }
    }
});

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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.radiobutton.multiLine.MultiLineTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.core.Browser"],
    $prototype : {
        runTemplateTest : function () {
            var container = this.getElementById("container");
            this.tolerance = aria.core.Browser.isIE7 || aria.core.Browser.isIE8 ? 3 : 1;
            this.checkMiddle("rbMiddle");
            this.checkTop("rbTop");
            this.checkBottom("rbBottom");
            this.checkMiddle("rbDefault");
            this.notifyTemplateTestEnd();
        },

        getRadioButtonGeometry : function (id) {
            var radioButton = this.getWidgetInstance(id);
            radioButton.getDom();
            var icon = radioButton._icon.getDom();
            var label = radioButton._label;
            var geometry = {
                label: aria.utils.Dom.getGeometry(label),
                icon: aria.utils.Dom.getGeometry(icon)
            };
            this.assertTrue(geometry.icon.x + geometry.icon.width <= geometry.label.x, "The icon should be on the left of the label.");
            return geometry;
        },

        checkTop: function (id) {
            var geometry = this.getRadioButtonGeometry(id);
            this.assertEqualsWithTolerance(geometry.icon.y, geometry.label.y, this.tolerance, "The icon should be at the top.");
        },

        checkMiddle: function (id) {
            var geometry = this.getRadioButtonGeometry(id);
            this.assertEqualsWithTolerance(geometry.icon.y, geometry.label.y + (geometry.label.height - geometry.icon.height) / 2, this.tolerance, "The icon should be centered.");
        },

        checkBottom: function (id) {
            var geometry = this.getRadioButtonGeometry(id);
            this.assertEqualsWithTolerance(geometry.icon.y, geometry.label.y + geometry.label.height - geometry.icon.height, this.tolerance, "The icon should be at the bottom.");
        }
    }
});

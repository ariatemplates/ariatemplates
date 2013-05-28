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
 * This test checks that the checkbox label color is inherited correctly.
 * In IE7 or IE+ in IE7 mode changing state throws an exception if the skin color is 'inherit'
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.checkbox.SetDisabledTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            // The widget is normally disabled, now set it back to normal
            // (make sure that the skin says 'inherit')
            var widget = this.getWidgetInstance("checkbox");
            widget._skinObj.states["normal"].color = "inherit";

            aria.utils.Json.setValue(this.templateCtxt.data, "isDisabled", false);

            // Try to get the color
            var color;
            if (Aria.$window.getComputedStyle) {
                // Modern browsers
                var rgb = Aria.$window.getComputedStyle(widget._label).getPropertyValue("color");
                var matches = rgb.match(/rgb\((\d+)\s?,\s?(\d+)\s?,\s?(\d+)\)/);
                color = "#";
                for (var i = 1; i <= 3; i += 1) {
                    var component = parseInt(matches[i], 10).toString(16);
                    color += (component.length === 1 ? "0" : "") + component.toUpperCase();
                }
                if (color === "#FF0000") {
                    color = "red";
                }
            } else if (widget._label.currentStyle) {
                color = widget._label.currentStyle["color"];
            }

            this.assertEquals(color, "red", "Label should be red, got %1");
            this.end();
        }
    }
});

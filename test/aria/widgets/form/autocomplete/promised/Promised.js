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
    $classpath : "test.aria.widgets.form.autocomplete.promised.Promised",
    $extends : "aria.jsunit.RobotTestCase",
    $prototype : {
        runTemplateTest : function () {
            var icon = this.getMultiSelectIcon("autocomplete");

            var iconClass = icon.className;
            this.assertEquals(iconClass, "xICNdropdown", "Couldn't find the dropdown icon, targetting " + iconClass);

            this.synEvent.click(icon, {
                fn : this.onWidgetClick,
                scope : this
            });
        },

        onWidgetClick : function () {
            try {
                this.assertLogsEmpty();
            } catch (ex) {}

            // Wait for the suggestions to come
            aria.core.Timer.addCallback({
                fn : this.afterSuggestions,
                scope : this,
                delay : 500
            });
        },

        afterSuggestions : function () {
            var dropdown = this.getWidgetDropDownPopup("autocomplete");

            var links = dropdown.getElementsByTagName("a");

            this.assertTrue(links.length > 3, "There should be at least 4 links in dropdown, got " + links.length);

            this.end();
        }
    }
});
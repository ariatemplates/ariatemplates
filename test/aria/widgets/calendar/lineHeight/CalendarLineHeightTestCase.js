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
    $classpath : "test.aria.widgets.calendar.lineHeight.CalendarLineHeightTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            var widget = this.getWidgetInstance("myCalendar");
            var domElt = widget.getDom();
            var tds = domElt.getElementsByTagName("td");
            var tdsLength = tds.length;
            this.assertTrue(tdsLength > 6, "Could not find enough td elements.");
            var toBeChecked = [tds[0], tds[1], tds[2], tds[tdsLength - 3], tds[tdsLength - 2], tds[tdsLength - 1]];
            for (var i = 0, l = toBeChecked.length; i < l; i++) {
                this.checkBorderElement(toBeChecked[i]);
            }
            this.end();
        },

        checkBorderElement : function (domElt) {
            var clsName = domElt.className;
            this.assertTrue(/xDiv_([_a-zA-Z0-9]+)_(tlc|ts|trc|blc|bs|brc)/.test(clsName), "Invalid class name: " +
                    clsName);
            var height = domElt.offsetHeight;
            this.assertTrue(height < 10, "Wrong border width: " + height + " (in " + clsName + ")");
        }

    }
});

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
    $classpath : "test.aria.widgets.container.checkContent.DivTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json", "aria.templates.Layout"],
    $prototype : {
        runTemplateTest : function () {
            var div = this.getElementById('MyDiv');
            var span = div.firstChild;
            var spanHeight = parseInt(span.style.height, 10);
            var spanWidth = parseInt(span.style.width, 10);
            var expectedHeight = 400;
            // Usually: expectedWidth = 634 (617 from the h3 element width + 17px for the scrollbar)
            // but on Mac, there is no scrollbar... so we need to use getScrollbarsMeasuredWidth
            var expectedWidth = 617 + aria.templates.Layout.getScrollbarsMeasuredWidth();

            if (aria.core.Browser.isOldIE && aria.core.Browser.majorVersion < 8) {
                var expectedWidthIE7 = 888; // 871 from the h3 element width + 17px added for the scrollbar
                this.assertEqualsWithTolerance(spanWidth, expectedWidthIE7, 2, "The div width is %1, instead of %2");
            } else {
                this.assertEqualsWithTolerance(spanWidth, expectedWidth, 2, "The div width is %1, instead of %2");
            }
            this.assertEqualsWithTolerance(spanHeight, expectedHeight, 2, "The div height is %1, instead of %2");
            this.end();
        }
    }
});

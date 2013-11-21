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
    $classpath : "test.aria.widgets.container.checkContent.DivTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $prototype : {
        runTemplateTest : function () {
            var div = this.getElementById('MyDiv');
            var span = div.firstChild;
            var spanHeight = parseInt(span.style.height, 10);
            var spanWidth = parseInt(span.style.width, 10);
            var expectedHeight = 400;
            var expectedWidth = 634; // 617 from the h3 element width + 17px for the scrollbar

            if (aria.core.Browser.isOldIE && aria.core.Browser.majorVersion < 8) {
                var expectedWidthIE7 = 888; // 871 from the h3 element width + 17px added for the scrollbar
                this.assertEqualsWithTolerance(spanWidth, expectedWidthIE7, 2, "The div width is %1, insted of %2");
            } else if (aria.core.Browser.isMac) {
                if (aria.core.Browser.isWebkit) {
                    var expectedWidthMac = 634;
                    this.assertEqualsWithTolerance(spanWidth, expectedWidthMac, 2, "The div width is %1, insted of %2");
                } else {
                    var expectedWidthMac = 647;
                    this.assertEqualsWithTolerance(spanWidth, expectedWidthMac, 2, "The div width is %1, insted of %2");
                }
            } else {
                this.assertEqualsWithTolerance(spanWidth, expectedWidth, 2, "The div width is %1, insted of %2");
            }
            this.assertEqualsWithTolerance(spanHeight, expectedHeight, 2, "The div height is %1, insted of %2");
            this.end();
        }
    }
});

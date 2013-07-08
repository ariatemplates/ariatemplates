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
    $classpath : "test.aria.html.select.bodycontent.BodyContentTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.html.Select", "aria.utils.SynEvents"],
    $prototype : {
        runTemplateTest : function () {

            var document = Aria.$window.document;
            var selectWidgets = this.testDiv.getElementsByTagName("select");

            // we know there's only one
            var selectWidget = selectWidgets[0];
            this.assertEquals(selectWidget.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            // to be nullified in the callback of the click action
            this.selectWidget = selectWidget;

            aria.utils.SynEvents.click(selectWidget.options[1], {
                fn : this.afterFirstClick,
                scope : this
            });

        },

        afterFirstClick : function () {
            this.assertEquals(this.selectWidget.selectedIndex, 1, "The selected Index should be %2  but was %1 ");

            this.selectWidget = null;
            this.end();
        }

    }
});

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
    $classpath : "test.aria.widgets.form.list.activateSort.ListTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Array", "aria.utils.String", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            countries : [
                { value: "US", label: "United States"},
                { value: "UK", label: "United Kingdom" },
                { value: "CH", label: "Switzerland" },
                { value: "IT", label: "Italy" },
                { value: "ES", label: "Spain" },
                { value: "IS", label: "Israel" }
            ],
            selectedIndex: -1
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.list.activateSort.ListTestCaseTpl",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var self = this;

            var listContainer = self.getWidgetDomElement("myId", "div");
            var domItems = aria.utils.Array.clone(aria.utils.Dom.getElementsByClassName(listContainer, "xListItem_std"));
            var labelItems = aria.utils.Array.map(domItems, function (domElt) {
                return aria.utils.String.trim(domElt.innerHTML);
            });

            function step0() {
                self.assertJsonEquals(labelItems, ["Israel", "Italy", "Spain", "Switzerland", "United Kingdom", "United States"]);
                self.assertEquals(self.data.selectedIndex, -1);
                self.assertEquals(domItems[0].className.indexOf("xListSelectedItem_std"), -1);
                self.synEvent.click(domItems[0], step1);
            }
            
            function step1() {
                // selectedIndex is the index in the original array
                self.assertEquals(self.data.selectedIndex, 5); // Israel
                self.assertTrue(domItems[0].className.indexOf("xListSelectedItem_std") > -1);
                self.assertEquals(domItems[1].className.indexOf("xListSelectedItem_std"), -1);
                self.synEvent.type(Aria.$window.document.activeElement, "[down]", step2);
            }

            function step2() {
                self.assertEquals(self.data.selectedIndex, 3); // Italy
                self.assertEquals(domItems[0].className.indexOf("xListSelectedItem_std"), -1);
                self.assertTrue(domItems[1].className.indexOf("xListSelectedItem_std") > -1);
                self.end();
            }

            step0();
        }
    }
});

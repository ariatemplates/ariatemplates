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
    $classpath : "test.aria.templates.issue353.Issue353TestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        var item1 = {
            name : "item1"
        };
        var item2 = {
            name : "item2"
        };
        this.setTestEnv({
            template : "test.aria.templates.issue353.Main",
            data : {
                items : [item1, item2],
                subItems : [item1]
            }
        });

    },
    $prototype : {
        runTemplateTest : function () {

            var textField1 = this.getWidgetDomElement("textField1", "input");
            this.synEvent.execute([["click", textField1], ["type", textField1, "[right]test1"]], {
                fn : this.__afterFirstType,
                scope : this
            });
        },

        __afterFirstType : function () {
            var outside = this.testWindow.aria.utils.Dom.getElementById("outsideDiv");

            this.synEvent.click(outside, {
                fn : this.__afterFirstClick,
                scope : this
            });
        },

        __afterFirstClick : function () {
            this.__checkFieldsets(["item1test1", "item2"], ["item1test1"]);
            this.__checkInputs("item1test1");

            var textField2 = this.getWidgetDomElement("textField2", "input");
            this.synEvent.execute([["click", textField2], ["type", textField2, "test2"]], {
                fn : this.__afterSecondType,
                scope : this
            });
        },

        __afterSecondType : function () {
            var outside = this.testWindow.aria.utils.Dom.getElementById("outsideDiv");

            this.synEvent.click(outside, {
                fn : this.__afterSecondClick,
                scope : this
            });
        },

        __afterSecondClick : function () {
            this.__checkFieldsets(["item1test1test2", "item2"], ["item1test1test2"]);
            this.__checkInputs("item1test1test2");
            this.end();
        },

        __checkFieldsets : function (items, subitems) {
            var arrLi;

            arrLi = this.__getChildrenByIdAndTagName("list", "li", true);
            this.assertTrue(arrLi[0].innerHTML == items[0], "The arrLi[0].innerHTML value in list is not correct [section]: "
                    + arrLi[0].innerHTML + "!=" + items[0]);
            this.assertTrue(arrLi[1].innerHTML == items[1], "The arrLi[1].innerHTML value in list is not correct [section]: "
                    + arrLi[1].innerHTML + "!=" + items[1]);

            arrLi = this.__getChildrenByIdAndTagName("sublist", "li", true);
            this.assertTrue(arrLi[0].innerHTML == subitems[0], "The arrLi[0].innerHTML value in sublist is not correct [section]: "
                    + arrLi[0].innerHTML + "!=" + subitems[0]);

        },

        __checkInputs : function (itemValue) {
            var arrLi;

            arrLi = this.__getChildrenByIdAndTagName("textField1", "input");
            this.assertTrue(arrLi.value == itemValue, "The arrLi[0].innerHTML value in list is not correct [textField]: "
                    + arrLi.value + "!=" + itemValue);

            arrLi = this.__getChildrenByIdAndTagName("textField2", "input");
            this.assertTrue(arrLi.value == itemValue, "The arrLi[0].innerHTML value in sublist is not correct [textField]: "
                    + arrLi.value + "!=" + itemValue);

        },

        __getChildrenByIdAndTagName : function (id, tagName, section) {
            if (section) {
                return aria.utils.Dom.getDomElementsChildByTagName(this.getElementById(id), tagName);
            } else {
                return this.getWidgetDomElement(id, tagName);
            }
        }
    }
});

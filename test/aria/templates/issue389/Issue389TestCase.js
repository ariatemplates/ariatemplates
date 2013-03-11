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
    $classpath : "test.aria.templates.issue389.Issue389TestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = {
                dialogTitle : "title",
                visible : true
            };
        this.setTestEnv({
            template : "test.aria.templates.issue389.Main",
            data : this.data
        });

    },
    $prototype : {
        runTemplateTest : function () {

            var textField1 = this.__getChildrenByIdAndTagName("textField1", "input")[0];

            this.synEvent.execute([["click", textField1], ["type", textField1, "Test1"]], {
                fn : this.__afterFirstType,
                scope : this
            });


        },

        __afterFirstType : function () {
            var outside = aria.utils.Dom.getElementById("outsideDiv");

            this.synEvent.click(outside, {
                fn : this.__afterFirstClick,
                scope : this
            });
        },

        __afterFirstClick : function () {
            aria.utils.Json.setValue(this.data, "visible", true);
            var textField1 = this.__getChildrenByIdAndTagName("textField1", "input")[0];

            this.assertTrue(textField1.value == "titleTest1", "The textField1.value value is not correct: " + textField1.value);

            this.__finishTest();
        },

        __getChildrenByIdAndTagName : function (id, tagName, section) {
            var domId, elem, arrLi;

            if (section) {
                elem = this.getElementById(id);
            } else {
                domId = this.getWidgetInstance(id)._domId;
                elem = aria.utils.Dom.getElementById(domId);
            }

            arrLi = aria.utils.Dom.getDomElementsChildByTagName(elem, tagName);

            return arrLi;
        },

        __finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
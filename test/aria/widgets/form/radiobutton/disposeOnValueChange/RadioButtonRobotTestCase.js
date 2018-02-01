/*
 * Copyright 2018 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.radiobutton.disposeOnValueChange.RadioButtonRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.data = {
            value: ""
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.radiobutton.disposeOnValueChange.RadioButton",
            data : this.data
        });
    },
    $prototype : {

        runTemplateTest : function () {
            var self = this;

            function step0() {
                self.checkResult("");
                self.clickTypeAndCheck("[tab]", "v1", step1);
            }

            function step1() {
                self.clickTypeAndCheck("[tab][down]", "v2", step2);
            }

            function step2() {
                self.clickAndCheck("rb1", "v1", step3);
            }

            function step3() {
                self.end();
            }

            step0();
        },

        checkResult : function (expectedValue) {
            var domElt = this.getElementById("result");
            this.assertEquals(this.data.value, expectedValue);
            this.assertEquals(domElt.innerHTML, "value = " + expectedValue);
        },

        createWaitForCallback : function (expectedValue, cb) {
            var self = this;
            return function () {
                self.waitFor({
                    condition: function () {
                        return self.data.value === expectedValue;
                    },
                    callback: function () {
                        self.checkResult(expectedValue);
                        setTimeout(cb, 100);
                    }
                });
            };
        },

        clickAndCheck : function (idToClick, expectedValue, cb) {
            var element = this.getElementById(idToClick);
            this.synEvent.click(element, this.createWaitForCallback(expectedValue, cb));
        },

        clickTypeAndCheck : function (text, expectedValue, cb) {
            this.clickAndType("refInput", text, this.createWaitForCallback(expectedValue, cb), false);
        }
    }
});

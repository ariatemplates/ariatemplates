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
    $classpath : "test.aria.widgets.form.autocomplete.expandbutton.test2.ExpandButtonCheckRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.dataModel = {
            value1 : ""
        };
        this.setTestEnv({
            data : this.dataModel
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var input1 = this.getInputField("ac1");
            this.synEvent.execute([["click", input1], ["type", input1, "[down]"], ["pause", 500],
                    ["type", input1, "[down][down]\r"], ["pause", 500]], {
                fn : this._checkFinalVal,
                scope : this
            });
        },

        _checkFinalVal : function () {
            var input = this.getInputField("ac1");
            var input2 = this.getElementById("myLink");
            this.assertTrue(input.value == "Finnair");
            this.synEvent.execute([["click", input2]], {
                fn : this._finishTest,
                scope : this
            });
        },

        _finishTest : function () {
            var data = aria.utils.Json.getValue(this.dataModel, "value1");
            this.assertTrue(data.label == "Finnair");
            this.notifyTemplateTestEnd();
        }

    }
});

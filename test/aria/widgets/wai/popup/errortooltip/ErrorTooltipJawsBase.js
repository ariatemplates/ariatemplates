/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.popup.errortooltip.ErrorTooltipJawsBase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.popup.errortooltip.ErrorTooltipJawsTestCaseTpl",
            data : {
                fieldId : this.fieldId
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.execute([
                ["click", this.getElementById("before")],
                ["pause", 1000],
                ["type", null, "[tab]"],
                ["pause", 1000],
                ["type", null, "[tab]"],
                ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(true, this.end, function (result) {
                        return result.indexOf("Alert!\nThis field is mandatory\n") > -1;
                    });
                },
                scope: this
            });
        }
    }
});

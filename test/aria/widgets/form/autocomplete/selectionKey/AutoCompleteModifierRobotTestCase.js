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
    $classpath : "test.aria.widgets.form.autocomplete.selectionKey.AutoCompleteModifierRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.selectionKey.AutoCompleteTplModifier",
            data : {
                ac_air_value : null
            }
        });
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var input = this.getInputField("acDest1");
            this.synEvent.execute([["click", input], ["type", input, "a"], ["pause", 500],
                    ["type", input, "[down][down][down][down][<shift>]a[>shift<]"], ["pause", 100]], {
                fn : this._finishTest,
                scope : this
            });
        },
        /**
         * Finalize the test, check the widgets values are the same.
         */
        _finishTest : function () {
            var test1 = this.getInputField("acDest1");
            var test2 = this.getInputField("acDest2");
            this.assertEquals(test1.value, test2.value);
            this.assertEquals(this.templateCtxt.data.ac_air_value.label, "Air Canada");
            this.notifyTemplateTestEnd();
        }
    }
});

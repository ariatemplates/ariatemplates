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
    $classpath : "test.aria.widgets.form.textinput.onchange.OnChangeTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        /**
         * Has onchange been called ?
         * @type Boolean
         */
        this._onChangeCalled = false;
    },
    $prototype : {
        runTemplateTest : function () {
            var input1 = this.getInputField("textid1");
            var input2 = this.getInputField("textid2");
            this.synEvent.execute([["click", input1], ["type", input1, "this is a test"], ["click", input2]], {
                fn : this.onChange,
                scope : this
            });
        },

        onChange : function () {
            this.assertTrue(this.env.data.onChange, "onChanged not called");
            this.notifyTemplateTestEnd();
        }
    }
});

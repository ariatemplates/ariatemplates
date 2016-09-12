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
    $classpath : "test.aria.widgets.form.textinput.blurOnDestroy.ClickButtonAfterDestroyTest",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this._data = {
            rep : [{
                        a : "a",
                        val : null
                    }],
            clicks : 0,
            refresh : false
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.textinput.blurOnDestroy.ClickButtonAfterDestroyTpl",
            data : this._data
        });

    },

    $prototype : {

        runTemplateTest : function () {
            var tf = this.getInputField("tf0");
            var btn = this.getElementById("testButton");

            this.synEvent.execute([["click", tf], ["type", tf, "aaa[enter]"], ["click", btn]], {
                fn : this.__afterClick,
                scope : this
            });
        },

        __afterClick : function () {
            this.assertEquals(this._data.refresh, true, "The section was not refreshed. This compromises the validity of the test");
            this.assertEquals(this._data.clicks, 1, "The click handler has not been called.");
            this.end();
        }
    }
});

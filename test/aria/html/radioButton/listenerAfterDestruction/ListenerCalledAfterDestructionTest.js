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
    $classpath : "test.aria.html.radioButton.listenerAfterDestruction.ListenerCalledAfterDestructionTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this._data = {
            selectedValue : "a"
        };

        this.setTestEnv({
            template : "test.aria.html.radioButton.listenerAfterDestruction.ListenerCalledAfterDestruction",
            data : this._data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.utils.Json.setValue(this._data, "selectedValue", "b");

            //this. assertLogsEmpty();
            this.end();
        }

    }
});

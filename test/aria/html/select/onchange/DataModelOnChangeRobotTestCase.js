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
    $classpath : "test.aria.html.select.onchange.DataModelOnChangeTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = {
            selectedOption : "EURO",
            onChangeCalls : 0,
            onChangeOption : ""
        };
        this.setTestEnv({
            template : "test.aria.html.select.onchange.DataModelOnChangeTpl",
            data : this.data
        });

    },
    $prototype : {
        runTemplateTest : function () {
            var selectWidget = this.testDiv.getElementsByTagName("select")[0]; // we know there's only one

            this.assertEquals(selectWidget.selectedIndex, 0, "The selected Index should be %2 but was %1");

            this.synEvent.execute([["click", selectWidget], ["type", null, "[down][down][enter]\t"]], {
                fn : this.afterChange,
                scope : this
            });
        },

        afterChange : function () {
            this.assertEquals(this.data.onChangeCalls, 1, "onchange should have been called exactly once");
            this.assertEquals(this.data.selectedOption, "POUND", "Selected Option should be %2  but was %1");
            this.assertEquals(this.data.onChangeOption, "POUND", "Changed Option should be %2  but was %1");
            this.end();
        }

    }
});

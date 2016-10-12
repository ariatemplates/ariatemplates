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
    $classpath : "test.aria.templates.repeater.testThree.RepeaterThreeTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.testData = {
            cities : [{
                        city : "Paris"
                    }, {
                        city : "London"
                    }, {
                        city : "Tokyo"
                    }]
        };

        this.setTestEnv({
            template : "test.aria.templates.repeater.testThree.RepeaterTestThree",
            data : this.testData
        });
    },
    $prototype : {
        /**
         * Test errors that should be raised
         */
        runTemplateTest : function () {
            var json = aria.utils.Json, data = this.testData;

            this.assertLogsEmpty();

            json.setValue(data, "step", 1);
            this.templateCtxt.$refresh();
            this.assertErrorInLogs(aria.templates.Repeater.REPEATER_INVALID_ITERATED_SET);
            this.assertLogsEmpty();

            json.setValue(data, "step", 2);
            this.templateCtxt.$refresh();
            this.assertErrorInLogs(aria.templates.Section.INVALID_CONFIGURATION);
            this.assertLogsEmpty();

            json.setValue(data, "step", 3);
            this.templateCtxt.$refresh();
            this.assertErrorInLogs(aria.templates.Repeater.REPEATER_MACRO_NOT_SUPPORTED);
            this.assertLogsEmpty();

            json.setValue(data, "step", 4);
            this.templateCtxt.$refresh();
            this.assertErrorInLogs(aria.templates.Section.INVALID_CONFIGURATION);
            this.assertLogsEmpty();
            this.end();
        }
    }
});

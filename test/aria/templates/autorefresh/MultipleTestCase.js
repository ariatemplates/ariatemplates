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
    $classpath : "test.aria.templates.autorefresh.MultipleTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.autorefresh.Multiple",
            data : {
                a : {
                    value : "a"
                },
                b : "b"
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            // In the template there are two sections bound to the datamodel
            // update another value and check that only one section is refreshed
            var tpl = this.templateCtxt._tpl;
            tpl.$json.setValue(tpl.data.a, "value", "A");

            // The first value should be updated
            var value1 = tpl.$getElementById("v1");
            this.assertTrue(value1.getValue() === "A");

            // Not the second value
            var value2 = tpl.$getElementById("v2");
            this.assertTrue(value2.getValue() === "a");

            // Not the third value
            var value3 = tpl.$getElementById("v3");
            this.assertTrue(value3.getValue() === "a");

            this.notifyTemplateTestEnd();
        }
    }
});

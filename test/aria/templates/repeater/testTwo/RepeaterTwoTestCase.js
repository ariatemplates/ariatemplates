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

/**
 * Test dynamic sections
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.repeater.testTwo.RepeaterTwo",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.testData = {
            myMap : {
                one : {
                    name : "one"
                },
                two : {
                    name : "two"
                },
                three : {
                    name : "three"
                }
            }
        };
        this.setTestEnv({
            template : "test.aria.templates.repeater.testTwo.RepeaterTestTwo",
            data : this.testData
        });
    },
    $prototype : {
        /**
         * Test the map loopType for the repeater, in particular the Json deleteKey method
         */
        runTemplateTest : function () {
            var myMap = this.testData.myMap, json = aria.utils.Json;
            var tableBody = this.testDiv.children[0].children[0].children[0];
            this.assertEquals(tableBody.children.length, 3);
            this.assertEquals(tableBody.children[0].className, "line");
            json.deleteKey(myMap, "one");
            this.assertEquals(tableBody.children.length, 2);
            json.setValue(myMap, "myNewKey1", "value");
            this.assertEquals(tableBody.children.length, 3);
            // a new key with no value must also add a line to the table
            json.setValue(myMap, "myNewKey2");
            this.assertEquals(tableBody.children.length, 4);

            this.assertLogsEmpty();
            this.end();
        }
    }
});

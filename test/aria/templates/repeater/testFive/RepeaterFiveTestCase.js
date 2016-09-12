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
    $classpath : "test.aria.templates.repeater.testFive.RepeaterFiveTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.testData = {
            cities : [{
                        city : "Paris",
                        refreshCt : 0,
                        subRefreshCt : 0
                    }, {
                        city : "London",
                        refreshCt : 0,
                        subRefreshCt : 0
                    }, {
                        city : "Tokyo",
                        refreshCt : 0,
                        subRefreshCt : 0
                    }]
        };

        this.setTestEnv({
            template : "test.aria.templates.repeater.testFive.RepeaterTestFive",
            data : this.testData
        });
    },
    $prototype : {

        /**
         * Test integration with the refresh manager.
         */
        runTemplateTest : function () {
            var myArray = this.testData.cities, tplContext = this.templateCtxt, json = aria.utils.Json;

            var tableBody = this.testDiv.children[0].children[0].children[0].children[0];
            tplContext.$refresh({
                section : "subSection" + myArray[0].repeaterItem.sectionIdSuffix
            });
            tplContext.$refresh({
                section : "containingSection"
            });

            tableBody = this.testDiv.children[0].children[0].children[0].children[0];

            aria.templates.RefreshManager.stop();

            json.splice(myArray, 0, 0, {
                city : "Geneva",
                refreshCt : 0,
                subRefreshCt : 0
            }, {
                city : "Monaco",
                refreshCt : 0,
                subRefreshCt : 0
            });

            json.splice(myArray, 0, 1);

            this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "London");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "Tokyo");

            tplContext.$refresh({
                section : "subSection" + myArray[3].repeaterItem.sectionIdSuffix
            });
            tplContext.$refresh({
                section : "containingSection"
            });

            this.assertEquals(myArray[0].subRefreshCt, 0);
            this.assertEquals(myArray[1].subRefreshCt, 3);
            this.assertEquals(myArray[2].subRefreshCt, 2);
            this.assertEquals(myArray[3].subRefreshCt, 2);

            aria.templates.RefreshManager.resume();

            tableBody = this.testDiv.children[0].children[0].children[0].children[0];
            this.assertEquals(tableBody.children[0].children[0].innerHTML, "Monaco");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "London");
            this.assertEquals(tableBody.children[3].children[0].innerHTML, "Tokyo");

            this.assertEquals(myArray[0].subRefreshCt, 1);
            this.assertEquals(myArray[1].subRefreshCt, 4);
            this.assertEquals(myArray[2].subRefreshCt, 3);
            this.assertEquals(myArray[3].subRefreshCt, 3);

            aria.templates.RefreshManager.stop();

            json.splice(myArray, 0, 0, {
                city : "FrankFurt",
                refreshCt : 0,
                subRefreshCt : 0
            }, {
                city : "Lyon",
                refreshCt : 0,
                subRefreshCt : 0
            });

            json.splice(myArray, 0, 1, {
                city : "Berlin",
                refreshCt : 0,
                subRefreshCt : 0
            });

            this.assertEquals(tableBody.children[0].children[0].innerHTML, "Monaco");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "London");
            this.assertEquals(tableBody.children[3].children[0].innerHTML, "Tokyo");

            this.assertEquals(myArray[0].subRefreshCt, 0);
            this.assertEquals(myArray[1].subRefreshCt, 0);
            this.assertEquals(myArray[2].subRefreshCt, 1);
            this.assertEquals(myArray[3].subRefreshCt, 4);
            this.assertEquals(myArray[4].subRefreshCt, 3);
            this.assertEquals(myArray[5].subRefreshCt, 3);

            tplContext.$refresh({
                section : "subSection" + myArray[3].repeaterItem.sectionIdSuffix
            });
            tplContext.$refresh({
                section : "childSection" + myArray[4].repeaterItem.sectionIdSuffix
            });

            aria.templates.RefreshManager.resume();

            tableBody = this.testDiv.children[0].children[0].children[0].children[0];
            this.assertEquals(tableBody.children[0].children[0].innerHTML, "Berlin");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "Lyon");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "Monaco");
            this.assertEquals(tableBody.children[3].children[0].innerHTML, "Paris");
            this.assertEquals(tableBody.children[4].children[0].innerHTML, "London");
            this.assertEquals(tableBody.children[5].children[0].innerHTML, "Tokyo");

            this.assertEquals(myArray[0].subRefreshCt, 1);
            this.assertEquals(myArray[1].subRefreshCt, 1);
            this.assertEquals(myArray[2].subRefreshCt, 1);
            this.assertEquals(myArray[3].subRefreshCt, 5);
            this.assertEquals(myArray[3].refreshCt, 3);
            this.assertEquals(myArray[4].subRefreshCt, 4);
            this.assertEquals(myArray[5].subRefreshCt, 3);

            // Refreshing a repeater using its section id is not supported yet.
            tplContext.$refresh({
                section : "repeaterSection"
            });

            this.assertEquals(myArray[0].subRefreshCt, 2);
            this.assertEquals(myArray[1].subRefreshCt, 2);
            this.assertEquals(myArray[2].subRefreshCt, 2);
            this.assertEquals(myArray[3].subRefreshCt, 6);
            this.assertEquals(myArray[3].refreshCt, 4);
            this.assertEquals(myArray[4].subRefreshCt, 5);
            this.assertEquals(myArray[5].subRefreshCt, 4);
            this.assertLogsEmpty();
            this.end();
        }
    }
});

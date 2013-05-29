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
    $classpath : "test.aria.templates.repeater.RepeaterTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.templates.Section", "aria.templates.Repeater"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._testEnv1 = {
            template : "test.aria.templates.repeater.testOne.RepeaterTestOne",
            data : {
                refCount : {},
                items : []
            }
        };
        this._testEnv2 = {
            template : "test.aria.templates.repeater.testTwo.RepeaterTestTwo"
        };
        this._testEnv3 = {
            template : "test.aria.templates.repeater.testThree.RepeaterTestThree",
            data : {
                cities : [{
                            city : "Paris"
                        }, {
                            city : "London"
                        }, {
                            city : "Tokyo"
                        }],
                refCount : {},
                items : {}
            }
        };
        this._testEnv4 = {
            template : "test.aria.templates.repeater.testFour.RepeaterTestFour",
            data : {
                cities : [{
                            city : "Paris"
                        }, {
                            city : "London"
                        }, {
                            city : "Tokyo"
                        }],
                refCount : {},
                items : {}
            }
        };
        this._testEnv5 = {
            template : "test.aria.templates.repeater.testFive.RepeaterTestFive",
            data : {
                cities : [{
                            city : "Paris"
                        }, {
                            city : "London"
                        }, {
                            city : "Tokyo"
                        }],
                refCount : {},
                items : {}
            }
        };
        this._testEnv6 = {
            template : "test.aria.templates.repeater.testSix.RepeaterTestSix",
            data : {
                cities : [{
                            city : "Paris"
                        }, {
                            city : "London"
                        }, {
                            city : "Tokyo"
                        }]
            }
        };
        this._testEnv7 = {
            template : "test.aria.templates.repeater.testSeven.RepeaterTestSeven",
            data : {
                step : 0
            }
        };
        this._testEnv8 = {
            template : "test.aria.templates.repeater.testEight.RepeaterTestEight",
            data : {
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
            }
        };

        this.setTestEnv(this._testEnv1);
    },
    $prototype : {
        runTemplateTest : function () {
            this.runTestOne();
        },
        /**
         * Test repeater in case of array loopType. Test the new aria.utils.json methods to manipulate arrays. Test the
         * cssClass callback for pyjama tables. Test that the ct field of the item is correctly updated.
         */
        runTestOne : function () {
            var tpl = this.templateCtxt._tpl;
            var myArray = tpl.myData.myArray;
            var items = tpl.data.items;
            var tableBody = this.testDiv.children[0].children[0].children[0];
            var cssClasses = ["oddRow", "evenRow"];
            this.assertEquals(tableBody.children.length, 3);
            this.assertEquals(tableBody.children[0].children[0].innerHTML, "just");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "an");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "array");
            for (var j = 0; j < 3; j++) {
                this.assertEquals(tableBody.children[j].className, cssClasses[j % 2]);
            }

            tpl.$json.setValue(myArray, 0, "quite");
            this.assertEquals(tableBody.children[0].children[0].innerHTML, "quite");

            tpl.$json.add(myArray, "not", 1);

            this.assertEquals(tableBody.children[1].children[0].innerHTML, "not");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "an");
            this.assertEquals(tableBody.children[3].children[0].innerHTML, "array");
            for (var j = 0; j < 4; j++) {
                this.assertEquals(tableBody.children[j].className, cssClasses[j % 2]);
            }
            this.assertEquals(items[0].ct, 1);
            this.assertEquals(items[1].ct, 3);
            this.assertEquals(items[2].ct, 4);
            this.assertEquals(items[3].ct, 2);

            tpl.$json.add(myArray, "of");

            this.assertEquals(tableBody.children[4].children[0].innerHTML, "of");
            for (var j = 0; j < 5; j++) {
                this.assertEquals(tableBody.children[j].className, cssClasses[j % 2]);
            }
            this.assertEquals(items[4].ct, 5);

            tpl.$json.removeAt(myArray, 2);
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "array");
            this.assertEquals(tableBody.children[3].children[0].innerHTML, "of");
            for (var j = 0; j < 4; j++) {
                this.assertEquals(tableBody.children[j].className, cssClasses[j % 2]);
            }
            this.assertEquals(items[2].ct, 3);
            this.assertEquals(items[4].ct, 4);

            tpl.$json.splice(myArray, 1, 1);
            this.assertEquals(tableBody.children[0].children[0].innerHTML, "quite");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "array");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "of");
            for (var j = 0; j < 3; j++) {
                this.assertEquals(tableBody.children[j].className, cssClasses[j % 2]);
            }

            aria.templates.RefreshManager.stop();
            tpl.$json.splice(myArray, 0, 0, "this", "is");

            this.assertEquals(tableBody.children[0].children[0].innerHTML, "quite");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "array");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "of");

            aria.templates.RefreshManager.resume();

            this.assertEquals(tableBody.children[0].children[0].innerHTML, "this");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "is");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "quite");
            this.assertEquals(tableBody.children[3].children[0].innerHTML, "array");
            this.assertEquals(tableBody.children[4].children[0].innerHTML, "of");
            for (var j = 0; j < 5; j++) {
                this.assertEquals(tableBody.children[j].className, cssClasses[j % 2]);
            }

            tpl.$json.setValue(myArray, 7, "nonsense");
            this.assertEquals(tableBody.children.length, 8);
            this.assertEquals(tableBody.children[7].children[0].innerHTML, "nonsense");

            this.assertEquals(items.length, 10);
            this.assertEquals(tpl.data.refCount[items[0].sectionId], 2);
            for (var i = 1; i <= 6; i++) {
                this.assertEquals(tpl.data.refCount[items[i].sectionId], 1);
            }
            this.assertLogsEmpty();
            this._replaceTestTemplate(this._testEnv2, {
                fn : this.runTestTwo,
                scope : this
            });

        },

        /**
         * Test the map loopType for the repeater, in particular the Json deleteKey method
         */
        runTestTwo : function () {
            var tpl = this.templateCtxt._tpl;
            var myMap = tpl.myData.myMap;
            var tableBody = this.testDiv.children[0].children[0].children[0];
            this.assertEquals(tableBody.children.length, 3);
            this.assertEquals(tableBody.children[0].className, "line");
            tpl.$json.deleteKey(myMap, "one");
            this.assertEquals(tableBody.children.length, 2);
            tpl.$json.setValue(myMap, "myNewKey1", "value");
            this.assertEquals(tableBody.children.length, 3);
            // a new key with no value must also add a line to the table
            tpl.$json.setValue(myMap, "myNewKey2");
            this.assertEquals(tableBody.children.length, 4);

            this.assertLogsEmpty();
            // TODO: when repeaters for views are implemented, don't skip tests about views:
            this._replaceTestTemplate(this._testEnv6, {
                fn : this.runTestSix,
                scope : this
            });
        },

        /**
         * Test sortedView looptype
         */
        runTestThree : function () {
            var tpl = this.templateCtxt._tpl;
            var tableBody = this.testDiv.children[0].children[0].children[0];
            this.assertEquals(tableBody.children.length, 3);
            this.assertEquals(tableBody.children[0].children[0].innerHTML, "London");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "Tokyo");

            // Disabled because it is not working yet:
            // tpl.mySortedView.setSort('D', 'sortByCity', tpl.cityGetter);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Tokyo");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "London");
            //
            // aria.templates.RefreshManager.stop();
            // tpl.mySortedView.setSort('A', 'sortByCity', tpl.cityGetter);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Tokyo");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "London");
            // aria.templates.RefreshManager.resume();
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "Tokyo");
            //
            // tpl.$json.add(tpl.data.cities, {
            // city : "Rome"
            // });
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "Rome");
            // this.assertEquals(tableBody.children[3].children[0].innerHTML, "Tokyo");
            //
            // tpl.mySortedView.setSort('I', 'sortByCity', tpl.cityGetter);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "Tokyo");
            // this.assertEquals(tableBody.children[3].children[0].innerHTML, "Rome");
            //
            // tpl.$json.add(tpl.data.cities, {
            // city : "Berlin"
            // }, 1);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Berlin");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[3].children[0].innerHTML, "Tokyo");
            // this.assertEquals(tableBody.children[4].children[0].innerHTML, "Rome");
            //
            // tpl.$json.removeAt(tpl.data.cities, 3);
            // this.assertEquals(tableBody.children[3].children[0].innerHTML, "Rome");
            //
            // tpl.mySortedView.setSort('A', 'sortByCity', tpl.cityGetter);
            // tpl.$json.setValue(tpl.data.cities, 0, "Stockholm");
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Berlin");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "Rome");
            // this.assertEquals(tableBody.children[4].children[0].innerHTML, "Stockholm");
            // TODO check the number of refreshes

            this.assertLogsEmpty();
            this._replaceTestTemplate(this._testEnv4, {
                fn : this.runTestFour,
                scope : this
            });
        },

        /**
         * Test filteredView looptype
         */
        runTestFour : function () {
            var tpl = this.templateCtxt._tpl;
            var tableBody = this.testDiv.children[0].children[0].children[0];
            this.assertEquals(tableBody.children.length, 2);
            this.assertEquals(tableBody.children[0].children[0].innerHTML, "London");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");

            // Disabled because it is not working yet:
            // tpl.mySortedView.setSort('D', 'sortByCity', tpl.cityGetter);
            // this.assertEquals(tableBody.children.length, 2);
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "London");
            //
            // tpl.$json.add(tpl.data.cities, {
            // city : "Rome"
            // });
            // this.assertEquals(tableBody.children.length, 3);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Rome");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "London");
            //
            // tpl.mySortedView.setSort('I', 'sortByCity', tpl.cityGetter);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "Rome");
            //
            // tpl.$json.add(tpl.data.cities, {
            // city : "Toronto"
            // }, 1);
            // this.assertEquals(tableBody.children.length, 3);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "Rome");
            //
            // tpl.$json.removeAt(tpl.data.cities, 3);
            // this.assertEquals(tableBody.children.length, 3);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "Rome");
            //
            // tpl.mySortedView.setSort('A', 'sortByCity', tpl.cityGetter);
            // tpl.$json.setValue(tpl.data.cities, 0, "Turin");
            // this.assertEquals(tableBody.children.length, 2);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Rome");
            // TODO check the number of refreshes

            this.assertLogsEmpty();
            this._replaceTestTemplate(this._testEnv5, {
                fn : this.runTestFive,
                scope : this
            });
        },

        /**
         * Test pagedView looptype
         */
        runTestFive : function () {
            var tpl = this.templateCtxt._tpl;
            var tableBody = this.testDiv.children[0].children[0].children[0];
            this.assertEquals(tableBody.children.length, 2);
            this.assertEquals(tableBody.children[0].children[0].innerHTML, "London");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");

            // Disabled because it is not working yet:
            // tpl.mySortedView.setSort('D', 'sortByCity', tpl.cityGetter);
            // this.assertEquals(tableBody.children.length, 2);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "London");
            //
            // tpl.$json.add(tpl.data.cities, {
            // city : "Rome"
            // });
            // this.assertEquals(tableBody.children.length, 3);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Rome");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "London");
            //
            // tpl.mySortedView.setSort('I', 'sortByCity', tpl.cityGetter);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "Rome");
            //
            // tpl.$json.add(tpl.data.cities, {
            // city : "Lisbon"
            // }, 1);
            // this.assertEquals(tableBody.children.length, 3);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Lisbon");
            // this.assertEquals(tableBody.children[2].children[0].innerHTML, "London");
            //
            // tpl.mySortedView.currentPageIndex = 1;
            // this.assertEquals(tableBody.children.length, 1);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Rome");
            // tpl.mySortedView.setPageSize(2);
            // this.assertEquals(tableBody.children.length, 2);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Rome");
            //
            // tpl.mySortedView.setSort('D', 'sortByCity', tpl.cityGetter);
            // this.assertEquals(tableBody.children.length, 2);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "London");
            // this.assertEquals(tableBody.children[1].children[0].innerHTML, "Lisbon");
            //
            // tpl.$json.removeAt(tpl.data.cities, 3);
            // this.assertEquals(tableBody.children.length, 1);
            // this.assertEquals(tableBody.children[0].children[0].innerHTML, "Lisbon");
            // TODO check the number of refreshes

            this.assertLogsEmpty();
            this._replaceTestTemplate(this._testEnv6, {
                fn : this.runTestSix,
                scope : this
            });

        },

        /**
         * Test errors that should be raised
         */
        runTestSix : function () {
            var tpl = this.templateCtxt._tpl;
            var data = tpl.data;
            this.assertLogsEmpty();

            tpl.$json.setValue(data, "step", 1);
            tpl.$refresh();
            this.assertErrorInLogs(aria.templates.Repeater.REPEATER_INVALID_ITERATED_SET);
            this.assertLogsEmpty();

            tpl.$json.setValue(data, "step", 2);
            tpl.$refresh();
            this.assertErrorInLogs(aria.templates.Section.INVALID_CONFIGURATION);
            this.assertLogsEmpty();

            tpl.$json.setValue(data, "step", 3);
            tpl.$refresh();
            this.assertErrorInLogs(aria.templates.Repeater.REPEATER_MACRO_NOT_SUPPORTED);
            this.assertLogsEmpty();

            tpl.$json.setValue(data, "step", 4);
            tpl.$refresh();
            this.assertErrorInLogs(aria.templates.Section.INVALID_CONFIGURATION);
            this.assertLogsEmpty();

            this._replaceTestTemplate(this._testEnv7, {
                fn : this.runTestSeven,
                scope : this
            });
        },

        /**
         * Test that the scope : this is well interpreted when a repeater is defined inside a macro library
         */
        runTestSeven : function () {
            var tpl = this.templateCtxt._tpl;
            var tableBody = this.testDiv.children[0].children[0].children[0];
            this.assertEquals(tableBody.children[0].children[0].innerHTML.replace(/\s*/g, ''), "libraryMacro");

            this._replaceTestTemplate(this._testEnv8, {
                fn : this.runTestEight,
                scope : this
            });
        },

        /**
         * Test integration with the refresh manager.
         */
        runTestEight : function () {
            var tpl = this.templateCtxt._tpl;
            var myArray = tpl.data.cities;
            var tableBody = this.testDiv.children[0].children[0].children[0].children[0];
            tpl.$refresh({
                outputSection : "subSection" + myArray[0].repeaterItem.sectionIdSuffix
            });
            tpl.$refresh({
                outputSection : "containingSection"
            });

            tableBody = this.testDiv.children[0].children[0].children[0].children[0];

            aria.templates.RefreshManager.stop();

            tpl.$json.splice(myArray, 0, 0, {
                city : "Geneva",
                refreshCt : 0,
                subRefreshCt : 0
            }, {
                city : "Monaco",
                refreshCt : 0,
                subRefreshCt : 0
            });

            tpl.$json.splice(myArray, 0, 1);

            this.assertEquals(tableBody.children[0].children[0].innerHTML, "Paris");
            this.assertEquals(tableBody.children[1].children[0].innerHTML, "London");
            this.assertEquals(tableBody.children[2].children[0].innerHTML, "Tokyo");

            tpl.$refresh({
                outputSection : "subSection" + myArray[3].repeaterItem.sectionIdSuffix
            });
            tpl.$refresh({
                outputSection : "containingSection"
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

            tpl.$json.splice(myArray, 0, 0, {
                city : "FrankFurt",
                refreshCt : 0,
                subRefreshCt : 0
            }, {
                city : "Lyon",
                refreshCt : 0,
                subRefreshCt : 0
            });

            tpl.$json.splice(myArray, 0, 1, {
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

            tpl.$refresh({
                outputSection : "subSection" + myArray[3].repeaterItem.sectionIdSuffix
            });
            tpl.$refresh({
                outputSection : "childSection" + myArray[4].repeaterItem.sectionIdSuffix
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
            tpl.$refresh({
                outputSection : "repeaterSection"
            });

            this.assertEquals(myArray[0].subRefreshCt, 2);
            this.assertEquals(myArray[1].subRefreshCt, 2);
            this.assertEquals(myArray[2].subRefreshCt, 2);
            this.assertEquals(myArray[3].subRefreshCt, 6);
            this.assertEquals(myArray[3].refreshCt, 4);
            this.assertEquals(myArray[4].subRefreshCt, 5);
            this.assertEquals(myArray[5].subRefreshCt, 4);

            this.notifyTemplateTestEnd();
        }

    }
});

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
    $classpath : "test.aria.html.select.SelectTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.html.Select", "aria.utils.json", "aria.utils.FireDomEvent", "aria.utils.SynEvents"],
    $prototype : {

        testWithoutInitialIndex : function () {
            var container = {};

            var bindingConfig = {
                selectedIndex : {
                    inside : container,
                    to : "index"
                }
            };

            var cfg1 = {
                bind : bindingConfig
            };

            var selectWidget = this.createAndInit("aria.html.Select", cfg1);

            this.assertEquals(selectWidget._domElt.options.length, 0, "selectWidget's options property should be initially empty but had %1 element(s)");

            this.assertEquals(selectWidget._domElt.selectedIndex, -1, "The selected Index should be %2  but was %1 ");

            selectWidget.$dispose();
            this.outObj.clearAll();
        },

        testWithInitialIndex : function () {
            var container = {
                "index" : 0
            };

            var bindingConfig = {
                selectedIndex : {
                    inside : container,
                    to : "index"
                }
            };

            var myOptions = [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }];

            var selectWidgetCfg = {
                options : myOptions,
                bind : bindingConfig
            };

            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            this.assertEquals(selectWidget.options.length, 3, "selectWidget's options property should have initially %2 elements but had %1 element(s)");
            this.assertEquals(selectWidget._domElt.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            aria.utils.Json.setValue(container, "index", '1');

            this.assertEquals(selectWidget._domElt.selectedIndex, 1, "The selected Index should be %2  but was %1 ");

            selectWidget.$dispose();
            this.outObj.clearAll();
        },

        testTransformIndexFromWidget : function () {
            var container = {
                "index" : "1"
            };

            var bindingConfig = {
                selectedIndex : {
                    inside : container,
                    to : "index",
                    transform : {
                        fromWidget : function (value) {
                            return value + 1;
                        },
                        toWidget : function (value) {
                            return value - 1;
                        }
                    }
                }
            };

            var myOptions = [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }];

            var selectWidgetCfg = {
                options : myOptions,
                bind : bindingConfig
            };

            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            this.assertEquals(selectWidget._domElt.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            aria.utils.Json.setValue(container, "index", 'WrongValue');
            this.assertEquals(selectWidget._domElt.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            aria.utils.Json.setValue(container, "index", '2');
            this.assertEquals(selectWidget._domElt.selectedIndex, 1, "The selected Index should be %2  but was %1 ");
            selectWidget.$dispose();

            this.outObj.clearAll();
        },

        testReactOnClickWithBoundIndex : function () {
            var container = {
                "index" : 0
            };

            var bindingConfig = {
                selectedIndex : {
                    inside : container,
                    to : "index"
                }
            };

            var myOptions = [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }];

            var selectWidgetCfg = {
                options : myOptions,
                bind : bindingConfig
            };

            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            this.assertEquals(selectWidget._domElt.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            // to be disposed in the callback of the click action
            this.selectWidget = selectWidget;
            this.container = container;

            aria.utils.SynEvents.click(selectWidget._domElt.options[1], {
                fn : this.afterFirstClick,
                scope : this
            });

        },

        afterFirstClick : function () {

            this.assertEquals(this.selectWidget._domElt.selectedIndex, 1, "The selected Index should be %2  but was %1 ");
            this.assertEquals(this.container.index, 1, "The selected item should be %2  but was %1 ");

            this.selectWidget.$dispose();
            this.outObj.clearAll();
        },

        testNoBinding : function () {
            var container = {
                "index" : "0"
            };

            var myOptions = [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }];

            var selectWidgetCfg = {
                options : myOptions
            };

            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            this.assertErrorInLogs(aria.html.Select.BINDING_NEEDED);

            selectWidget.$dispose();
            this.outObj.clearAll();
        },

        testSelectedOption : function () {
            var container = {
                "index" : 0
            };

            var bindingConfig = {
                selectedIndex : {
                    inside : container,
                    to : "index"
                }
            };
            var myOptions = [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland",
                        attributes : {
                            selected : "",
                            disabled : "disabled"
                        }
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }];

            var selectWidgetCfg = {
                options : myOptions,
                bind : bindingConfig
            };

            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            // <=> data model wins over the attribute if they are both set
            this.assertEquals(selectWidget._domElt.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            selectWidget.$dispose();
            this.outObj.clearAll();
        },

        testArrayOfStringsOption : function () {
            var container = {
                "index" : 0
            };

            var bindingConfig = {
                selectedIndex : {
                    inside : container,
                    to : "index"
                }
            };
            var myOptions = ["France", "Switzerland", "United Kingdom"];

            var selectWidgetCfg = {
                options : myOptions,
                bind : bindingConfig
            };

            // accept an array of string as options
            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            this.assertEquals(selectWidget._domElt.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            // to be disposed in the callback of the click action
            this.selectWidget = selectWidget;
            this.container = container;

            aria.utils.SynEvents.click(selectWidget._domElt.options[1], {
                fn : this.afterFirstClick,
                scope : this
            });
        },

        // same set of tests using binding a value instead of an index

        testWithInitialValue : function () {
            var container = {
                "item" : "FR"
            };

            var bindingConfig = {
                value : {
                    inside : container,
                    to : "item"
                }
            };

            var myOptions = [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }];

            var selectWidgetCfg = {
                options : myOptions,
                bind : bindingConfig
            };

            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            this.assertEquals(selectWidget.options.length, 3, "selectWidget's options property should have initially %2 elements but had %1 element(s)");
            this.assertEquals(selectWidget._domElt.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            aria.utils.Json.setValue(container, "item", 'CH');

            this.assertEquals(selectWidget._domElt.selectedIndex, 1, "The selected Index should be %2  but was %1 ");

            selectWidget.$dispose();
            this.outObj.clearAll();
        },

        testTransformValueFromWidget : function () {
            var container = {
                "item" : "FR"
            };

            var bindingConfig = {
                value : {
                    inside : container,
                    to : "item",
                    transform : {
                        fromWidget : function (value) {
                            return value.toLowerCase();
                        },
                        toWidget : function (value) {
                            return value.toUpperCase();
                        }
                    }
                }
            };

            var myOptions = [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }];

            var selectWidgetCfg = {
                options : myOptions,
                bind : bindingConfig
            };

            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            aria.utils.Json.setValue(container, "item", 'WrongValue');
            this.assertEquals(selectWidget._domElt.selectedIndex, -1, "The selected Index should be %2  but was %1 ");

            aria.utils.Json.setValue(container, "item", 'ch');
            this.assertEquals(selectWidget._domElt.selectedIndex, 1, "The selected Index should be %2  but was %1 ");
            selectWidget.$dispose();

            this.outObj.clearAll();
        },

        testReactOnClickWithBoundValue : function () {
            var container = {
                "item" : "FR"
            };

            var bindingConfig = {
                value : {
                    inside : container,
                    to : "item"
                }
            };

            var myOptions = [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }];

            var selectWidgetCfg = {
                options : myOptions,
                bind : bindingConfig
            };

            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            this.assertEquals(selectWidget._domElt.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            // to be disposed in the callback of the click action
            this.selectWidget = selectWidget;
            this.container = container;

            aria.utils.SynEvents.click(selectWidget._domElt.options[1], {
                fn : this.afterFirstClickValue,
                scope : this
            });

        },

        afterFirstClickValue : function () {

            this.assertEquals(this.selectWidget._domElt.selectedIndex, 1, "The selected Index should be %2  but was %1 ");
            this.assertEquals(this.container.item, "CH", "The selected item should be %2  but was %1 ");

            this.selectWidget.$dispose();
            this.outObj.clearAll();
        },

         testWithBothValueAndIndexBound : function () {
            var container = {
                "item" : "FR",
                index: 0
            };

            var bindingConfig = {
                value : {
                    inside : container,
                    to : "item"
                },
                selectedIndex : {
                    inside : container,
                    to : "index"
                }
            };

            var myOptions = [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "UK",
                        label : "United Kingdom"
                    }];

            var selectWidgetCfg = {
                options : myOptions,
                bind : bindingConfig
            };

            var selectWidget = this.createAndInit("aria.html.Select", selectWidgetCfg);

            this.assertEquals(selectWidget._domElt.selectedIndex, 0, "The selected Index should be %2  but was %1 ");

            aria.utils.Json.setValue(container, "item", 'CH');

            this.assertEquals(selectWidget._domElt.selectedIndex, 1, "The selected Index should be %2  but was %1 ");

            //the model should have been updated as well
            this.assertEquals(container.index, 1, "The Index in the data model should be %2  but was %1 ");

            selectWidget.$dispose();
            this.outObj.clearAll();
        }

    }
});

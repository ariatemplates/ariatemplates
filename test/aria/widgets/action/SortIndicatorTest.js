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

/**
 * Test case for test.aria.widgets.action.SortIndicatorTest
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.action.SortIndicatorTest",
    $dependencies : ["aria.templates.View"],
    $extends : "aria.jsunit.WidgetTestCase",
    $prototype : {
        _createSortIndicator : function (cfg) {

            var o = new aria.widgets.action.SortIndicator(cfg, this.outObj.tplCtxt);

            o.writeMarkup(this.outObj);
            this.outObj.putInDOM();
            // init widget
            o.initWidget();
            return {
                o : o,
                dom : this.outObj.testArea.childNodes[0]
            };
        },
        testAsyncSetState : function () {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The first test hence becomes asynchronous
            Aria.load({
                classes : ["aria.widgets.action.SortIndicator"],
                oncomplete : {
                    fn : this._testSetState,
                    scope : this
                }
            });
        },

        _testSetState : function () {

            var myArray = [0, 1, 2, 3, 4];
            var myView = new aria.templates.View(myArray);

            var tf = this._createSortIndicator({
                sortName : "SortByAirport",
                label : "Airport",
                view : myView,
                sortKeyGetter : function (o) {
                    return "equipment"
                },
                refreshArgs : [{
                            filterSection : "bound1"
                        }]
            });

            var o = tf.o;
            o._state = o._setState(o._cfg);
            this.assertTrue(o._state == 'normal');

            o._cfg.view.sortName = 'SortByAirport';
            o._cfg.view.sortOrder = 'A';
            o._state = o._setState(o._cfg);

            this.assertTrue(o._state == 'ascending');

            o._cfg.view.sortName = 'SortByAirport';
            o._cfg.view.sortOrder = 'D';
            o._state = o._setState(o._cfg);

            this.assertTrue(o._state == 'descending');
            o.$dispose();
            myView.$dispose();
            this.outObj.clearAll();
            this.notifyTestEnd("testAsyncSetState");
        }

    }
});
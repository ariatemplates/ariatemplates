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
    $dependencies : ["aria.templates.View", "aria.widgets.action.SortIndicator"],
    $extends : "aria.jsunit.WidgetTestCase",
    $prototype : {
        _createSortIndicator : function (cfg) {
            return {
                o : this.createAndInit("aria.widgets.action.SortIndicator", cfg),
                dom : this.outObj.testArea.childNodes[0]
            };
        },
        testSetState : function () {
            var myArray = [0, 1, 2, 3, 4];
            var myView = new aria.templates.View(myArray);

            var tf = this._createSortIndicator({
                sortName : "SortByAirport",
                label : "Airport",
                view : myView,
                sortKeyGetter : function (o) {
                    return "equipment";
                },
                refreshArgs : [{
                            filterSection : "bound1"
                        }]
            });

            var widget = tf.o;
            widget._state = widget._setState(widget._cfg);
            this.assertTrue(widget._state == 'normal');

            widget._cfg.view.sortName = 'SortByAirport';
            widget._cfg.view.sortOrder = 'A';
            widget._state = widget._setState(widget._cfg);

            this.assertTrue(widget._state == 'ascending');

            widget._cfg.view.sortName = 'SortByAirport';
            widget._cfg.view.sortOrder = 'D';
            widget._state = widget._setState(widget._cfg);

            this.assertTrue(widget._state == 'descending');
            widget.$dispose();
            myView.$dispose();
        }

    }
});
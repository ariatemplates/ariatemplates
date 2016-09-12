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
    $classpath : "test.aria.widgets.form.multiautocomplete.testDataModelOnEdit.MultiAutoDataModelRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.MultiAutoCompleteRobotBase",
    $constructor : function () {

        this.data = {
            ac_airline_values : ["India", "Singapore", "America"],
            freeText : true
        };
        this.$MultiAutoCompleteRobotBase.constructor.call(this);

    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            // initial test for all the suggestions added
            this.checkSelectedItems(3);
            this._fireClickOnSuggestion(1, "_afterFirstClick");
        },
        _afterFirstClick : function () {
            this.checkHighlightedElementsIndices([2]);
            // item is already highlighted, it goes to edit mode now
            this._fireClickOnSuggestion(1, "_afterEditSingapore");
        },
        _afterEditSingapore : function () {
            aria.core.Timer.addCallback({
                fn : this._checkForEditOnRangeValues,
                scope : this,
                delay : 10
            });
        },
        _checkForEditOnRangeValues : function () {
            this.type({
                text : ["p1-3", "[enter]"],
                cb : {
                    fn : this._checkValueAfterEditOnRangeValues,
                    scope : this
                },
                delay : 500
            });
        },
        _checkValueAfterEditOnRangeValues : function () {
            var widgetController = this.getWidgetInstance("MultiAutoId").controller;
            this.checkSelectedItems(5, ["India", "P1.some", "P2.kon", "P3.red", "America"]);
            this.checkDataModel(5, widgetController.selectedSuggestions);
            this.checkDataModel(5, ["India", {
                        label : 'P1.some',
                        code : 'P1'
                    }, {
                        label : 'P2.kon',
                        code : 'P2'
                    }, {
                        label : 'P3.red',
                        code : 'P3'
                    }, "America"]);
            this._fireClickOnSuggestion(0, "_afterFirstClickOnIndia");
        },
        _afterFirstClickOnIndia : function () {
            this.checkHighlightedElementsIndices([1]);
            // item is already highlighted, it goes to edit mode now
            this._fireClickOnSuggestion(0, "_afterEditIndia");
        },
        _afterEditIndia : function () {
            aria.core.Timer.addCallback({
                fn : this._checkForEditOnSingleValue,
                scope : this,
                delay : 10
            });
        },
        _checkForEditOnSingleValue : function () {
            this.type({
                text : ["fi", "[down][enter]"],
                cb : {
                    fn : this._checkValueAfterEditOnSingleValue,
                    scope : this
                },
                delay : 500
            });
        },
        _checkValueAfterEditOnSingleValue : function () {
            var widgetController = this.getWidgetInstance("MultiAutoId").controller;
            this.checkSelectedItems(5, ["Finnair", "P1.some", "P2.kon", "P3.red", "America"]);
            this.checkDataModel(5, widgetController.selectedSuggestions);
            this.checkDataModel(5, [{
                        label : 'Finnair',
                        code : 'XX'
                    }, {
                        label : 'P1.some',
                        code : 'P1'
                    }, {
                        label : 'P2.kon',
                        code : 'P2'
                    }, {
                        label : 'P3.red',
                        code : 'P3'
                    }, "America"]);
            this.end();
        }
    }
});

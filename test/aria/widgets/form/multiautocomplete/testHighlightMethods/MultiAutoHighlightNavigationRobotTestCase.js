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
    $classpath : "test.aria.widgets.form.multiautocomplete.testHighlightMethods.MultiAutoHighlightNavigationRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.MultiAutoCompleteRobotBase",
    $constructor : function () {

        this.data = {
            ac_airline_values : ["India", "Singapore", "America", "France"],
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
            this.checkSelectedItems(4);

            this._fireClickOnSuggestion(1, "_afterFirstClick");
        },

        _afterFirstClick : function () {
            this.checkHighlightedElementsIndices([2]);

            // test for removal, and adding highlight again
            this._fireClickOnSuggestion(2, "_afterSecondClick");
        },

        _afterSecondClick : function () {
            this.checkHighlightedElementsIndices([3]);

            this.type({
                text : ["[delete]"],
                cb : {
                    fn : this._afterDelete,
                    scope : this
                },
                delay : 800
            });

        },
        _afterDelete : function () {
            // 'America' was highlighted, should have been removed
            this.checkSelectedItems(3, ["India", "Singapore", "France"]);
            this.checkHighlightedElementsIndices([3]);

            this.type({
                text : ["[backspace]"],
                cb : {
                    fn : this._afterBackspace,
                    scope : this
                },
                delay : 800
            });

        },
        _afterBackspace : function () {
            // 'France' was highlighted, should have been removed
            this.checkSelectedItems(2, ["India", "Singapore"]);
            this.checkHighlightedElementsIndices([2]);

            // since the element is already highlighted, it should now go to edit mode
            this._fireClickOnSuggestion(1, "_afterEditSingapore");
        },

        _afterEditSingapore : function () {
            aria.core.Timer.addCallback({
                fn : this._checkForEdit,
                scope : this,
                delay : 10
            });
        },

        _checkForEdit : function () {
            this.type({
                text : ["p1-3", "[enter]"],
                cb : {
                    fn : this._checkValueAfterEdit,
                    scope : this
                },
                delay : 500
            });
        },
        _checkValueAfterEdit : function () {
            this.checkSelectedItems(4, ["India", "P1.some", "P2.kon", "P3.red"]);
            this.checkDataModel(4, ["India", {
                        label : 'P1.some',
                        code : 'P1'
                    }, {
                        label : 'P2.kon',
                        code : 'P2'
                    }, {
                        label : 'P3.red',
                        code : 'P3'
                    }]);
            this._fireClickOnSuggestion(3, "_afterClickOnP3");
        },

        _afterClickOnP3 : function () {
            this.checkHighlightedElementsIndices([4]);
            this.type({
                text : ["[delete]"],
                cb : {
                    fn : this._afterDeleteLastSuggestion,
                    scope : this
                },
                delay : 800
            });
        },
        _afterDeleteLastSuggestion : function () {
            this.checkHighlightedElementsIndices([]);
            this._fireClickOnSuggestion(0, "_afterClickOnIndia");
        },

        _afterClickOnIndia : function () {
            this.type({
                text : ["[backspace]"],
                cb : {
                    fn : this._afterBackspaceFirstSuggestion,
                    scope : this
                },
                delay : 800
            });
        },
        // backspace on first highlighted suggestion adds the highlight to following element
        _afterBackspaceFirstSuggestion : function () {
            this.checkHighlightedElementsIndices([1]);
            this.end();
        }
    }
});

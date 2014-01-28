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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.testHighlightMethods.MultiAutoHighlightTest",
    $extends : "test.aria.widgets.form.autocomplete.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $constructor : function () {

        this.data = {
            ac_airline_values : ["India", "Singapore", "America", "France"],
            freeText : true
        };

        this.$BaseMultiAutoCompleteTestCase.constructor.call(this);

    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var widgetInstance = this.getWidgetInstance("MultiAutoId");
            this.checkSelectedItems(4);

            widgetInstance.addHighlight([1, 3, 4]);
            this.checkHighlightedElementsIndices([1, 3, 4]);
            // remove highlight with index
            widgetInstance.removeHighlight(3);

            // nothing should happen here
            widgetInstance.removeHighlight(0);
            this.checkHighlightedElementsIndices([1, 4]);
            // add highlight with index
            widgetInstance.addHighlight(2);
            this.checkHighlightedElementsIndices([1, 2, 4]);

            // remove highlight with array of indices
            widgetInstance.removeHighlight([2, 4]);
            this.checkHighlightedElementsIndices([1]);

            // add highlight with array of indices
            widgetInstance.addHighlight([2, 3, 4]);
            // remove highlight with no argument
            widgetInstance.removeHighlight();
            this.checkHighlightedElementsIndices([]);
            this.end();
        }
    }
});

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
    $classpath : "test.aria.widgets.form.multiautocomplete.testHighlightMethods.MultiAutoHighlightTest",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
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

            widgetInstance.highlightOption(1);
            this.checkHighlightedElementsIndices([1]);
            widgetInstance.unhighlightOption();
            this.checkHighlightedElementsIndices([]);

            // Bounds
            widgetInstance.highlightOption(1);

            widgetInstance.highlightOption(0);
            this.assertErrorInLogs(widgetInstance.INDEX_OUT_OF_BOUNDS);
            this.checkHighlightedElementsIndices([1]);

            widgetInstance.highlightOption(5);
            this.assertErrorInLogs(widgetInstance.INDEX_OUT_OF_BOUNDS);
            this.checkHighlightedElementsIndices([1]);

            this.end();
        }
    }
});

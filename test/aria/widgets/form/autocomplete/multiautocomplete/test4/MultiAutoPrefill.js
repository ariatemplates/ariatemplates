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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test4.MultiAutoPrefill",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            ac_airline_values : ["Air France", "Air Canada", "Finnair"]
        };

        // setTestEnv has to be invoked before runTemplateTest fires
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.multiautocomplete.template.MultiAutoTpl",
            data : this.data
        });

    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var parentNode = this.getInputField("MultiAutoId").parentNode, suggestionNode = parentNode.childNodes;
            this.assertEquals(suggestionNode.length, 4, "The Wrong No. of elements are prefilled.");
            var expectedVal = ["Air France", "Air Canada", "Finnair"];
            for (var j = 0; j < suggestionNode.length - 1; j++) {
                this.assertEquals(suggestionNode[j].childNodes.length, 2, "The Wrong No. of elements are prefilled.");
                var element = suggestionNode[j].firstChild.innerText || suggestionNode[j].firstChild.textContent;
                this.assertEquals(element, expectedVal[j], "The Wrong values are prefilled as for Autocomplete.");
            }
            this.notifyTemplateTestEnd();
        }
    }
});

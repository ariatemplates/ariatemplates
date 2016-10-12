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
    $classpath : "test.aria.widgets.form.multiselect.invalidcontent.MultiSelectTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.widgets.controllers.MultiSelectController"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by opening the MultiSelect
         * popup.
         */
        runTemplateTest : function () {
            var msIcon = this.getMultiSelectIcon("Err1");
            this.assertErrorInLogs(aria.widgets.controllers.MultiSelectController.INVALID_MULTISELECT_CONTENT, 1);
            this.notifyTemplateTestEnd();
        }
    }
});

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
    $classpath : "test.aria.widgets.form.select.sharedSelect.SimpleHtmlTestCase",
    $extends : "test.aria.widgets.form.select.sharedSelect.SharedSelectTemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {

        this.$SharedSelectTemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.select.sharedSelect.SimpleHtmlTemplate",
            data : this.data
        });
    },
    $destructor : function () {
        this.$SharedSelectTemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        // look up the parent class to see the tests
        getCurrentOptionsFirstValue : function () {
            return this.select.options[this.select.selectedIndex].value;
        },

        getCurrentlySelectedValue : function () {
            this.getCurrentOptionsFirstValue();
        }
    }
});

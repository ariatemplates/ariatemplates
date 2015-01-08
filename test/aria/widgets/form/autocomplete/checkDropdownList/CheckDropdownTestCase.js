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
    $classpath : "test.aria.widgets.form.autocomplete.checkDropdownList.CheckDropdownTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("ac"), {
                fn : function () {
                    this.waitForWidgetFocus("ac", this.typeSomething);
                },
                scope : this
            });
        },

        typeSomething : function () {
            this.synEvent.type(this.getInputField("ac"), "PAR", {
                fn : this.wait,
                scope : this
            });
        },
        wait : function () {
            this.waitFor({
                condition : function () {
                    return !!this.getWidgetDropDownPopup("ac");
                },
                callback : {
                    fn : this.checkDropdownlist,
                    scope : this
                }
            });
        },

        checkDropdownlist : function () {
            var dropdownPopup = this.getWidgetInstance("ac")._dropdownPopup;
            this.assertTrue(dropdownPopup != null && dropdownPopup !== undefined, "The dropdown should be open");
            this.finishTest();
        },

        /**
         * Finalize the test, in this case, nothing special to do
         */
        finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});

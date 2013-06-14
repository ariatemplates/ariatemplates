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
    $classpath : "test.aria.widgets.form.multiselect.deleteFieldValue.test2.MultiSelect",
    $extends : "aria.jsunit.MultiSelectTemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$MultiSelectTemplateTestCase.constructor.call(this);
    },
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by opening the MultiSelect
         * popup.
         */
        runTemplateTest : function () {
            this.toggleMultiSelectOn("ms1", this._onMsOpened);
        },

        /**
         * Select the first selectable item and then close the popup using the up arrow key.
         */
        _onMsOpened : function () {
            var checkBox = this.getWidgetInstance("listItem0").getDom();
            this.synEvent.type(checkBox, "[space][up]", {
                fn : this._onMsFocus,
                scope : this
            });
        },

        _onMsFocus : function () {
            // var ms1 = this.getWidgetInstance("ms1");
            this.clickAndType("ms1", "[backspace][backspace][backspace][backspace][backspace][delete][delete][delete][delete][delete]AZ", {
                fn : this._waitClosed,
                scope : this
            });
        },

        _waitClosed : function () {
            this.waitUntilMsClosed('ms1', this._onMsClosed);
        },

        _onMsClosed : function () {
            // expand the multiselect
            this.clickAndType("ms1", "[down]", {
                fn : this._onAfterArrowDown,
                scope : this
            });
        },

        _onAfterArrowDown : function () {
            this.waitFor({
                condition : function () {
                    var test = aria.utils.Dom.getElementById("test1");
                    return test.innerHTML === '0';
                },
                callback : {
                    fn : this._finishTest,
                    scope : this
                }
            });
        },

        /**
         * Finalize the test.
         */
        _finishTest : function () {
            // this is a repetitive assert from the waitFor condition, just to have > 0 asserts in the test case
            this.assertEquals(aria.utils.Dom.getElementById("test1").innerHTML, '0');
            this.notifyTemplateTestEnd();
        }
    }
});

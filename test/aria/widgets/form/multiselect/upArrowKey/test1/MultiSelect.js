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
    $classpath : "test.aria.widgets.form.multiselect.upArrowKey.test1.MultiSelect",
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
            this.inputField = this.getInputField("ms1");
            this.toggleMultiSelectOn("ms1", this.onMsOpened);
        },

        /**
         * Select the first selectable item and then close the popup using the up arrow key.
         */
        onMsOpened : function () {
            var checkBox = this.getWidgetInstance("listItem0").getDom();
            this.synEvent.type(checkBox, "[space][up]", {
                fn : this.onDmClick,
                scope : this
            });
        },
        /**
         * Click on any Other Dom Element
         */
        onDmClick : function () {
            var domRef = aria.utils.Dom.getElementById("clickM"), that = this;
            this.getWidgetInstance("ms1")._dom_onblur = function () {};
            that.synEvent.click(domRef, {
                fn : that.checkAndReopen,
                scope : that
            });
        },

        /**
         * Finalize the test, check the widgets value has been correctly updated when the up key was triggered.
         */
        checkAndReopen : function () {
            var test = aria.utils.Dom.getElementById("test1");
            this.assertTrue(test.innerHTML === 'KF');

            // Reopen the MS with the down arrow
            this.clickAndType("ms1", "[down]", {
                fn : this.finishTest,
                scope : this
            }, false);
        },

        finishTest : function() {
            var checkBox = this.getWidgetInstance("listItem0").getDom();
            this.assertTrue(checkBox.getElementsByTagName("input")[0].checked, "The checkbox 'King Fischer' should be checked");
            this.end();
        }
    }
});

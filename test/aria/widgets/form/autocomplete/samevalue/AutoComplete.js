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
    $classpath : "test.aria.widgets.form.autocomplete.samevalue.AutoComplete",
    $extends : "aria.jsunit.RobotTestCase",
    $prototype : {
        runTemplateTest : function () {
            this.clickAndType('acDest1', 'lon', {
                fn : this.onDelay,
                scope : this
            }, false);
        },

        /**
         * Need to add a delay to allow the list to open with the returned suggestions.
         */
        onDelay : function () {
            aria.core.Timer.addCallback({
                fn : this.doTheTab,
                scope : this,
                delay : 1000
            });
        },

        doTheTab : function () {
            // Do the Tab
            var ac1 = this.getInputField("acDest1");
            Syn.key("tab", ac1, aria.utils.Function.bind(this.checkAfterFirstAction, this));
        },

        checkAfterFirstAction : function () {
            var test1 = this.getInputField("acDest1");
            var test2 = this.getInputField("acDest2");
            this.assertEquals(test1.value, "London");
            this.assertEquals(test2.value, "London");

            this.clickAndType('acDest1', '[backspace][backspace][backspace][backspace][backspace][backspace][backspace]', {
                fn : this.checkAfterSecondAction,
                scope : this
            }, true);
        },

        checkAfterSecondAction : function () {
            var test1 = this.getInputField("acDest1");
            var test2 = this.getInputField("acDest2");
            this.assertEquals(test1.value, "");
            this.assertEquals(test2.value, "");

            this.notifyTemplateTestEnd();
        }
    }
});

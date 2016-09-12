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
    $classpath : "test.aria.widgets.form.autocomplete.caret.CaretTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            var isMac = aria.core.Browser.isMac;
            var home = isMac ? "[<META>][left][>META<]" : "[home]";
            var input = this.getInputField("ac");
            this.synEvent.execute([["click", input], ["type", input, home + "[right][<shift>][right][right][>shift<]"],
                    ["pause", 1000], ["type", input, "a"], ["pause", 500], ["type", input, "p"], ["pause", 500]], {
                fn : this.onType,
                scope : this
            });
        },
        /**
         * After pasting, check that the dropdown is opened. The datamodel is updated on blur
         */
        onType : function () {
            var fieldText = this.getInputField("ac").value;
            this.assertEquals(fieldText, "japan", "Text in the autocomplete should be japan, got: " + fieldText);
            this.notifyTemplateTestEnd();
        }
    }
});

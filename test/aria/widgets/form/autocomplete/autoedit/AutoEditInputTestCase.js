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
    $classpath : "test.aria.widgets.form.autocomplete.autoedit.AutoEditInputTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {

            this.synEvent.click(this.getInputField("AutoEdit1"), {
                fn : function () {
                    this.waitForWidgetFocus("AutoEdit1", this.onSelectBoxFocused);
                },
                scope : this
            });
        },

        onSelectBoxFocused : function () {
            this.getWidgetInstance("AutoEdit1").setCaretPosition(29, 29);
            this.synEvent.type(this.getInputField("AutoEdit1"), "[left][left][left]", {
                fn : this.typeSecondLetter,
                scope : this
            });

        },

        typeSecondLetter : function () {

            this.synEvent.type(this.getInputField("AutoEdit1"), "--", {
                fn : this.afterTypeSecondLetter,
                scope : this
            });

        },

        afterTypeSecondLetter : function () {

            this.getInputField("AutoEdit1").blur();
            this.waitForWidgetBlur("AutoEdit1", function () {
                this.assertTrue(this.getInputField("AutoEdit1").value == "Pa--ris");
                aria.core.Timer.addCallback({
                    fn : this.end,
                    scope : this,
                    delay : 500
                    // give some time to download P.txt before disposing everything
                });
            });
        }
    }
});

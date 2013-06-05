/*
 * Copyright 2012 Amadeus s.a.s.
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

/**
 * Makes sure that the user cannot focus on something outside a modal dialog.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.focus.FocusInsideModalDialog",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Function"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        // override the template for this test case
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.focus.ModalDialogFocus"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.templateCtxt.$focus("myLink");
            // set a timeout for IE
            setTimeout(aria.utils.Function.bind(this.finishTest, this), 200);
        },

        finishTest : function () {
            this.assertTrue(this.templateCtxt.data.focused, "Modal dialog did not take focus after focusing on something outside of it.");
            this.notifyTemplateTestEnd();
        }
    }
});

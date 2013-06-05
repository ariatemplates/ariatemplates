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

Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.closeOnClick.CloseDialogOnClickTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            step : 0,
            dialogVisible : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.closeOnClick.CloseDialogOnClick",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.synEvent.click(Aria.$window.document.body, {
                fn : this.checkBinding,
                scope : this
            });
        },

        checkBinding : function () {
            this.assertFalse(this.templateCtxt.data.dialogVisible, "The 'visible' binded data should be false");
            this.assertTrue(Aria.$global._callback, "the callback should have been called");

            this.notifyTemplateTestEnd();
        }

    }
});

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
    $classpath : "test.aria.widgets.container.dialog.missingMacro.DialogTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            dialogVisible : true,
            contentMacro : "dialogContent"
        };
        this._testEnvOne = {
            template : "test.aria.widgets.container.dialog.missingMacro.DialogTestCaseTpl",
            data : this.data
        };
        this._testEnvTwo = {
            template : "test.aria.widgets.container.dialog.missingMacro.DialogTestCaseTplOne",
            data : this.data
        };
        this.setTestEnv(this._testEnvOne);
    },
    $prototype : {
        runTemplateTest : function () {
            aria.utils.Dom.getElementById("dummy").focus();
            // set a timeout for IE
            aria.core.Timer.addCallback({
                fn : this._afterDialogOpen,
                scope : this,
                delay : 200
            });
        },
        _afterDialogOpen : function () {
            this.assertLogsEmpty();

            this._replaceTestTemplate(this._testEnvTwo, {
                fn : this._testContentMacroErrors,
                scope : this
            });
        },
        _testContentMacroErrors : function () {
            this.assertErrorInLogs(aria.widgets.container.Dialog.MISSING_CONTENT_MACRO, 1);

            this.notifyTemplateTestEnd();
        }

    }
});

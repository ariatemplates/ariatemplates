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
    $classpath : "test.aria.widgets.container.dialog.macroContentMacro.MacroContentMacroTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            dialogEnabled : {
                Macro : false,
                BindMacro : false,
                MacroBindMacro : false
            }
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.macroContentMacro.MacroContentMacroTpl",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            // Little subtlety in the two test methods below:
            // MacroBindMacro is enabled before BindMacro in order to set the data model value
            // If enabled in the reverse order, then BindMacro would have had a binding to null.

            this._testMacro();
            this.end();
        },

        _testMacro : function () {
            this.__enableDialogAndCheckHtml("Macro", "Macro1Content");
            this.__enableDialogAndCheckHtml("MacroBindMacro", "Macro1Content");
            this.__enableDialogAndCheckHtml("BindMacro", "Macro1Content");

            // let's now change the data model value; dialogs with bindings should notice the change
            aria.utils.Json.setValue(this.data, "dialogMacroName", "macro2");

            // only check the two dialogs with bindings
            this.__assertDialogInnerHtmlMatches("BindMacro", "Macro2Content");
            this.__assertDialogInnerHtmlMatches("MacroBindMacro", "Macro2Content");

            this.assertLogsEmpty();
        },

        __enableDialog : function (dialogId) {
            aria.utils.Json.setValue(this.data.dialogEnabled, dialogId, true);
        },

        __enableDialogAndCheckHtml : function (dialogId, expectedHtml) {
            this.__enableDialog(dialogId);
            this.__assertDialogInnerHtmlMatches(dialogId, expectedHtml);
        },

        __assertDialogInnerHtmlMatches : function (dialogId, expected) {
            var dialogInstance = this.getWidgetInstance(dialogId);
            var match = dialogInstance._domElt.innerHTML.match(expected);
            this.assertTrue(match != null, "Expected to find " + expected + " in dialog " + dialogId);
        }

    }
});

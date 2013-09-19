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
                /* BACKWARD-COMPATIBILITY-BEGIN GH-687 */
                ContentMacro : false,
                BindContentMacro : false,
                ContentMacroBindContentMacro : false,
                mixed1 : false,
                mixed2 : false,
                mixed3 : false,
                mixed4 : false,
                /* BACKWARD-COMPATIBILITY-END GH-687 */
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
            /* BACKWARD-COMPATIBILITY-BEGIN GH-687 */
            this._testContentMacro();
            this._testMixedUsageLogsError();
            /* BACKWARD-COMPATIBILITY-END GH-687 */
            this.notifyTemplateTestEnd();
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

            // set back to old value
            aria.utils.Json.setValue(this.data, "dialogMacroName", "macro1");
        },
        /* BACKWARD-COMPATIBILITY-BEGIN GH-687 */
        _testContentMacro : function () {
            var deprecatedMsg = aria.widgets.container.Dialog.CONTENTMACRO_DEPRECATED;

            this.__enableDialogAndCheckHtml("ContentMacro", "Macro1Content");
            this.assertErrorInLogs(deprecatedMsg);

            this.__enableDialogAndCheckHtml("ContentMacroBindContentMacro", "Macro1Content");
            this.assertErrorInLogs(deprecatedMsg);

            this.__enableDialogAndCheckHtml("BindContentMacro", "Macro1Content");
            this.assertErrorInLogs(deprecatedMsg);

            // let's now change the data model value; dialogs with bindings should notice the change
            aria.utils.Json.setValue(this.data, "dialogMacroName", "macro2");

            // only check the two dialogs with bindings
            this.__assertDialogInnerHtmlMatches("BindMacro", "Macro2Content");
            this.__assertDialogInnerHtmlMatches("MacroBindMacro", "Macro2Content");

            this.assertLogsEmpty();
        },
        _testMixedUsageLogsError : function () {
            // enable the mixed dialogs one-by-one, and check the errors are logged for each
            var errorMsg = aria.widgets.container.Dialog.INCONSISTENT_MACRO_CONTENTMACRO_USAGE;

            this.__enableDialog("mixed1");
            this.assertErrorInLogs(errorMsg);

            this.__enableDialog("mixed2");
            this.assertErrorInLogs(errorMsg);

            this.__enableDialog("mixed3");
            this.assertErrorInLogs(errorMsg);

            this.__enableDialog("mixed4");
            this.assertErrorInLogs(errorMsg);
        },
        /* BACKWARD-COMPATIBILITY-END GH-687 */

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

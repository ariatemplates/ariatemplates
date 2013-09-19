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

{Template {
   $classpath:"test.aria.widgets.container.dialog.macroContentMacro.MacroContentMacroTpl"
}}
    {macro main()}

        {call writeGoodDialogs() /}
        /* BACKWARD-COMPATIBILITY-BEGIN GH-687 */
        {call writeDeprecatedDialogs() /}
        {call writeMixedDialogSection(1) /}
        {call writeMixedDialogSection(2) /}
        {call writeMixedDialogSection(3) /}
        {call writeMixedDialogSection(4) /}
        /* BACKWARD-COMPATIBILITY-END GH-687 */
    {/macro}

    {macro writeSectionWithDialog(macroId)}
        {section {
            macro: macroId,
            bindRefreshTo : [{
                to: macroId,
                inside: data.dialogEnabled
            }]
        } /}
    {/macro}

    {macro writeGoodDialogs()}
        {call writeSectionWithDialog("Macro") /}
        {call writeSectionWithDialog("BindMacro") /}
        {call writeSectionWithDialog("MacroBindMacro") /}
    {/macro}

    {macro Macro()}
        {if data.dialogEnabled.Macro}
            {@aria:Dialog {
                id: "Macro",
                visible : true,
                macro: "macro1"
            }/}
        {/if}
    {/macro}
    {macro BindMacro()}
        {if data.dialogEnabled.BindMacro}
            {@aria:Dialog {
                id: "BindMacro",
                visible : true,
                bind: {
                    macro : {
                        to: "dialogMacroName",
                        inside: data
                    }
                }
            }/}
        {/if}
    {/macro}
    {macro MacroBindMacro()}
        {if data.dialogEnabled.MacroBindMacro}
            {@aria:Dialog {
                id: "MacroBindMacro",
                visible : true,
                macro: "macro1",
                bind: {
                    macro : {
                        to: "dialogMacroName",
                        inside: data
                    }
                }
            }/}
        {/if}
    {/macro}

    /* BACKWARD-COMPATIBILITY-BEGIN GH-687 */
    {macro writeDeprecatedDialogs()}
        {call writeSectionWithDialog("ContentMacro") /}
        {call writeSectionWithDialog("BindContentMacro") /}
        {call writeSectionWithDialog("ContentMacroBindContentMacro") /}
    {/macro}

    {macro ContentMacro()}
        {if data.dialogEnabled.ContentMacro}
            {@aria:Dialog {
                id: "ContentMacro",
                visible : true,
                contentMacro: "macro1"
            }/}
        {/if}
    {/macro}

    {macro BindContentMacro()}
        {if data.dialogEnabled.BindContentMacro}
            {@aria:Dialog {
                id: "BindContentMacro",
                visible : true,
                bind: {
                    contentMacro : {
                        to: "dialogMacroName",
                        inside: data
                    }
                }
            }/}
        {/if}
    {/macro}

    {macro ContentMacroBindContentMacro()}
        {if data.dialogEnabled.ContentMacroBindContentMacro}
            {@aria:Dialog {
                id: "ContentMacroBindContentMacro",
                visible : true,
                contentMacro: "macro1",
                bind: {
                    contentMacro : {
                        to: "dialogMacroName",
                        inside: data
                    }
                }
            }/}
        {/if}
    {/macro}

    {macro mixedDialog1()}
        {if data.dialogEnabled.mixed1}
            {@aria:Dialog {
                visible : true,
                contentMacro: "macro1",
                bind: {
                    macro : {
                        to: "dialogMacroName",
                        inside: data
                    }
                }
            }/}
        {/if}
    {/macro}

    {macro mixedDialog2()}
        {if data.dialogEnabled.mixed2}
            {@aria:Dialog {
                visible : true,
                macro: "macro1",
                bind: {
                    contentMacro : {
                        to: "dialogMacroName",
                        inside: data
                    }
                }
            }/}
        {/if}
    {/macro}

    {macro mixedDialog3()}
        {if data.dialogEnabled.mixed3}
            {@aria:Dialog {
                visible : true,
                macro: "whatever",
                contentMacro: "whatever",
                bind: {
                    contentMacro : {
                        to: "dialogMacroName",
                        inside: data
                    }
                }
            }/}
        {/if}
    {/macro}

    {macro mixedDialog4()}
        {if data.dialogEnabled.mixed4}
            {@aria:Dialog {
                visible : true,
                contentMacro: "macro1",
                bind: {
                    contentMacro : {
                        to: "thisWillBeDiscarded", // macro now takes precedence
                        inside: data
                    },
                    macro : {
                        to: "dialogMacroName",
                        inside: data
                    }
                }
            }/}
        {/if}
    {/macro}

    {macro writeMixedDialogSection(n)}
        {section {
            macro: "mixedDialog"+n,
            bindRefreshTo : [{
                to: "mixed"+n,
                inside: data.dialogEnabled
            }]
        } /}
    {/macro}
    /* BACKWARD-COMPATIBILITY-END GH-687 */

    {macro macro1()}
        Macro1Content
    {/macro}

    {macro macro2()}
        Macro2Content
    {/macro}

{/Template}

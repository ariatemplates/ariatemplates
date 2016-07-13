/*
 * Copyright 2016 Amadeus s.a.s.
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

Aria.tplScriptDefinition({
    $classpath : 'test.aria.widgets.wai.popup.dialog.focusableItems.TplScript',

    $prototype : {
        openDialog : function (evt, dlg) {
            this.$json.setValue(dlg.bind.visible.inside, dlg.bind.visible.to, true);
        },

        defaultDialogCfg: function () {
            return {
                title: "Default dialog",
                macro: "dialogContent",
                width: 500,
                height: 500,
                modal: true,
                waiAria: true,
                bind: {
                    visible: {
                        inside: {
                            value: false
                        },
                        to: "value"
                    }
                }
            };
        },

        $dataReady: function () {
            var data = this.data;
            if (!data.dialogs) {
                data.dialogs = [];
                var dlg;

                dlg = this.defaultDialogCfg();
                data.dialogs.push(dlg);

                dlg = this.defaultDialogCfg();
                dlg.title = "Dialog with focusable title and focusable buttons";
                dlg.maximizable = true;
                dlg.closeLabel = "Close";
                dlg.maximizeLabel = "Maximize";
                data.dialogs.push(dlg);

                dlg = this.defaultDialogCfg();
                dlg.title = "Dialog with focusable title, focusable maximize and unfocusable close";
                dlg.focusableClose = false;
                dlg.maximizable = true;
                dlg.closeLabel = "Close";
                dlg.maximizeLabel = "Maximize";
                data.dialogs.push(dlg);

                dlg = this.defaultDialogCfg();
                dlg.title = "Dialog with focusable title and unfocusable buttons";
                dlg.focusableClose = false;
                dlg.focusableMaximize = false;
                dlg.maximizable = true;
                dlg.closeLabel = "Close";
                dlg.maximizeLabel = "Maximize";
                data.dialogs.push(dlg);

            }
        }
    }
});

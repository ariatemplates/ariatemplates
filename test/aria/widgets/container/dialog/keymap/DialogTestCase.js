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
    $classpath : "test.aria.widgets.container.dialog.keymap.DialogTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.FireDomEvent", "aria.utils.Json", "aria.core.Timer",
            "aria.templates.NavigationManager"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            dialogVisible : false
        };
        this._testEnvOne = {
            template : "test.aria.widgets.container.dialog.keymap.DialogTestCaseTpl",
            data : this.data
        };
        this.setTestEnv(this._testEnvOne);
    },
    $prototype : {
        runTemplateTest : function () {

            aria.templates.NavigationManager.addGlobalKeyMap({
                kay : "F4"
            });

            this.assertErrorInLogs(aria.templates.NavigationManager.INVALID_GLOBAL_KEYMAP_CFG);
            this.assertErrorInLogs(aria.core.JsonValidator.MISSING_MANDATORY, 2);
            this.assertErrorInLogs(aria.core.JsonValidator.UNDEFINED_PROPERTY);

            // add a non-modal keymap
            aria.templates.NavigationManager.addGlobalKeyMap({
                key : "F4",
                callback : {
                    fn : function () {
                        this.data.firstNonModalCallback = (!this.data.firstNonModalCallback)
                                ? 1
                                : this.data.firstNonModalCallback + 1;
                    },
                    scope : this
                }
            });

            aria.templates.NavigationManager.addGlobalKeyMap({
                key : "F3",
                modal : true,
                callback : {
                    fn : function () {
                        this.data.firstModalCallback = (!this.data.firstModalCallback)
                                ? 1
                                : this.data.firstModalCallback + 1;
                    },
                    scope : this
                }
            });

            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf1'), {
                keyCode : aria.DomEvent.KC_F4
            });
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf1'), {
                keyCode : aria.DomEvent.KC_F3
            });

            // check that both callbacks are called before the dialog is opened
            this.assertTrue(this.data.firstNonModalCallback == 1, "The callback of the non-modal keymap has not been called without a modal dialog");
            this.data.firstNonModalCallback = 1;
            this.assertTrue(this.data.firstModalCallback == 1, "The callback of the modal keymap has not been called without a modal dialog");
            this.data.firstModalCallback = 1;

            // now open the dialog
            aria.utils.Json.setValue(this.data, "dialogVisible", true);
            aria.core.Timer.addCallback({
                fn : this._afterDialogOpen,
                scope : this,
                delay : 50
            });

        },

        _afterDialogOpen : function () {
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf2'), {
                keyCode : aria.DomEvent.KC_F4
            });
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf2'), {
                keyCode : aria.DomEvent.KC_F3
            });
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf3'), {
                keyCode : 39
            });

            // check that only the callback of the modal keymap is called
            this.assertTrue(this.data.firstNonModalCallback == 1, "The callback of the non-modal keymap has been called with a modal dialog");
            this.data.firstNonModalCallback = 1;
            this.assertTrue(this.data.firstModalCallback == 2, "The callback of the modal keymap has not been called with a modal dialog");
            this.data.firstModalCallback = 2;

            // check that section callbacks are called anyhow
            this.assertTrue(this.data.sectionCallback == 1, "The section keymap has been ignored");
            this.data.sectionCallback = 1;

            // test that the escape works on dialog
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf2'), {
                keyCode : aria.DomEvent.KC_ESCAPE
            });

            aria.core.Timer.addCallback({
                fn : this._afterDialogClose,
                scope : this,
                delay : 50
            });

        },

        _afterDialogClose : function () {
            // test that the dialog has been closed
            this.assertTrue(this.data.dialogVisible === false, "The modal dialog has not been closed after pressing escape");

            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf1'), {
                keyCode : aria.DomEvent.KC_F4
            });
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf1'), {
                keyCode : aria.DomEvent.KC_F3
            });

            // check that both callbacks are called after the dialog is closed
            this.assertTrue(this.data.firstNonModalCallback == 2, "The callback of the non-modal keymap has not been called without a modal dialog");
            this.data.firstNonModalCallback = 2;
            this.assertTrue(this.data.firstModalCallback == 3, "The callback of the modal keymap has not been called without a modal dialog");
            this.data.firstModalCallback = 3;

            // open a dialog and add/remove modal/non-modal keymaps
            aria.utils.Json.setValue(this.data, "dialogVisible", true);
            aria.core.Timer.addCallback({
                fn : this._afterDialogSecondOpen,
                scope : this,
                delay : 50
            });
        },

        _afterDialogSecondOpen : function () {
            aria.templates.NavigationManager.addGlobalKeyMap({
                key : 38,
                callback : {
                    fn : function () {
                        this.data.secondNonModalCallback = (!this.data.secondNonModalCallback)
                                ? 1
                                : this.data.secondNonModalCallback + 1;
                    },
                    scope : this
                }
            });

            aria.templates.NavigationManager.addGlobalKeyMap({
                key : 40,
                modal : true,
                callback : {
                    fn : function () {
                        this.data.secondModalCallback = (!this.data.secondModalCallback)
                                ? 1
                                : this.data.secondModalCallback + 1;
                    },
                    scope : this
                }
            });

            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf2'), {
                keyCode : aria.DomEvent.KC_UP
            });
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf2'), {
                keyCode : aria.DomEvent.KC_DOWN
            });

            // check that the new callbacks added?removed when the dialog is open are taken into account
            this.assertFalse(this.data.secondNonModalCallback == 1, "The callback of the second non-modal keymap has been called with a modal dialog");
            this.data.secondNonModalCallback = 0;
            this.assertTrue(this.data.secondModalCallback == 1, "The callback of the second modal keymap has not been called with a modal dialog");
            this.data.secondModalCallback = 1;

            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf2'), {
                keyCode : aria.DomEvent.KC_F4
            });
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf2'), {
                keyCode : aria.DomEvent.KC_F3
            });

            // check that only the callback of the modal keymap is called
            this.assertTrue(this.data.firstNonModalCallback == 2, "The callback of the first non-modal keymap has been called with a modal dialog");
            this.data.firstNonModalCallback = 2;
            this.assertTrue(this.data.firstModalCallback == 4, "The callback of the first modal keymap has not been called with a modal dialog");
            this.data.firstModalCallback = 4;

            aria.templates.NavigationManager.removeGlobalKeyMap({
                key : "F3",
                modal : true
            });
            aria.templates.NavigationManager.removeGlobalKeyMap({
                key : "F4"
            });

            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf2'), {
                keyCode : aria.DomEvent.KC_F3
            });

            // check that the modal keymap has been removed
            this.assertTrue(this.data.firstModalCallback == 4, "The modal keymap for F3 has not been removed while the dialog was open");
            this.data.firstModalCallback = 4;

            // test that the escape works on dialog
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf2'), {
                keyCode : aria.DomEvent.KC_ESCAPE
            });

            aria.core.Timer.addCallback({
                fn : this._afterDialogSecondClose,
                scope : this,
                delay : 50
            });
        },

        _afterDialogSecondClose : function () {
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf1'), {
                keyCode : aria.DomEvent.KC_UP
            });
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf1'), {
                keyCode : aria.DomEvent.KC_DOWN
            });

            // check that the new callbacks added?removed when the dialog is open are taken into account
            this.assertTrue(this.data.secondNonModalCallback == 1, "The callback of the second non-modal keymap has not been called without a modal dialog");
            this.data.secondNonModalCallback = 1;
            this.assertTrue(this.data.secondModalCallback == 2, "The callback of the second modal keymap has not been called without a modal dialog");
            this.data.secondModalCallback = 2;

            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf1'), {
                keyCode : aria.DomEvent.KC_F4
            });
            aria.utils.FireDomEvent.fireEvent('keydown', this.getInputField('tf1'), {
                keyCode : aria.DomEvent.KC_F3
            });

            // check that the non-modal keymap has been removed
            this.assertTrue(this.data.firstNonModalCallback == 2, "The first non-modal keymap associated to F4 has nott been removed");
            this.data.firstNonModalCallback = 2;

            this.end();
        }

    }
});

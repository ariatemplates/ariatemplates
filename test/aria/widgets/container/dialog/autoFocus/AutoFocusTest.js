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

Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.autoFocus.AutoFocusTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json", "aria.core.Timer"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            dialogVisible : false,
            modal : true,
            autoFocus : null
        };
        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        waitForMyDialog : function (visible, cb) {
            this.waitFor({
                condition: function () {
                    var dialogInstance = this.getWidgetInstance("myDialog");
                    var dialogOpen = !! (dialogInstance._popup && dialogInstance._popup.isOpen);
                    return dialogOpen === visible;
                },
                callback: cb
            });
        },

        assertFocusInDialog : function () {
            var fieldInDialog = this.getElementById("fieldInDialog");
            this.assertTrue(Aria.$window.document.activeElement === fieldInDialog, "The focus should be in the dialog.");
        },

        assertFocusOutsideDialog : function () {
            var fieldOutsideDialog = this.getElementById("fieldOutsideDialog");
            this.assertTrue(Aria.$window.document.activeElement === fieldOutsideDialog, "The focus should be outside the dialog.");
        },

        assertNothingFocused : function () {
            var document = Aria.$window.document;
            var activeElement = document.activeElement;
            this.assertTrue(activeElement == null || activeElement === document.body, "There should be no element focused.");
        },

        setPropertiesAndReopenDialog : function (modal, autoFocus, cb) {
            aria.utils.Json.setValue(this.data, "dialogVisible", false);
            aria.utils.Json.setValue(this.data, "modal", modal);
            aria.utils.Json.setValue(this.data, "autoFocus", autoFocus);
            this.templateCtxt.$refresh();
            this.waitForMyDialog(false, function () {
                aria.core.Timer.addCallback({
                    fn: function () {
                        var fieldOutsideDialog = this.getElementById("fieldOutsideDialog");
                        fieldOutsideDialog.focus();
                        this.waitForDomEltFocus(fieldOutsideDialog, function () {
                            this.openDialog(cb);
                        });
                    },
                    scope: this,
                    delay: 20
                });
            });
        },

        openDialog : function (cb) {
            aria.utils.Json.setValue(this.data, "dialogVisible", true);
            this.waitForMyDialog(true, cb);
        },

        runTemplateTest : function () {
            var self = this;

            function step0() {
                self.assertFocusInDialog();
                self.setPropertiesAndReopenDialog(true, false, step1);
            }

            function step1() {
                self.assertNothingFocused();
                self.setPropertiesAndReopenDialog(true, true, step2);
            }

            function step2() {
                self.assertFocusInDialog();
                self.setPropertiesAndReopenDialog(false, null, step3);
            }

            function step3() {
                self.assertFocusOutsideDialog();
                self.setPropertiesAndReopenDialog(false, false, step4);
            }

            function step4() {
                self.assertFocusOutsideDialog();
                self.setPropertiesAndReopenDialog(false, true, step5);
            }

            function step5() {
                self.assertFocusInDialog();
                self.end();
            }

            self.openDialog(step0);
        }
    }
});

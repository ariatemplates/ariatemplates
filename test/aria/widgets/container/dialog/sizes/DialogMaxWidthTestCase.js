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
 * Test for issue #10
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.sizes.DialogMaxWidthTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.$json = aria.utils.Json;

        this.data = {
            dialog5 : {
                title: "Short",
                width: 150
            },
            dialog6 : {
                title: "Short",
                width: 150
            }
        };

        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.sizes.DialogMaxWidthTestCaseTpl",
            data : this.data
        });
    },
    $prototype : {

        checkSizes : function(dialogId, mainWidth, tolerance) {
            var dialog = this.dialogs[dialogId];

            var dom = dialog._domElt;
            var children = dom.children;
            var dlgBody = children[0];
            var dlgTitle = children[1];
            var dlgTitleText = aria.utils.Dom.getElementsByClassName(dlgTitle, "sDialog_title");
            var dlgCloseIcon = aria.utils.Dom.getElementsByClassName(dlgTitle, "sDialog_close");

            this.assertEqualsWithTolerance(dlgBody.offsetWidth, mainWidth, tolerance ? tolerance : 2, dialogId + " width should be %2 instead of %1");
            this.assertEqualsWithTolerance(dlgTitle.offsetWidth, dlgBody.offsetWidth - 10, 1, dialogId + " title width should be %2 instead of %1");
            this.assertEquals(dlgTitleText.offsetTop, dlgCloseIcon.offsetTop, "The close icon should be on teh first line");
        },


        runTemplateTest : function () {
            // The main template is Ready even if it contains a template inside the Dialog, wait
            var dialogIds = ["dialog1", "dialog2", "dialog3", "dialog4", "dialog5", "dialog6"];
            this.waitFor({
                condition : function() {
                    // Wait for every dialog ready and open
                    var dialogs = this.dialogs = {};
                    for (var i = 0; i < dialogIds.length; i += 1) {
                        var id = dialogIds[i];
                        var currentInstance = dialogs[id] = this.getWidgetInstance(id);
                        if (!currentInstance || !currentInstance._popup.isOpen) {
                            return false;
                        }
                    }
                    return true;
                },
                callback : {
                    fn : this.checkWidths,
                    scope : this
                }
            });
        },

        checkWidths : function () {
            this.checkSizes("dialog1", 400);
            this.checkSizes("dialog2", 400);
            this.checkSizes("dialog3", 238, 20);
            this.checkSizes("dialog4", 400);

            this.changeDialog5ContainerSize();
        },

        changeDialog5ContainerSize : function () {

            var dataDialog = this.data.dialog5;
            this.checkSizes("dialog5", 200);
            this.$json.setValue(dataDialog, "title", "This is now a very long title");
            this.checkSizes("dialog5", 251, 20);

            this.$json.setValue(dataDialog, "title", "This is now a very very very very very very very long title");
            this.checkSizes("dialog5", 400);

            this.$json.setValue(dataDialog, "title", "Short again");
            this.checkSizes("dialog5", 200);

            this.$json.setValue(dataDialog, "width", 500);
            this.checkSizes("dialog5", 400);

            this.changeDialog6ContainerSize();
        },

        changeDialog6ContainerSize : function () {

            var dataDialog = this.data.dialog6;
            this.checkSizes("dialog6", 200);

            this.$json.setValue(dataDialog, "title", "This is now a very long title");
            this.checkSizes("dialog6", 273, 20);

            this.$json.setValue(dataDialog, "title", "This is now a very very very very very very very long title");
            this.checkSizes("dialog6", 400);

            this.$json.setValue(dataDialog, "title", "Short again");
            this.checkSizes("dialog6", 200);

            this.$json.setValue(dataDialog, "width", 500);
            this.checkSizes("dialog6", 400);

            this.end();
        }
    }
});

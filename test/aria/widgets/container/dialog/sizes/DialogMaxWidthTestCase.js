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

        checkSizes : function(dialogId, maxWidth) {
            maxWidth = maxWidth || 400;
            var dialog = this.dialogs[dialogId];

            var dialogBody = dialog._div.getDom();
            var dialogTitle = dialog._titleBarDomElt;
            var dialogTitleText = aria.utils.Dom.getElementsByClassName(dialogTitle, "xDialog_title")[0];
            var dialogCloseIcon = aria.utils.Dom.getElementsByClassName(dialogTitle, "xDialog_close")[0];

            this.assertNotNull(dialogTitleText, dialogId + " title text not found");
            this.assertNotNull(dialogCloseIcon, dialogId + " close icon not found");

            this.assertTrue(dialogBody.offsetWidth <= maxWidth, dialogId + " body width should be less than " + maxWidth);
            var innerWidth =  maxWidth - parseInt(aria.utils.Dom.getStyle(dialogTitle, "right"), 10);
            this.assertTrue(dialogTitle.offsetWidth <= innerWidth, dialogId + " title width should be less than " + innerWidth);
            this.assertEquals(dialogTitleText.offsetTop, dialogCloseIcon.offsetTop, dialogId + " : the close icon should be on the first line");
            this.assertTrue(dialogTitleText.offsetWidth < dialogTitle.offsetWidth - dialogCloseIcon.offsetWidth, dialogId + " : the title text width is too large");

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
            this.checkSizes("dialog1");
            this.checkSizes("dialog2");
            this.checkSizes("dialog3");
            this.checkSizes("dialog4");

            this.changeDialog5ContainerSize();
        },

        changeDialog5ContainerSize : function () {

            var dataDialog = this.data.dialog5;
            this.checkSizes("dialog5");
            this.$json.setValue(dataDialog, "title", "This is now a very long title");
            this.checkSizes("dialog5");

            this.$json.setValue(dataDialog, "title", "This is now a very very very very very very very long title");
            this.checkSizes("dialog5");

            this.$json.setValue(dataDialog, "title", "Short again");
            this.checkSizes("dialog5");

            this.$json.setValue(dataDialog, "width", 500);
            this.checkSizes("dialog5");

            this.changeDialog6ContainerSize();
        },

        changeDialog6ContainerSize : function () {

            var dataDialog = this.data.dialog6;
            this.checkSizes("dialog6");

            this.$json.setValue(dataDialog, "title", "This is now a very long title");
            this.checkSizes("dialog6");

            this.$json.setValue(dataDialog, "title", "This is now a very very very very very very very long title");
            this.checkSizes("dialog6");

            this.$json.setValue(dataDialog, "title", "Short again");
            this.checkSizes("dialog6");

            this.$json.setValue(dataDialog, "width", 500);
            this.checkSizes("dialog6");

            this.end();
        }
    }
});

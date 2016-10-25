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
    $classpath : "test.aria.widgets.container.dialog.hiddenViewportResize.HiddenDialogViewportResizeTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {};
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.hiddenViewportResize.HiddenDialogViewportResizeTestCaseTpl",
            iframe: true,
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.json = this.templateCtxt._tpl.$json;
            this.json.setValue(this.data, "dialogVisible", true);
            this.waitFor({
                condition: function () {
                    if (!this.myItem) {
                        this.myItem = this.getElementById("myItem");
                    }
                    if (this.myItem && !this.myPopup) {
                        this.myPopup = this.testWindow.aria.popups.PopupManager.findParentPopup(this.myItem);
                    }
                    if (this.myPopup) {
                        this.myPopupGeometry = this.testWindow.aria.utils.Dom.getGeometry(this.myPopup.domElement);
                    }
                    return !!this.myPopupGeometry;
                },
                callback: this._step1
            });
        },

        _step1: function () {
            this.myPopup.domElement.style.display = "none";
            this.myPopup.isOpen = false;
            this.currentWidth = this.testWindow.aria.templates.Layout.viewportSize.width;
            this.testIframe.style.width = (this.testIframe.offsetWidth - 50) + "px";
            this.waitFor({
                condition: function () {
                    return this.testWindow.aria.templates.Layout.viewportSize.width !== this.currentWidth;
                },
                callback: this._step2
            });
        },

        _step2: function () {
            this.myPopup.domElement.style.display = "block";
            this.myPopup.isOpen = true;
            var newGeometry = this.testWindow.aria.utils.Dom.getGeometry(this.myPopup.domElement);
            this.assertEquals(newGeometry.width, this.myPopupGeometry.width);
            this.assertEquals(newGeometry.height, this.myPopupGeometry.height);
            this.end();
        }
    }
});

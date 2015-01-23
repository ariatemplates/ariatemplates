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

Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.closeOrDrag.CloseOrDragTest",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.dragdrop.Drag", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.data = {
            dialogVisible : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.closeOrDrag.CloseOrDragTpl",
            data : this.data
        });
    },
    $prototype : {
        _getCloseIcon : function () {
            var titleBar = this.getWidgetInstance("myDialog")._titleBarDomElt;
            if (!titleBar) {
                return null;
            }
            return this.getElementsByClassName(titleBar, "xDialog_close")[0] || null;
        },

        runTemplateTest : function () {
            var self = this;
            var step0 = function () {
                var closeButton = self._getCloseIcon();
                self.initialGeometry = aria.utils.Dom.getGeometry(closeButton);
                self.assertNotNull(self.initialGeometry);
                var destination = self.getElementById("myItem");
                self.synEvent.drag({
                    duration : 500,
                    to : destination
                }, closeButton, step1);
            };

            var step1 = function () {
                var closeButton = self._getCloseIcon();
                self.finalGeometry = aria.utils.Dom.getGeometry(closeButton);
                self.assertNotNull(self.finalGeometry);
                self.assertJsonEquals(self.initialGeometry, self.finalGeometry);
                self.synEvent.click(closeButton, step2);
            };

            var step2 = function () {
                self.assertNull(self._getCloseIcon());
                self.assertFalse(self.data.dialogVisible);
                self.end();
            };

            setTimeout(step0, 200);
        }
    }
});

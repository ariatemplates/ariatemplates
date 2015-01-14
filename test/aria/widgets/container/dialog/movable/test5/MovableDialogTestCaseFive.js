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
    $classpath : "test.aria.widgets.container.dialog.movable.test5.MovableDialogTestCaseFive",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = {};

        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.movable.test5.MovableDialogTemplateFive",
            css : "position:relative;top:400px;border:15px solid blue;",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            Aria.$window.scrollBy(0,150);
            aria.core.Timer.addCallback({
                fn : this._firstDrag,
                scope : this,
                delay : 1000
            });
        },

        _firstDrag : function () {
            var dom = aria.utils.Dom;
            this.assertEquals(dom.getDocumentScrollElement().scrollTop, 150, "The page should have %2 px of scroll, but it has %1 px instead");

            var handleGeometry = dom.getGeometry(this._getHandle("firstDialog"));
            // We are dragging up, make sure we have enough space at the top
            this.assertTrue(handleGeometry.y > 100, "Dialog y is " + handleGeometry.y + ", it must be >100 as a prerequisite");

            this.dialogPos = {
                x : handleGeometry.x,
                y : handleGeometry.y
            };

            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : 2000,
                to : {
                    x : from.x,
                    y : from.y - 100
                }
            };

            this.synEvent.execute([["drag", options, from]], {
                fn : this._afterFirstDrag,
                scope : this
            });
        },

        _afterFirstDrag : function () {
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));

            this.assertEquals(this.dialogPos.x, handleGeometry.x, "The dialog xpos position is not correctly set, expected %1, actual %2.");
            this.assertEquals(this.dialogPos.y - 100, handleGeometry.y, "The dialog ypos position is not correctly set, expected %1, actual %2.");

            this.end();
        },

        _getHandle : function (dialogId) {
            return this.getWidgetInstance(dialogId)._titleBarDomElt;
        }
    }
});

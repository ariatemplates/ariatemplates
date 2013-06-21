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
 * Test movable dialog without overlays
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.movable.test1.MovableDialogTestCase",
    $extends : "test.aria.widgets.container.dialog.MovableDialogBaseTestCase",
    $constructor : function () {
        this.$MovableDialogBaseTestCase.constructor.call(this);

        this.data = {
            firstDialog : {
                visible : true,
                center : false
            },
            processing : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.movable.test1.MovableDialogTemplate",
            data : this.data
        });

    },
    $prototype : {

        startDialogTest : function () {
            this.waitFor({
                condition : function () {
                    return this.getWidgetInstance("firstDialog") != null;
                },
                callback : {
                    fn : this._afterFirstDialogShow,
                    scope : this
                }
            });
        },

        /**
         */
        _afterFirstDialogShow : function () {
            var dom = aria.utils.Dom;
            this.testPosArgs = {
                dataHolder : this.data.firstDialog,
                sectionOverlay : "dialogContent_one",
                dialog : this.getWidgetInstance("firstDialog").getDom(),
                tolerance : 3
            };

            var handleGeometry = dom.getGeometry(this._getHandle("firstDialog"));
            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : 3000,
                to : {
                    x : from.x + 150,
                    y : from.y + 150
                }
            };

            this.synEvent.execute([["drag", options, from]], {
                fn : this._afterFirstDrag,
                scope : this
            });

        },
        _afterFirstDrag : function () {
            this.assertTrue(this.data.firstDialog.dragStart == 1);
            this.assertTrue(this.data.firstDialog.dragEnd == 1);
            this.testPosArgs.testValues = {
                top : 250,
                left : 200
            };
            this._testPositioning();
            this.assertTrue(this.data.firstDialog.center === false);
            this.synEvent.click(this._getCloseIcon("firstDialog"), {
                fn : this._afterClose,
                scope : this
            });
        },
        _afterClose : function () {
            var dom = aria.utils.Dom;
            this.assertTrue(this.data.firstDialog.dragStart == 1);
            this.assertTrue(this.data.firstDialog.dragEnd == 1);
            this.assertTrue(this.data.firstDialog.visible === false);

            aria.utils.Json.setValue(this.data.firstDialog, "visible", true);

            var handleGeometry = dom.getGeometry(this._getHandle("firstDialog"));
            var positions = dom.fitInside({
                x : 2500,
                y : 2500,
                width : 500,
                height : 500
            }, dom.VIEWPORT);
            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : 3000,
                to : {
                    x : positions.left + 250,
                    y : positions.top + 250
                }
            };

            this.synEvent.execute([["drag", options, from]], {
                fn : this._afterSecondDrag,
                scope : this
            });

        },
        _afterSecondDrag : function () {
            var dom = aria.utils.Dom;
            this.assertTrue(this.data.firstDialog.dragStart == 2);
            this.assertTrue(this.data.firstDialog.dragEnd == 2);
            this.assertTrue(this.data.firstDialog.center === false);
            this.assertTrue(dom.isInside(dom.getGeometry(this.getWidgetInstance("firstDialog").getDom()), dom.VIEWPORT));

            this.end();
        },

        _getHandle : function (dialogId) {
            return this.getWidgetInstance(dialogId)._titleBarDomElt;
        },

        _getCloseIcon : function (dialogId) {
            var elements = this.getWidgetInstance(dialogId)._titleBarDomElt.children;
            return (elements.length > 1) ? elements[1] : null;
        }

    }
});

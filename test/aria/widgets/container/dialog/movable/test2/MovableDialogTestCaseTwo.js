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
    $classpath : "test.aria.widgets.container.dialog.movable.test2.MovableDialogTestCaseTwo",
    $extends : "test.aria.widgets.container.dialog.MovableDialogBaseTestCase",
    $constructor : function () {
        this.$MovableDialogBaseTestCase.constructor.call(this);

        this.data = {
            firstDialog : {
                visible : true,
                center : true
            },
            secondDialog : {
                visible : false,
                center : true
            },
            refresh : 0
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.movable.test2.MovableDialogTemplateTwo",
            data : this.data
        });
        this._position = {};

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
                dialog : this.getWidgetInstance("firstDialog").getDom(),
                tolerance : 3,
                testValues : {
                    width : 300,
                    height : 300
                }
            };
            this._testPositioning();
            this._position = dom.getGeometry(this.getWidgetInstance("firstDialog").getDom());

            var handleGeometry = dom.getGeometry(this._getHandle("firstDialog"));
            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : 3000,
                to : {
                    x : from.x + 30,
                    y : from.y + 30
                }
            };

            this.synEvent.execute([["drag", options, from]], {
                fn : this._afterFirstDrag,
                scope : this
            });

        },
        _afterFirstDrag : function () {
            this.testPosArgs.testValues = {
                top : this._position.y + 30,
                left : this._position.x + 30
            };
            this.testPosArgs.dialog = this.getWidgetInstance("firstDialog").getDom();
            this._testPositioning();
            aria.utils.Json.setValue(this.data, "refresh", 1);
            // test that the position is kept after refreshing the content of the dialog
            this._testPositioning();

            var jsonUtil = aria.utils.Json;
            var dom = aria.utils.Dom;

            jsonUtil.setValue(this.data.firstDialog, "visible", false);
            jsonUtil.setValue(this.data.secondDialog, "visible", true);

            this._position = dom.getGeometry(this.getWidgetInstance("secondDialog").getDom());

            var handleGeometry = dom.getGeometry(this._getHandle("secondDialog"));
            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : 3000,
                to : {
                    x : from.x + 30,
                    y : from.y + 30
                }
            };

            this.synEvent.execute([["drag", options, from]], {
                fn : this._afterSecondDrag,
                scope : this
            });

        },
        _afterSecondDrag : function () {
            this.testPosArgs.testValues = {
                top : this._position.y + 30,
                left : this._position.x + 30
            };
            this.testPosArgs.dialog = this.getWidgetInstance("secondDialog").getDom();
            this._testPositioning();
            this.templateCtxt.$refresh();
            this.testPosArgs.dialog = this.getWidgetInstance("secondDialog").getDom();
            // test that the position is kept after refreshing the template containing the dialog id center, xpos and
            // ypos are bound to the data model
            this._testPositioning();
            this.end();
        },

        _getHandle : function (dialogId) {
            return this.getWidgetInstance(dialogId)._titleBarDomElt;
        }

    }
});

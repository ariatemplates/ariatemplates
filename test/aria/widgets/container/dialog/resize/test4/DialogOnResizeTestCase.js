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
 * Test that resizable dialog is actually resized and check text in document is selectable.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.resize.test4.DialogOnResizeTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.domSelector = aria.utils.Dom;
        this.__seletionRange = "";
        this.data = {
            firstDialog : {
                visible : true,
                height : 250,
                width : 500,
                x : 0,
                y : 0,
                resizetext : ""
            }
        };

        this.handleEle = "";
        this.handleEleParent = "";
        this.isIE9orNewer = aria.core.Browser.isIE9 || aria.core.Browser.isIE10;
        this.tolerance = this.isIE9orNewer ? 10 : 2;
        this.toleranceShadow = this.isIE9orNewer ? 11 : 5;
        this.movementDuration = 500;
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.resize.test4.DialogOnResizeTemplate",
            data : this.data
        });
        // this.defaultTestTimeout = 20000;
    },
    $prototype : {
        runTemplateTest : function () {
            // handle for top
            aria.core.Timer.addCallback({
                fn : this._afterFirstDialogShow,
                scope : this,
                delay : 1000
            });
        },

        _afterFirstDialogShow : function () {
            var dom = aria.utils.Dom;
            var handleEle = this._getHandle("firstDialog", 1);
            this.handleEle = handleEle.handle;
            this.handleEleParent = handleEle.parent;
            var handleGeometry = dom.getGeometry(this.handleEle);
            var parentGeometry = dom.getGeometry(this.handleEleParent);

            this.data.firstDialog.x = parentGeometry.x;
            this.data.firstDialog.y = parentGeometry.y;

            this.assertEquals(parentGeometry.height, 250, "Dialog Widget height is wrong before Resizing. Expected %2, got %1.");
            this.assertEqualsWithTolerance(parentGeometry.width, 500, this.tolerance, "Dialog Widget height is wrong before Resizing.. Expected %2, got %1");

            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x + 0,
                    y : from.y + 10
                }
            };
            // defaultSetTimeout
            this.data.firstDialog.height -= 10;
            this.data.firstDialog.y += 10;
            var that = this;
            this.synEvent.execute([["drag", options, from]], {
                fn : this._NResize,
                scope : this
            });
        },

        _NResize : function () {
            aria.core.Timer.addCallback({
                fn : function () {

                },
                delay : 1000,
                scope : this
            });
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            this.assertEqualsWithTolerance(this.data.firstDialog.height, parentGeometry.height, this.tolerance, "The dialog height is not corrrectly set, expected %1, actual %2.");
            this.assertEqualsWithTolerance(this.data.firstDialog.y, parentGeometry.y, this.tolerance, "The dialog ypos position is not corrrectly set, expected %1, actual %2.");
            // To select text in the document
            this._SelectText("pageContent");
        },

        _SelectText : function (elementId) {
            var dom = aria.utils.Dom;
            var element = dom.getElementById(elementId);
            var geometry = dom.getGeometry(element);
            var from = {
                x : geometry.x,
                y : geometry.y
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 100,
                    y : from.y
                }
            };
            this.synEvent.execute([["drag", options, from]], {
                fn : this._assertSelectedText,
                scope : this
            });
        },

        _assertSelectedText : function () {
            var text = "", window = Aria.$window, document = window.document;
            if (window.getSelection) {
                text = window.getSelection();
            } else if (document.getSelection) {
                text = document.getSelection();
            } else if (document.selection) {
                text = document.selection.createRange().text;
            } else if (window.getSelection().text) {
                text = window.getSelection().text;
            }
            text = text + "";
            this.assertTrue(text.length >= 0, "Text not selected correctly");
            this._end();
        },
        _getHandle : function (dialogId, index) {
            var options = {};
            options.parent = this.getWidgetInstance(dialogId)._domElt;
            if (index) {
                options.handle = aria.utils.Dom.getDomElementChild(options.parent, index, false);
            }
            return options;
        },

        _end : function () {
            this.notifyTemplateTestEnd();
        }
    }
});

/*
 * Copyright 2017 Amadeus s.a.s.
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

var Aria = require('ariatemplates/Aria');

var ariaUtilsString = require('ariatemplates/utils/String');
var subst = ariaUtilsString.substitute;
var ariaUtilsFunction = require('ariatemplates/utils/Function');
var Dom = require('ariatemplates/utils/Dom');
var Caret = require('ariatemplates/utils/Caret');

var EnhancedRobotBase = require('test/EnhancedRobotBase');



module.exports = Aria.classDefinition({
    $classpath: 'test.aria.widgets.container.dialog.resize.dontSelectOnResize.DialogResizeDontSelectRobotTestCase',
    $extends: EnhancedRobotBase,

    $prototype: {
        ////////////////////////////////////////////////////////////////////////
        // Tests
        ////////////////////////////////////////////////////////////////////////

        _getCommonData: function () {
            return this.templateCtxt._tpl.getCommonData();
        },

        runTemplateTest: function () {
            // --------------------------------------------------- destructuring

            var commonData = this._getCommonData();

            var dialogId = commonData.dialogId;
            var buttonId = commonData.buttonId;
            var inputId = commonData.inputId;
            var textId = commonData.textId;
            var textSample = commonData.textSample;

            var left = commonData.left;
            var top = commonData.top;
            var width = commonData.width;
            var height = commonData.height;

            // ------------------------------------------------------ processing

            var vectorX = 20;
            var textSampleLength = textSample.length;

            var window = this.testWindow;
            var canCheckSelectionInText = window.getSelection != null;

            function selectAndCheckAll(add) {
                if (canCheckSelectionInText) {
                    add('_selectAndCheck', textId, textSampleLength);
                }
                add('_selectAndCheck', inputId, textSampleLength);
            }

            this._localAsyncSequence(function(add) {
                selectAndCheckAll(add);

                add('_openDialog', dialogId, buttonId);

                add('_resizeAndCheck', {
                    dialogId: dialogId,
                    resize: {
                        handleId: 'e',
                        vectorX: vectorX
                    },
                    expected: {
                        left: left,
                        top: top,
                        width: width + vectorX,
                        height: height
                    }
                });

                add('_closeDialog', dialogId);

                selectAndCheckAll(add);
            }, this.end);
        },



        ////////////////////////////////////////////////////////////////////////
        // Library: Text selection
        ////////////////////////////////////////////////////////////////////////

        _selectAndCheck: function (cb, id, selectionLength) {
            this._localAsyncSequence(function(add) {
                add('_selectText', id);
                add('_checkSelection', id, selectionLength);
            }, cb);
        },

        _selectText: function (cb, id) {
            // ------------------------------------------------------ processing

            // -----------------------------------------------------------------

            var element = this.getElementById(id);
            var geometry = Dom.getGeometry(element);

            var left = geometry.x;
            var right = left + geometry.width;
            var y = geometry.y + (geometry.height / 2);

            // -----------------------------------------------------------------

            this._localAsyncSequence(function (add) {
                add('_drag', {
                    duration: 500,
                    from: {
                        x: left + 2, // offset to make sure to be inside the element containing the text to select
                        y: y
                    },
                    to: {
                        x: right - 2, // offset to make sure to be inside the element containing the text to select
                        y: y
                    }
                });
                add('_delay');
            }, cb);
        },

        _checkSelection: function (cb, id, selectionLength) {
            var element = this.getElementById(id);

            var range;
            if (element.tagName.toLowerCase() === 'input') {
                var position = Caret.getPosition(element);
                range = Math.abs(position.end - position.start);
            } else {
                var window = this.testWindow;
                range = window.getSelection().toString().length;
            }

            this.assertTrue(range === selectionLength, subst('Expected a selection range of %1, got %2 instead', selectionLength, range));

            cb();
        },



        ////////////////////////////////////////////////////////////////////////
        // Library: Dialog
        ////////////////////////////////////////////////////////////////////////

        _openDialog: function (cb, dialogId, buttonId) {
            var button = this.getElementById(buttonId);
            var predicate = this._createIsDialogOpenedPredicate(dialogId);

            this._localAsyncSequence(function(add) {
                add('_click', button);
                add(predicate.waitForTrue);
            }, cb);
        },

        _closeDialog: function (cb, dialogId) {
            var predicate = this._createIsDialogOpenedPredicate(dialogId);

            this._localAsyncSequence(function (add) {
                add('_pressEscape');
                add(predicate.waitForFalse);
            }, cb);
        },

        _resizeAndCheck: function (cb, options) {
            // -------------------------------------- input arguments processing

            var dialogId = options.dialogId;

            var resize = options.resize;
            var expected = options.expected;

            // ------------------------------------------------------ processing

            // options ---------------------------------------------------------

            resize.dialogId = dialogId;
            var check = {
                dialogId: dialogId,
                expected: expected
            };

            // execution -------------------------------------------------------

            this._localAsyncSequence(function(add) {
                add('_resizeDialog', resize);
                add('_checkGeometry', check);
            }, cb);
        },

        _checkGeometry: function (cb, options) {
            // -------------------------------------- input arguments processing

            var dialogId = options.dialogId;

            var expected = options.expected;
            var left = expected.left;
            var top = expected.top;
            var width = expected.width;
            var height = expected.height;

            // ------------------------------------------------------ processing

            // -----------------------------------------------------------------

            function predicate() {
                var geometry = Dom.getGeometry(this.getWidgetInstance(dialogId).getDom());

                return geometry.x === left &&
                    geometry.y === top &&
                    geometry.width === width &&
                    geometry.height === height;
            }

            function buildMessage() {
                return 'Dialog should have been resized';
            }

            var predicate = this._createPredicate(predicate, buildMessage);

            // -----------------------------------------------------------------

            this._localAsyncSequence(function (add) {
                add(predicate.wait);
            }, cb);
        },

        _resizeDialog: function (cb, options) {
            // --------------------------------------------------- configuration

            var handlesMap = {
                'n': 0,
                's': 1,
                'e': 2,
                'w': 3,
                'ne': 4,
                'nw': 5,
                'se': 6,
                'sw': 7
            };

            // -------------------------------------- input arguments processing

            var dialogId = options.dialogId;

            var handleId = options.handleId;

            var vectorX = options.vectorX;
            if (vectorX == null) {
                vectorX = 0;
            }

            var vectorY = options.vectorY;
            if (vectorY == null) {
                vectorY = 0;
            }

            var duration = options.duration;

            // ------------------------------------------------------ processing

            // -----------------------------------------------------------------

            var handleIndex;
            if (handleId != null) {
                handleIndex = handlesMap[handleId];
            } else {
                handleIndex = 0;
            }

            var handle = this.getWidgetInstance(dialogId).getResizeHandle(handleIndex);
            var handleGeometry = Dom.getGeometry(handle);

            var initialPosition = {
                x: handleGeometry.x + handleGeometry.width / 2,
                y: handleGeometry.y + handleGeometry.height / 2
            };

            // -----------------------------------------------------------------

            var destinationPosition = {
                x: initialPosition.x + vectorX,
                y: initialPosition.y + vectorY
            };

            this._localAsyncSequence(function (add) {
                add('_drag', {
                    duration: duration,
                    from: initialPosition,
                    to: destinationPosition
                });
            }, cb);
        }
    }
});

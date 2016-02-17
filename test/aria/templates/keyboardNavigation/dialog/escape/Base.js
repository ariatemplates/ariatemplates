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

var Aria = require('ariatemplates/Aria');

var ariaResourcesHandlersLCResourcesHandler = require('ariatemplates/resources/handlers/LCResourcesHandler');
var ariaResourcesHandlersLCRangeResourceHandler = require('ariatemplates/resources/handlers/LCRangeResourceHandler');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.templates.keyboardNavigation.dialog.escape.Base',
    $extends : require('test/EnhancedRobotTestCase'),

    $constructor : function () {
        // ------------------------------------------------------ initialization

        this.$EnhancedRobotTestCase.constructor.call(this);

        // ---------------------------------------------------------- processing

        var disposableObjects = this._disposableObjects;

        function createResourcesHandler(cls) {
            var handler = new cls();
            var suggestions = [
                {label: 'zero', code: '0'},
                {label: 'one', code: '1'}
            ];

            handler.setSuggestions(suggestions);
            disposableObjects.push(handler);

            return handler;
        }

        function createSelectOptions() {
            return [
                {value: '0', label: '0'},
                {value: '1', label: '1'}
            ];
        }

        var data = {
            dialogId: 'dialog',
            openDialogButtonId: 'openDialog',

            widgetsIds: [
                'autoComplete',
                'datePicker',
                'multiAutoComplete',
                'multiSelect',
                'select',
                'selectBox'
            ],

            widgetsConfigurations: {
                autoComplete: {
                    id: 'autoComplete',
                    label: 'AutoComplete: ',
                    expandButton: true,
                    resourcesHandler: createResourcesHandler(ariaResourcesHandlersLCResourcesHandler)
                },

                datePicker: {
                    id: 'datePicker',
                    label: 'DatePicker: '
                },

                multiAutoComplete: {
                    id: 'multiAutoComplete',
                    label: 'MultiAutoComplete: ',
                    expandButton: true,
                    resourcesHandler: createResourcesHandler(ariaResourcesHandlersLCRangeResourceHandler)
                },

                multiSelect: {
                    id: 'multiSelect',
                    label: 'MultiSelect: ',

                    fieldDisplay: 'label',
                    fieldSeparator: '/',
                    displayOptions: {},

                    items: createSelectOptions()
                },

                select: {
                    id: 'select',
                    label: 'Select: ',
                    options: createSelectOptions()
                },

                selectBox: {
                    id: 'selectBox',
                    label: 'SelectBox: ',
                    options: createSelectOptions()
                }
            }
        };

        this.setTestEnv({
            data: data,
            template: 'test.aria.templates.keyboardNavigation.dialog.escape.Tpl'
        });
    },

    $prototype : {
        ////////////////////////////////////////////////////////////////////////
        // Tests
        ////////////////////////////////////////////////////////////////////////

        runTemplateTest : function () {
            // --------------------------------------------------- destructuring

            var idOfWidgetToTest = this.idOfWidgetToTest;
            var widgetsIds = this._getData().widgetsIds;

            // ------------------------------------------------------ processing

            var ids;
            if (idOfWidgetToTest != null) {
                ids = [idOfWidgetToTest];
            } else {
                ids = widgetsIds;
            }

            this._asyncIterate(ids, this._testWidget, this.end);
        },

        _testWidget : function (callback, id) {
            var dialogId = this._getData().dialogId;

            var isOpened = this._createIsDialogOpenedPredicate(dialogId);

            this._localAsyncSequence(function (add) {
                add('_openDialog');
                add('_openDropdown', id);

                add('_pressEscape');
                add('_delay'); // both in order to wait for the widget's dropdown to close but also to check that in the end it doesn't trigger the closing of the dialog
                add(isOpened.waitForTrue);

                add('_pressEscape');
                add(isOpened.waitForFalse);
            }, callback);
        },



        ////////////////////////////////////////////////////////////////////////
        // Local library: dialog
        ////////////////////////////////////////////////////////////////////////

        _openDialog : function (callback) {
            // --------------------------------------------------- destructuring

            var data = this._getData();

            var dialogId = data.dialogId;
            var openDialogButtonId = data.openDialogButtonId;

            // ------------------------------------------------------ processing

            var isOpened = this._createIsDialogOpenedPredicate(dialogId);

            this._localAsyncSequence(function (add) {
                add('_focusWidget', openDialogButtonId);
                add('_pressEnter');
                add(isOpened.waitForTrue);
            }, callback);
        },



        ////////////////////////////////////////////////////////////////////////
        // Local library: dropdown
        ////////////////////////////////////////////////////////////////////////

        _openDropdown : function (callback, id) {
            this._localAsyncSequence(function (add) {
                add('_focusWidget', id);
                add('_pressShiftF10');
                add(function wait(next) {
                    this.waitForDropDownPopup(id, next);
                });
            }, callback);
        }
    }
});

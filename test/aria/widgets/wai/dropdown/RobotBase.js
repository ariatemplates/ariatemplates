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

var ariaUtilsString = require('ariatemplates/utils/String');
var ariaUtilsArray = require('ariatemplates/utils/Array');

var ariaResourcesHandlersLCResourcesHandler = require('ariatemplates/resources/handlers/LCResourcesHandler');
var ariaResourcesHandlersLCRangeResourceHandler = require('ariatemplates/resources/handlers/LCRangeResourceHandler');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.dropdown.Base',

    $extends : require('test/EnhancedRobotTestCase'),

    $constructor : function () {
        // ------------------------------------------------------ initialization

        this.$EnhancedRobotTestCase.constructor.call(this);

        // ------------------------------------------------- internal attributes

        this._waiAria = null;

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

        var widgetsIds = [
            'autoComplete',
            'expandableAutoComplete',

            'multiAutoComplete',
            'expandableMultiAutoComplete',

            'datePicker',

            'multiSelect',
            'select',
            'selectBox'
        ];

        var widgets = {
            autoComplete: {
                configuration: {
                    id: 'autoComplete',
                    label: 'AutoComplete: ',
                    expandButton: false,
                    resourcesHandler: createResourcesHandler(ariaResourcesHandlersLCResourcesHandler)
                },
                expectations: {
                    canBeOpened: false
                }
            },

            expandableAutoComplete: {
                configuration: {
                    id: 'expandableAutoComplete',
                    label: 'Expandable AutoComplete: ',
                    resourcesHandler: createResourcesHandler(ariaResourcesHandlersLCResourcesHandler),
                    expandButton: true
                }
            },



            multiAutoComplete: {
                configuration: {
                    id: 'multiAutoComplete',
                    label: 'MultiAutoComplete: ',
                    expandButton: false,
                    resourcesHandler: createResourcesHandler(ariaResourcesHandlersLCRangeResourceHandler)
                },
                expectations: {
                    canBeOpened: false
                }
            },

            expandableMultiAutoComplete: {
                configuration: {
                    id: 'expandableMultiAutoComplete',
                    label: 'Expandable MultiAutoComplete: ',
                    expandButton: true,
                    resourcesHandler: createResourcesHandler(ariaResourcesHandlersLCRangeResourceHandler)
                }
            },



            datePicker: {
                configuration: {
                    id: 'datePicker',
                    label: 'DatePicker: '
                }
            },



            multiSelect: {
                configuration: {
                    id: 'multiSelect',
                    label: 'MultiSelect: ',

                    fieldDisplay: 'label',
                    fieldSeparator: '/',
                    displayOptions: {},

                    items: createSelectOptions()
                }
            },

            select: {
                configuration: {
                    id: 'select',
                    label: 'Select: ',
                    options: createSelectOptions()
                },
                expectations: {
                    canBeOpenedOnDownArrow: false
                }
            },

            selectBox: {
                configuration: {
                    id: 'selectBox',
                    label: 'SelectBox: ',
                    options: createSelectOptions()
                }
            }
        };

        ariaUtilsArray.forEach(widgetsIds, function (id) {
            var widget = widgets[id];

            var expectations = widget.expectations;
            if (expectations == null) {
                expectations = {};
            }
            widget.expectations = expectations;

            var canBeOpened = expectations.canBeOpened;
            if (canBeOpened == null) {
                canBeOpened = true;
            }
            expectations.canBeOpened = canBeOpened;

            var canBeOpenedOnDownArrow = expectations.canBeOpenedOnDownArrow;
            if (canBeOpenedOnDownArrow == null) {
                canBeOpenedOnDownArrow = true;
            }
            expectations.canBeOpenedOnDownArrow = canBeOpenedOnDownArrow;
        });

        var data = {
            widgetsIds: widgetsIds,

            widgets: widgets
        };

        this.setTestEnv({
            data: data,
            template: 'test.aria.widgets.wai.dropdown.Tpl'
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

            this._waiAria = false;

            this._localAsyncSequence(function (add) {
                add(testWidgets);
                add(testWaiAriaWidgets);

                add(this._createAsyncWrapper(turnWaiAriaOn));
                add('_refresh');

                add(testWaiAriaWidgets);
            }, this.end);

            // ------------------------------------------------- local functions

            function _testWidgets(next, testFunction) {
                this._asyncIterate(
                    ids,
                    function (next, id) {
                        testFunction.call(this, next, id);
                    },
                    next,
                    this
                );
            }

            function testWidgets(next) {
                _testWidgets.call(this, next, this._testWidget);
            }

            function testWaiAriaWidgets(next) {
                _testWidgets.call(this, next, this._testWaiAriaWidget);
            }

            function turnWaiAriaOn() {
                this._waiAria = true;

                var widgets = this._getData().widgets;
                ariaUtilsArray.forEach(ids, function (id) {
                    widgets[id].configuration.waiAria = true;
                });
            }
        },

        _testWaiAriaWidget : function (callback, id) {
            // --------------------------------------------------- destructuring

            var data = this._getData();
            var waiAria = this._waiAria;

            var expectations = data.widgets[id].expectations;
            var canBeOpened = expectations.canBeOpened;
            var canBeOpenedOnDownArrow = expectations.canBeOpenedOnDownArrow;

            // ------------------------------------------------------ processing

            var shouldBeOpenOnDownArrow = !waiAria && canBeOpened && canBeOpenedOnDownArrow;

            var isOpen = this._createIsOpenPredicate(id);

            this._localAsyncSequence(function (add) {
                add('_focusWidget', id);

                add('_pressDown');
                if (shouldBeOpenOnDownArrow) {
                    add(isOpen.waitForTrue);
                    add('_pressShiftF10');
                }
                add(isOpen.waitForFalse);
            }, callback);
        },

        _testWidget : function (callback, id) {
            // --------------------------------------------------- destructuring

            var data = this._getData();
            var waiAria = this._waiAria;

            var expectations = data.widgets[id].expectations;
            var canBeOpened = expectations.canBeOpened;

            // ------------------------------------------------------ processing

            var isOpen = this._createIsOpenPredicate(id);

            var shouldBeOpenedOnShiftF10 = canBeOpened; // actually only applies to AutoComplete based widgets

            this._localAsyncSequence(function (add) {
                add('_focusWidget', id);

                add('_pressShiftF10');

                if (shouldBeOpenedOnShiftF10) {
                    add(isOpen.waitForTrue);
                    add('_pressShiftF10');
                } else {
                    add('_delay');
                    add(isOpen.assertFalse);
                    add('_type', 'o'); // to display the suggestion 'one' in order to open the dropdown anyway; moreover, 'o' doesn't change from QWERTY to AZERTY, so there is less risks the tests fails depending on the current input method
                    add(isOpen.waitForTrue);
                    add('_pressShiftF10');
                }

                add(isOpen.waitForFalse);

                if (!shouldBeOpenedOnShiftF10) {
                    add('_pressBackspace'); // to erase the previously entered character and reset a proper state for testing
                }
            }, callback);
        },



        ////////////////////////////////////////////////////////////////////////
        // Library: dropdown
        ////////////////////////////////////////////////////////////////////////

        _createIsOpenPredicate : function (id) {
            return this._createPredicate(function () {
                return this.isWidgetDropDownPopupOpened(id);
            }, function (shouldBeTrue) {
                return ariaUtilsString.substitute(
                    'Widget "%1" should have its dropdown %2',
                    [id, shouldBeTrue ? 'open' : 'closed']
                );
            }, this);
        }
   }
});

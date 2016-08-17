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

var ariaUtilsArray = require('ariatemplates/utils/Array');

var EnhancedJawsTestCase = require('test/EnhancedJawsTestCase');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.input.actionWidget.Base',
    $extends : EnhancedJawsTestCase,

    $constructor : function () {
        this.$EnhancedJawsTestCase.constructor.call(this);

        this.setTestEnv({
            template : 'test.aria.widgets.wai.input.actionWidget.Tpl',
            data: {
                selectedWidgetTypeName: this.widgetTypeName
            }
        });

        this.traversals = [
            {
                name: 'withTabKey',
                key: 'tab'
            },
            // There are a lot of "blank" elements, required pressing the down key twice more
            {
                name: 'withDownKey',
                key: 'down'
            }
        ];

        this.testData = {
            'link': {
                withTabKey: {
                    actionsCount: 5,
                    expectedOutput: [
                        'this is the link label Link',

                        'this is the link external label Link',

                        'link with external description Link',
                        'this is the link external description',

                        'disabled link Unavailable Link',

                        'link: no wai ARIA Link'
                    ]
                },
                withDownKey: {
                    actionsCount: 5 * 2,
                    expectedOutput: [
                        'Link this is the link label',

                        'Link link with external label',

                        'Link link with external description',

                        'Link Unavailable disabled link',

                        'Link link: no wai ARIA'
                    ]
                }
            },
            'button': {
                withTabKey: {
                    actionsCount: 5,
                    expectedOutput: [
                        'this is the button label Button',

                        'this is the button external label Button',

                        'button with external description Button',
                        'this is the button external description',

                        'disabled button Button Unavailable',

                        'button: no wai ARIA Button'
                    ]
                },
                withDownKey: {
                    actionsCount: 5 * 2,
                    expectedOutput: [
                        'this is the button label',
                        'Button',

                        'this is the button external label',
                        'Button',

                        'button with external description',
                        'Button',

                        'disabled button',
                        'Button Unavailable',

                        'button: no wai ARIA',
                        'Button'
                    ]
                }
            },
            'button_simple': {
                withTabKey: {
                    actionsCount: 4, // a disabled button cannot be focused
                    expectedOutput: [
                        'this is the button_simple label Button',

                        'this is the button_simple external label Button',

                        'button_simple with external description Button',
                        'this is the button_simple external description',

                        'button_simple: no wai ARIA Button'
                    ]
                },
                withDownKey: {
                    actionsCount: 5 * 2,
                    expectedOutput: [
                        'this is the button_simple label',
                        'Button',

                        'this is the button_simple external label',
                        'Button',

                        'button_simple with external description',
                        'Button',

                        'disabled button_simple',
                        'Button Unavailable',

                        'button_simple: no wai ARIA',
                        'Button'
                    ]
                }
            },
            'icon_button': {
                withTabKey: {
                    actionsCount: 5,
                    expectedOutput: [
                        'this is the icon_button label Button',

                        'this is the icon_button external label Button',

                        'Unlabeled 0 Button',
                        'this is the icon_button external description',

                        'Unlabeled 0 Button Unavailable',

                        'Unlabeled 0 Button'
                    ]
                },
                withDownKey: {
                    actionsCount: 5 * 3, // in this case we output the text content in the template before the widget, adding one more element (text node) before each widget
                    expectedOutput: [
                        'icon_button with label',
                        'this is the icon_button label',
                        'Button',

                        'icon_button with external label',
                        'this is the icon_button external label',
                        'Button',

                        'icon_button with external description',
                        'Unlabeled 0',
                        'Button',

                        'disabled icon_button',
                        'Unlabeled 0',
                        'Button Unavailable',

                        'icon_button: no wai ARIA',
                        'Unlabeled 0',
                        'Button'
                    ]
                }
            },
            'sort_indicator': {
                withTabKey: {
                    actionsCount: 4,
                    expectedOutput: [
                        'this is the sort_indicator label Link',

                        'this is the sort_indicator external label Link',

                        'sort_indicator with external description Link',
                        'this is the sort_indicator external description',

                        'sort_indicator: no wai ARIA Link'
                    ]
                },
                withDownKey: {
                    actionsCount: 4 * 2,
                    expectedOutput: [
                        'Link this is the sort_indicator label',

                        'Link sort_indicator with external label', // FIXME why is this label not read?

                        'Link sort_indicator with external description',

                        'Link sort_indicator: no wai ARIA'
                    ]
                }
            }
        };
    },



    ////////////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////////////

    $prototype : {
        ////////////////////////////////////////////////////////////////////////
        // Tests
        ////////////////////////////////////////////////////////////////////////

        runTemplateTest : function () {
            var regexps = [];
            regexps.push(this._createLineRegExp('AT tests.*'));
            regexps.push(this._createLineRegExp('focus me'));
            regexps.push(this._createLineRegExp('stop here'));
            regexps.push(this._createLineRegExp('edit'));
            regexps.push(/^\n/gi);

            this._filter = function (content) {
                content = content.replace(/\s*\n/gi, '\n');

                for (var index = 0, length = regexps.length; index < length; index++) {
                    var regexp = regexps[index];

                    content = content.replace(regexp, '');
                }

                return content;
            };

            this._localAsyncSequence(function (add) {
                add('_testWidgetsTypes');
                add('_checkHistory');
            }, this.end);
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        _testWidgetsTypes : function (callback) {
            var widgetsTypes = this._getData().widgetsTypes;

            this._asyncIterate(
                widgetsTypes,
                this._testWidgetType,
                callback,
                this
            );
        },

        _testWidgetType : function (callback, widgetType) {
            // --------------------------------------------------- destructuring

            var document = Aria.$window.document;

            var elements = widgetType.elements;
            // var finalElement = document.getElementById(elements.after.id);

            var name = widgetType.name;
            var testData = this.testData[name];

            var traversals = this.traversals;

            // ------------------------------------------------------ processing

            this._executeStepsAndWriteHistory(callback, function (api) {
                // ----------------------------------------------- destructuring

                var step = api.addStep;
                var entry = api.addToHistory;

                // --------------------------------------------- local functions

                function selectStartPoint() {
                    step(['click', document.getElementById(elements.before.id)]);
                }

                // function isFinalElementFocused() {
                //     return document.activeElement === finalElement;
                // }

                function pressKey(key) {
                    step(['type', null, '[' + key + ']']);
                }

                // -------------------------------------------------- processing

                // TODO It would be more robust to stop navigating when reaching the final element
                // However this prevents us from building a predefined set of steps
                // while (!isFinalElementFocused()) {
                    // navigateForward();
                // }
                ariaUtilsArray.forEach(traversals, function(traversal) {
                    var key = traversal.key;
                    var name = traversal.name;

                    var traversalTestData = testData[traversal.name];
                    var actionsCount = traversalTestData.actionsCount;
                    var expectedOutput = traversalTestData.expectedOutput;

                    selectStartPoint();
                    while (actionsCount > 0) {
                        pressKey(key);
                        actionsCount--;
                    }
                    entry(expectedOutput.join('\n'));
                });
            });
        }
    }
});


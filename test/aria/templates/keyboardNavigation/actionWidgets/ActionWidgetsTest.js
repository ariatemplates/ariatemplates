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
var ariaUtilsJson = require('ariatemplates/utils/Json');
var ariaUtilsArray = require('ariatemplates/utils/Array');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.templates.keyboardNavigation.actionWidgets.ActionWidgetsTest',

    $extends : require('test/EnhancedRobotTestCase'),

    $constructor : function () {
        this.$EnhancedRobotTestCase.constructor.call(this);

        var data = {
            countersIds: [
                'button',
                'link'
            ],
            counters: {
                button: 0,
                link: 0
            },
            logs: []
        };

        this.setTestEnv({
            data: data
        });
    },

    $prototype : {
        ////////////////////////////////////////////////////////////////////////
        // Tests
        ////////////////////////////////////////////////////////////////////////

        runTemplateTest : function () {
            this._localAsyncSequence(function (add) {
                // -------------------------------------------------------------

                add('_focusWidget', 'button');

                add('_pushEnter');
                add('_goToLink');
                add('_releaseEnter');
                add('_checkCounters', {
                    button: 0,
                    link: 0
                });

                add('_actionWidget');
                add('_checkCounters', {
                    button: 0,
                    link: 1
                });

                // -------------------------------------------------------------

                // focus link: done already

                add('_pushEnter');
                add('_goToButton');
                add('_releaseEnter');
                add('_checkCounters', {
                    button: 0,
                    link: 0
                });

                add('_actionWidget');
                add('_checkCounters', {
                    button: 1,
                    link: 0
                });

                // -------------------------------------------------------------

                // focus button: done already

                add('_pushEnter');
                add('_goToLink');
                add('_goToButton');
                add('_releaseEnter');
                add('_checkCounters', {
                    button: 0,
                    link: 0
                });

                // -------------------------------------------------------------

                add('_goToLink');

                add('_pushEnter');
                add('_goToButton');
                add('_goToLink');
                add('_releaseEnter');
                add('_checkCounters', {
                    button: 0,
                    link: 0
                });
            }, this.end);
        },



        ////////////////////////////////////////////////////////////////////////
        // Local library
        ////////////////////////////////////////////////////////////////////////

        _waitForAction : function (callback) {
            var data = this._getData();

            this._localAsyncSequence(function (add) {
                add(function (next) {
                    this.waitFor({
                        scope: this,
                        condition: function () {
                            return data.actionDone;
                        },
                        callback: next
                    });
                });
                add(this._createAsyncWrapper(function () {
                    ariaUtilsJson.setValue(data, 'actionDone', false);
                }));
            }, callback);
        },

        _actionWidget : function (callback) {
            this._localAsyncSequence(function (add) {
                add('_pressEnter');
                add('_waitForAction');
            }, callback);
        },

        _goToButton : function (callback) {
            this._goToActionWidget(callback, 'button', true);
        },

        _goToLink : function (callback) {
            this._goToActionWidget(callback, 'link');
        },

        _goToActionWidget : function (callback, id, reverseDirection) {
            // -------------------------------------- input arguments processing

            if (reverseDirection == null) {
                reverseDirection = false;
            }

            // ------------------------------------------------------ processing

            this._localAsyncSequence(function (add) {
                if (reverseDirection) {
                    add('_pressShiftTab');
                } else {
                    add('_pressTab');
                }

                add('_waitForWidgetFocus', id);
            }, callback);
        },



        ////////////////////////////////////////////////////////////////////////
        // Assertions
        ////////////////////////////////////////////////////////////////////////

        _checkCounters : function (callback, expectedCounts) {
            // --------------------------------------------------- destructuring

            var data = this._getData();
            var countersIds = data.countersIds;

            // ------------------------------------------------------ processing

            ariaUtilsArray.forEach(countersIds, function (id) {
                var expectedCount = expectedCounts[id];

                this._checkCounter(id, expectedCount);
            }, this);

            this._resetCounters();

            // ---------------------------------------------------------- return

            callback();
        },

        _checkCounter : function (id, expected) {
            var count = this._getData().counters[id];

            var condition = count === expected;

            var message = ariaUtilsString.substitute(
                'Widget "%1" has not be actioned the expected number of times: %2 instead of %3',
                [id, count, expected]
            );

            this.assertTrue(condition, message);
        },

        _resetCounters : function () {
            // --------------------------------------------------- destructuring

            var data = this._getData();

            var counters = data.counters;
            var countersIds = data.countersIds;

            // ------------------------------------------------------ processing

            ariaUtilsArray.forEach(countersIds, function (id) {
                ariaUtilsJson.setValue(counters, id, 0);
            });
        }
   }
});

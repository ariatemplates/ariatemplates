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
var ariaJsunitTestCase = require('ariatemplates/jsunit/TestCase');
var Debouncer = require('ariatemplates/utils/async/Debouncer');

var ariaUtilsArray = require('ariatemplates/utils/Array');
var ariaUtilsFunction = require('ariatemplates/utils/Function');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.utils.async.DebouncerTestCase',
    $extends : ariaJsunitTestCase,

    $prototype : {
        _createDebounced : function (state) {
            var self = this;

            var debounced = new Debouncer({
                state: state,
                delay: state.delay,
                onStart: function (receivedState) {
                    self.assertTrue(receivedState === state, 'The state is not properly given to the callback');

                    self.assertTrue(state.beforeFirstCall, 'onStart should be called synchronously after the first run');
                    self.assertFalse(state.afterFirstCall, 'onStart should be called synchronously after the first run');

                    self.assertFalse(state.onStartCalled, 'onStart should be called once, at the very beginning');

                    state.onStartCalled = true;
                },
                onEnd: function (receivedState) {
                    self.assertTrue(receivedState === state, 'The state is not properly given to the callback');

                    self.assertTrue(state.beforeLastCall, 'onEnd should be called asynchronously after the last run');
                    self.assertTrue(state.afterLastCall, 'onEnd should be called asynchronously after the last run');

                    self.assertFalse(state.onEndCalled, 'onEnd should be called once, at the very end');

                    state.onEndCalled = true;

                    state.next();
                }
            });

            return debounced;
        },

        _testDebouncedCall : function (next, debounced) {
            // --------------------------------------------------- destructuring

            var state = debounced.state;
            var delay = state.delay;

            // ------------------------------------------------------ processing

            var self = this;

            var queue = [
                function (next, state) {
                    state.beforeFirstCall = false;
                    state.onStartCalled = false;
                    state.afterFirstCall = false;

                    state.beforeLastCall = false;
                    state.onEndCalled = false;
                    state.afterLastCall = false;

                    next();
                },

                function(next, state) {
                    state.beforeFirstCall = true;
                    debounced.run();
                    state.afterFirstCall = true;

                    self.assertTrue(state.onStartCalled, 'onStart should be called synchronously after the first call');

                    next();
                },
                function(next) {
                    setTimeout(next, delay / 2);
                },
                function(next, state) {
                    state.beforeLastCall = true;
                    debounced.run();
                    state.afterLastCall = true;

                    self.assertFalse(state.onEndCalled, 'onEnd should be called asynchronously after the last run');

                    next();
                }
            ];

            state.next = next;
            this._executeQueue(queue, state);
        },

        testAsync : function () {
            // ------------------------------------------------------ processing

            var self = this;

            // -----------------------------------------------------------------

            var state = {};
            var delay = 100;
            state.delay = delay;
            var debounced = this._createDebounced(state);

            // -----------------------------------------------------------------

            // calling twice in a row must work (internal state properly updated)
            this._testDebouncedCall(function () {
                self._testDebouncedCall(function () {
                    debounced.$dispose();
                    self.end();
                }, debounced);
            }, debounced);
        },



        ////////////////////////////////////////////////////////////////////////
        //
        ////////////////////////////////////////////////////////////////////////

        _executeQueue : function(queue, state) {
            queue = ariaUtilsArray.clone(queue);

            var fn = queue.shift();
            if (fn != null) {
                fn(ariaUtilsFunction.bind(this._executeQueue, this, queue, state), state);
            }
        }
    }
});

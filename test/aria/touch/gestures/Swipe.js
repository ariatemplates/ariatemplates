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
 * Test case for aria.touch.gestures.Swipe
 */
Aria.classDefinition({
    $classpath : "test.aria.touch.gestures.Swipe",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.FireDomEvent", "aria.core.Browser", "aria.touch.Event"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.touch.gestures.SwipeTpl"
        });
        this.domUtil = aria.utils.Dom;
        this.fireEvent = aria.utils.FireDomEvent;
        this.target = {};
        this.touchEventMap = aria.touch.Event.touchEventMap;
    },
    $destructor : function () {
        this.domUtil = null;
        this.fireEvent = null;
        this.target = null;
        this.touchEventMap = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        /**
         * Start the template test suite for the Swipe event.
         */
        runTemplateTest : function () {
            this.target = this.domUtil.getElementById("tapboard");
            this._testCancelMultiSwipe();
        },
        /**
         * Test a cancel swipe: touchstart, touchmove with 2 fingers
         */
        _testCancelMultiSwipe : function () {
            var args = {
                "sequence" : ["swipestart", "swipecancel"],
                "callback" : this._testCancelDiagonalSwipe
            };
            this._raiseFakeEvent(this.touchEventMap.touchstart, {
                touches : [{
                            clientX : 0,
                            clientY : 0
                        }],
                changedTouches : [{
                            clientX : 0,
                            clientY : 0
                        }]
            });
            this._raiseFakeEvent(this.touchEventMap.touchmove, {
                touches : [{
                            clientX : 0,
                            clientY : 0
                        }, {
                            clientX : 5,
                            clientY : 5
                        }],
                changedTouches : [{
                            clientX : 5,
                            clientY : 5
                        }]
            });
            this._delay(10, this._testEvents, args);
        },
        /**
         * Test a cancelled because not in straight line swipe: touchstart, touchmove * 4, touchend.
         */
        _testCancelDiagonalSwipe : function () {
            var args = {
                "sequence" : ["swipestart", "swipemove", "swipemove", "swipemove", "swipecancel"],
                "callback" : this._testTrueSwipe
            };
            this._raiseFakeEvent(this.touchEventMap.touchstart, {
                clientX : 0,
                clientY : 0
            });
            this._raiseFakeEvent(this.touchEventMap.touchmove, {
                clientX : 10,
                clientY : 5
            });
            this._raiseFakeEvent(this.touchEventMap.touchmove, {
                clientX : 20,
                clientY : 10
            });
            this._raiseFakeEvent(this.touchEventMap.touchmove, {
                clientX : 30,
                clientY : 15
            });
            this._raiseFakeEvent(this.touchEventMap.touchmove, {
                clientX : 40,
                clientY : 21
            });
            this._raiseFakeEvent(this.touchEventMap.touchend, {
                clientX : 40,
                clientY : 21
            });
            this._delay(10, this._testEvents, args);
        },
        /**
         * Test a valid swipe: touchstart, touchmove * 3, touchend.
         */
        _testTrueSwipe : function () {
            var args = {
                "sequence" : ["swipestart", "swipemove", "swipemove", "swipemove", "swipe"],
                "callback" : this._endTests
            };
            this._raiseFakeEvent(this.touchEventMap.touchstart, {
                clientX : 0,
                clientY : 0
            });
            this._raiseFakeEvent(this.touchEventMap.touchmove, {
                clientX : 5,
                clientY : 0
            });
            this._raiseFakeEvent(this.touchEventMap.touchmove, {
                clientX : 10,
                clientY : 0
            });
            this._raiseFakeEvent(this.touchEventMap.touchmove, {
                clientX : 15,
                clientY : 0
            });
            this._raiseFakeEvent(this.touchEventMap.touchend, {
                clientX : 15,
                clientY : 0
            });
            this._delay(10, this._testEvents, args);
        },
        /**
         * Utility to raise fake events.
         * @param {String} eventName
         */
        _raiseFakeEvent : function (eventName, options) {
            this.fireEvent.fireEvent(eventName, this.target, options);
        },
        /**
         * Utility to add delay.
         * @param {Number} delay
         * @param {Object} callback
         * @param {Object} args
         */
        _delay : function (delay, callback, args) {
            var callback = (callback) ? callback : args.callback;
            aria.core.Timer.addCallback({
                fn : callback,
                scope : this,
                delay : delay,
                args : args
            });
        },
        /**
         * Utility to test a sequence of events.
         * @param {Object} args
         */
        _testEvents : function (args) {
            var isSameLength = args.sequence.length == this.templateCtxt.data.events.length;
            this.assertTrue(isSameLength);
            if (isSameLength) {
                for (var i = 0; i < args.sequence.length; i++) {
                    this.assertTrue(args.sequence[i] === this.templateCtxt.data.events[i]);
                }
            }
            this._delay(10, null, args);
        },
        /**
         * Wrapper to end the tests.
         */
        _endTests : function () {
            this._delay(1000, this.end, {});
        }
    }
});

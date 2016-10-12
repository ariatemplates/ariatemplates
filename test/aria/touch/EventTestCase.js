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
 * Test case for the aria.touch.Event class
 */
Aria.classDefinition({
    $classpath : "test.aria.touch.EventTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.touch.Event"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {
        /**
         * Test IE 10 events
         */
        testIE10Events : function () {
            var backup = Aria.$window.navigator.msPointerEnabled;
            Aria.$window.navigator.msPointerEnabled = true;

            var primaryEvent = {};
            primaryEvent.pageX = 12;
            primaryEvent.pageY = 24;
            primaryEvent.isPrimary = true;
            this.assertTrue(aria.touch.Event.getFingerIndex(primaryEvent) === 0);
            var positions = aria.touch.Event.getPositions(primaryEvent);
            this.assertTrue(positions.length == 1 && positions[0].x == 12 && positions[0].y == 24);

            var secondaryEvent = {};
            secondaryEvent.pageX = 13;
            secondaryEvent.pageY = 25;
            secondaryEvent.isPrimary = false;
            this.assertTrue(aria.touch.Event.getFingerIndex(secondaryEvent) == 1);
            var positions = aria.touch.Event.getPositions(secondaryEvent);
            this.assertTrue(positions.length == 1 && positions[0].x == 13 && positions[0].y == 25);

            Aria.$window.navigator.msPointerEnabled = backup;
        },

        /**
         * Test desktop events
         */
        testDesktopsEvents : function () {
            var event = {};
            event.pageX = 35;
            event.pageY = 36;
            event.isPrimary = true;
            this.assertTrue(aria.touch.Event.getFingerIndex(event) === 0);
            var positions = aria.touch.Event.getPositions(event);
            this.assertTrue(positions.length == 1 && positions[0].x == 35 && positions[0].y == 36);
        },

        /**
         * Test single touch events
         */
        testSingleTouchEvents : function () {
            var startEvent = {};
            startEvent.type = aria.touch.Event.touchEventMap.touchstart;
            startEvent.touches = [{
                        pageX : 10,
                        pageY : 17
                    }];
            startEvent.changedTouches = [{
                        pageX : 10,
                        pageY : 17
                    }];
            startEvent.isPrimary = true;
            this.assertTrue(aria.touch.Event.getFingerIndex(startEvent) === 0);
            var positions = aria.touch.Event.getPositions(startEvent);
            this.assertTrue(positions.length == 1 && positions[0].x == 10 && positions[0].y == 17);

            var moveEvent = {};
            moveEvent.type = aria.touch.Event.touchEventMap.touchmove;
            moveEvent.touches = [{
                        pageX : 10,
                        pageY : 17
                    }];
            moveEvent.changedTouches = [{
                        pageX : 10,
                        pageY : 17
                    }];
            moveEvent.isPrimary = true;
            this.assertTrue(aria.touch.Event.getFingerIndex(moveEvent) === 0);
            var positions = aria.touch.Event.getPositions(moveEvent);
            this.assertTrue(positions.length == 1 && positions[0].x == 10 && positions[0].y == 17);

            var endEvent = {};
            endEvent.type = aria.touch.Event.touchEventMap.touchend;
            endEvent.touches = [];
            endEvent.changedTouches = [{
                        pageX : 10,
                        pageY : 17
                    }];
            endEvent.isPrimary = true;
            this.assertTrue(aria.touch.Event.getFingerIndex(endEvent) === 0);
            var positions = aria.touch.Event.getPositions(endEvent);
            this.assertTrue(positions.length == 1 && positions[0].x == 10 && positions[0].y == 17);
        },

        /**
         * Test double touch events
         */
        testDoubleTouchEvents : function () {
            var isIE10 = Aria.$window.navigator.msPointerEnabled || false;

            // Two fingers starting together
            var startEvent = {};
            if (!isIE10) {
                startEvent.type = aria.touch.Event.touchEventMap.touchstart;
                startEvent.touches = [{
                            pageX : 10,
                            pageY : 17
                        }, {
                            pageX : 31,
                            pageY : 35
                        }];
                startEvent.changedTouches = [{
                            pageX : 10,
                            pageY : 17
                        }, {
                            pageX : 31,
                            pageY : 35
                        }];
                this.assertTrue(aria.touch.Event.getFingerIndex(startEvent) == 102);
                var positions = aria.touch.Event.getPositions(startEvent);
                this.assertTrue(positions.length == 2 && positions[0].x == 10 && positions[0].y == 17
                        && positions[1].x == 31 && positions[1].y == 35);
            }

            // Second finger starts after first one is already touching
            startEvent.touches = [{
                        pageX : 10,
                        pageY : 17
                    }, {
                        pageX : 31,
                        pageY : 35
                    }];
            startEvent.changedTouches = [{
                        pageX : 31,
                        pageY : 35
                    }];
            startEvent.isPrimary = false;
            this.assertTrue(aria.touch.Event.getFingerIndex(startEvent) == 1);
            var positions = aria.touch.Event.getPositions(startEvent);
            this.assertTrue(positions.length == 2 && positions[0].x == 10 && positions[0].y == 17
                    && positions[1].x == 31 && positions[1].y == 35);

            // First finger moving
            var moveEvent = {};
            moveEvent.type = aria.touch.Event.touchEventMap.touchmove;
            moveEvent.touches = [{
                        pageX : 10,
                        pageY : 17
                    }, {
                        pageX : 31,
                        pageY : 35
                    }];
            moveEvent.changedTouches = [{
                        pageX : 31,
                        pageY : 35
                    }];
            moveEvent.isPrimary = false;
            this.assertTrue(aria.touch.Event.getFingerIndex(moveEvent) == 1);
            var positions = aria.touch.Event.getPositions(moveEvent);
            this.assertTrue(positions.length == 2 && positions[0].x == 10 && positions[0].y == 17
                    && positions[1].x == 31 && positions[1].y == 35);

            // Second finger moving
            moveEvent.changedTouches = [{
                        pageX : 10,
                        pageY : 17
                    }];
            moveEvent.isPrimary = true;
            this.assertTrue(aria.touch.Event.getFingerIndex(moveEvent) === 0);
            var positions = aria.touch.Event.getPositions(moveEvent);
            this.assertTrue(positions.length == 2 && positions[0].x == 10 && positions[0].y == 17
                    && positions[1].x == 31 && positions[1].y == 35);

            // Both fingers moving together
            if (!isIE10) {
                moveEvent.changedTouches = [{
                            pageX : 10,
                            pageY : 17
                        }, {
                            pageX : 31,
                            pageY : 35
                        }];
                this.assertTrue(aria.touch.Event.getFingerIndex(moveEvent) == 102);
                var positions = aria.touch.Event.getPositions(moveEvent);
                this.assertTrue(positions.length == 2 && positions[0].x == 10 && positions[0].y == 17
                        && positions[1].x == 31 && positions[1].y == 35);
            }

            // One finger ending while the other is still touching
            var endEvent = {};
            endEvent.type = aria.touch.Event.touchEventMap.touchend;
            endEvent.touches = [{
                        pageX : 10,
                        pageY : 17
                    }];
            endEvent.changedTouches = [{
                        pageX : 31,
                        pageY : 35
                    }];
            endEvent.isPrimary = false;
            this.assertTrue(aria.touch.Event.getFingerIndex(endEvent) == 1);
            var positions = aria.touch.Event.getPositions(endEvent);
            this.assertTrue(positions.length == 2 && positions[0].x == 10 && positions[0].y == 17
                    && positions[1].x == 31 && positions[1].y == 35);

            // Both fingers ending together
            if (!isIE10) {
                endEvent.touches = [];
                endEvent.changedTouches = [{
                            pageX : 10,
                            pageY : 17
                        }, {
                            pageX : 31,
                            pageY : 35
                        }];
                this.assertTrue(aria.touch.Event.getFingerIndex(endEvent) == 102);
                var positions = aria.touch.Event.getPositions(endEvent);
                this.assertTrue(positions.length == 2 && positions[0].x == 10 && positions[0].y == 17
                        && positions[1].x == 31 && positions[1].y == 35);
            }
        }
    }
});

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
 * Event utility to handle touch device detection.
 */
Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.Event",
    $constructor : function () {
        /**
         * The event mapping, can be overwritten in __touchDetection() method.
         * @type Object
         */
        this.touchEventMap = {
            "touchstart" : "touchstart",
            "touchend" : "touchend",
            "touchmove" : "touchmove"
        };
        /**
         * A flag indicating whether the browser is touch enabled.
         * @type Boolean
         */
        this.touch = true;
        this.__touchDetection();
    },
    $prototype : {
        /**
         * Utility method to determine if the device is touch capable, if not the touch event properties are updated
         * with (legacy) mouse events.
         * @private
         */
        __touchDetection : function () {
            this.touch = (('ontouchstart' in Aria.$frameworkWindow) || Aria.$frameworkWindow.DocumentTouch
                    && Aria.$frameworkWindow.document instanceof Aria.$frameworkWindow.DocumentTouch);
            if (!this.touch) {
                this.touchEventMap = {
                    "touchstart" : "mousedown",
                    "touchend" : "mouseup",
                    "touchmove" : "mousemove"
                };
            }

            // IE10 special events
            if (Aria.$window.navigator.msPointerEnabled) {
                this.touchEventMap = {
                    "touchstart" : "MSPointerDown",
                    "touchend" : "MSPointerUp",
                    "touchmove" : "MSPointerMove"
                };
            }
        },

        /**
         * Utility method to get the coordinates of all touches of an event.
         * @param {Object} the event
         * @public
         * @return {Object} an array of coordinates
         */
        getPositions : function (event) {
            var result = [];
            if (event.touches && event.touches[0] || event.changedTouches && event.changedTouches[0]) {
                for (var i = 0; i < event.touches.length; i++) {
                    result.push({
                        x : (event.touches[i].pageX) ? event.touches[i].pageX : event.touches[i].clientX,
                        y : (event.touches[i].pageY) ? event.touches[i].pageY : event.touches[i].clientY
                    });
                }
                if (event.type == this.touchEventMap.touchend) {
                    for (var i = 0; i < event.changedTouches.length; i++) {
                        result.push({
                            x : (event.changedTouches[i].pageX)
                                    ? event.changedTouches[i].pageX
                                    : event.changedTouches[i].clientX,
                            y : (event.changedTouches[i].pageY)
                                    ? event.changedTouches[i].pageY
                                    : event.changedTouches[i].clientY
                        });
                    }
                }
            } else {
                result.push({
                    x : (event.pageX) ? event.pageX : event.clientX,
                    y : (event.pageY) ? event.pageY : event.clientY
                });
            }
            return result;
        },

        /**
         * Utility method to get the index of the finger triggering the event.
         * @param {Object} the event
         * @public
         * @return {Object} the index, starting from 0. Special case: 10n means that n fingers were used at the same
         * time.
         */
        getFingerIndex : function (event) {
            var result = 0;
            // IE10 case
            if (Aria.$window.navigator.msPointerEnabled) {
                result = event.isPrimary ? 0 : 1;
            }
            // General case (webkit, firefox, opera, ...)
            else {
                if (event.touches || event.changedTouches) {
                    if (event.changedTouches.length > 1) {
                        result = 100 + event.changedTouches.length;
                    } else if (event.type == this.touchEventMap.touchend) {
                        result = event.touches.length + event.changedTouches.length - 1;
                    } else {
                        var changedX = (event.changedTouches[0].pageX)
                                ? event.changedTouches[0].pageX
                                : event.changedTouches[0].clientX;
                        var changedY = (event.changedTouches[0].pageY)
                                ? event.changedTouches[0].pageY
                                : event.changedTouches[0].clientY;
                        for (var i = 0; i < event.touches.length; i++) {
                            if (changedX == ((event.touches[i].pageX)
                                    ? event.touches[i].pageX
                                    : event.touches[i].clientX)
                                    && changedY == ((event.touches[i].pageY)
                                            ? event.touches[i].pageY
                                            : event.touches[i].clientY)) {
                                result = i;
                                break;
                            }
                        }
                    }
                }
            }
            return result;
        }
    }
});

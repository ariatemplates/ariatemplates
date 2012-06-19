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
        this.touchEventMap = {
            "touchstart" : "touchstart",
            "touchend" : "touchend",
            "touchmove" : "touchmove"
        };
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
        }
    }
});
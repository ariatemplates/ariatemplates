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
 * Contains delegated handler for a pinch event
 */
Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.Pinch",
    $extends : "aria.touch.Gesture",
    $statics: {
        /**
         * Defines the number of touch for the gesture.
         */
        NB_TOUCHES: 2
    },
    $events : {
        "pinchstart" : {
            description : "Raised when a user starts to pinch.",
            properties : {
                originalEvent : "The originating touchstart event."
            }
        },
        "pinchmove" : {
            description : "Raised when a user is pinching.",
            properties : {
                distance : "The current distance.",
                dVariation : "The distance variation from the start.",
                angle: "The current angle.",
                originalEvent : "The originating touchmove event."
            }
        },
        "pinchend" : {
            description : "Raised when a user completes a pinch",
            properties : {
                distance : "The current distance.",
                dVariation : "The distance variation from the start.",
                angle: "The current angle.",
                originalEvent : "The originating touchend event."
            }
        },
        "pinchcancel" : {
            description : "Raised when a pinch is cancelled."
        }
    },
    $constructor: function() {
        this.$Gesture.constructor.call(this);
        /**
         * The last known angle.
         * @type Number
         * @protected
         */
        this.lastKnownAngle = null;
        /**
         * The initial pinch data: distance, distance variation and angle.
         * @type Object
         * @protected
         */
        this.initialPinchData = null;
        /**
         * The primary point position.
         * @type Object
         * @protected
         */
        this.primaryPoint = null;
        /**
         * The secondary point position.
         * @type Object
         * @protected
         */
        this.secondaryPoint = null;
    },
    $prototype : {
        /**
         * Initial listeners for the Pinch gesture.
         * @protected
         */
        _getInitialListenersList: function() {
            return [{evt: this.touchEventMap.touchstart, cb: {fn : this._pinchStart, scope : this}}];
        },

        /**
         * Additional listeners for the Pinch gesture.
         * @protected
         */
        _getAdditionalListenersList: function() {
            return [{evt: this.touchEventMap.touchmove, cb: {fn : this._pinchMove, scope : this}},
                    {evt: this.touchEventMap.touchend, cb: {fn : this._pinchEnd, scope : this}}];
        },

        /**
         * The fake events raised during the Pinch lifecycle.
         * @protected
         */
        _getFakeEventsMap : function() {
            return {start: "pinchstart", move: "pinchmove", end: "pinch", cancel: "pinchcancel"};
        },

        /**
         * Pinch start mgmt: gesture is started if only two touches.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _pinchStart : function (event) {
            //Standard touch
            if (event.touches && event.touches.length >= 2) {
                var positions = aria.touch.Event.getPositions(event);
                this.primaryPoint = positions[0];
                this.secondaryPoint = positions[1];
            }
            //IE10 primary touch
            else if (event.isPrimary) {
                this.primaryPoint = aria.touch.Event.getPositions(event)[0];
            }
            //IE10 secondary touch
            else if (typeof event.isPrimary != 'undefined' && event.isPrimary === false) {
                this.secondaryPoint = aria.touch.Event.getPositions(event)[0];
            }
            if (event.touches && event.touches.length >= 2 || typeof event.isPrimary != 'undefined' && event.isPrimary === false) {
                var dist = this._calculateDistance(this.primaryPoint.x, this.primaryPoint.y,
                        this.secondaryPoint.x, this.secondaryPoint.y);
                var angle = this.__calculateAngle(this.primaryPoint.x, this.primaryPoint.y,
                        this.secondaryPoint.x, this.secondaryPoint.y);
                this.initialPinchData = {
                    distance : dist,
                    dVariation: 0,
                    angle: angle
                };
                this.lastKnownAngle = angle;
                this.$raiseEvent({
                    name : "pinchstart",
                    distance : dist,
                    dVariation: 0,
                    angle: angle,
                    originalEvent : event
                });
                return this._gestureStart(event, this.initialPinchData);
            }
            else {
                return (event.returnValue != null)? event.returnValue: !event.defaultPrevented;
            }
        },

        /**
         * Pinch move mgmt: gesture continues if only two touches.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _pinchMove : function (event) {
            //Standard touch
            if (event.touches && event.touches.length >= 2) {
                var positions = aria.touch.Event.getPositions(event);
                this.primaryPoint = positions[0];
                this.secondaryPoint = positions[1];
            }
            //IE 10 touch
            else if (typeof event.isPrimary != 'undefined') {
                if (event.isPrimary) {
                    this.primaryPoint = aria.touch.Event.getPositions(event);
                }
                else {
                    this.secondaryPoint = aria.touch.Event.getPositions(event);
                }
            }
            else {
                this.$raiseEvent({
                    name : "pinchcancel"
                });
                return this._gestureCancel(event);
            }
            var currentDist = this._calculateDistance(this.primaryPoint.x, this.primaryPoint.y,
                    this.secondaryPoint.x, this.secondaryPoint.y);
            var currentAngle = this.__calculateAngle(this.primaryPoint.x, this.primaryPoint.y,
                    this.secondaryPoint.x, this.secondaryPoint.y);
            this.lastKnownAngle = currentAngle;
            var currentData = {
                    distance : currentDist,
                    dVariation: (currentDist - this.initialPinchData.distance),
                    angle: currentAngle
            };
            this.$raiseEvent({
                name : "pinchmove",
                distance : currentDist,
                dVariation: (currentDist - this.initialPinchData.distance),
                angle: currentAngle,
                originalEvent : event
            });
            return this._gestureMove(event, currentData);

        },

        /**
         * Pinch end mgmt: gesture ends if only two touches.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _pinchEnd : function (event) {
            //Standard touch
            if (event.touches && event.changedTouches && (event.changedTouches.length || 0) + (event.touches.length || 0) >= 2) {
                var positions = aria.touch.Event.getPositions(event);
                this.primaryPoint = positions[0];
                this.secondaryPoint = positions[1];
            }
            //IE10 touch
            if (typeof event.isPrimary != 'undefined') {
                if (event.isPrimary) {
                    this.primaryPoint = aria.touch.Event.getPositions(event);
                }
                else {
                    this.secondaryPoint = aria.touch.Event.getPositions(event);
                }
            }
            if (event.touches && event.changedTouches && (event.changedTouches.length || 0) + (event.touches.length || 0) >= 2 || typeof event.isPrimary != 'undefined') {
                var finalDist = this._calculateDistance(this.primaryPoint.x, this.primaryPoint.y,
                        this.secondaryPoint.x, this.secondaryPoint.y);
                var finalAngle = this.__calculateAngle(this.primaryPoint.x, this.primaryPoint.y,
                        this.secondaryPoint.x, this.secondaryPoint.y);
                if (Math.abs(finalAngle - this.lastKnownAngle) > 150) {
                    finalAngle = this.__calculateAngle(this.secondaryPoint.x, this.secondaryPoint.y, this.primaryPoint.x, this.primaryPoint.y);
                }
                var finalData = {
                        distance : finalDist,
                        dVariation: (finalDist - this.initialPinchData.distance),
                        angle: finalAngle
                };
                this.$raiseEvent({
                    name : "pinchend",
                    distance : finalDist,
                    dVariation: (finalDist - this.initialPinchData.distance),
                    angle: finalAngle,
                    originalEvent : event
                });
                return this._gestureEnd(event, finalData);
            }
            else {
                this.$raiseEvent({
                    name : "pinchcancel"
                });
                return this._gestureCancel(event);
            }
        },

        /**
         * Returns the angle of the line defined by two points, and the x axes.
         * @param {Integer} x1 x of the first point
         * @param {Integer} y1 y of the first point
         * @param {Integer} x2 x of the second point
         * @param {Integer} y2 y of the second point
         * @private
         * @return {Number} the angle in degrees ]-180; 180]
         */
        __calculateAngle: function (x1, y1, x2, y2) {
            return  Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        }
    }
});

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
 * Contains delegated handler for a swipe event
 */
Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.DoubleSwipe",
    $extends : "aria.touch.Gesture",
    $statics : {
        /**
         * The move tolerance to validate the gesture.
         * @type Integer
         */
        TOLERANCE : 10,
        NB_TOUCHES : 2,
        THUMB_TOLERANCE : 80,
        SINGLE_TOLERANCE : 20
    },
    $events : {
        "doubleswipestart" : {
            description : "Raised when a user starts to swipe.",
            properties : {
                distance : "The distance between two thumbs.",
                originalEvent : "The originating touchstart event."
            }
        },
        "doubleswipemove" : {
            description : "Raised when a user is swiping.",
            properties : {
                distance : "The distance between two thumbs.",
                originalEvent : "The originating touchstart event."
            }
        },
        "doubleswipeend" : {
            description : "Raised when a user completes a swipe",
            properties : {
                distance : "The distance between two thumbs.",
                originalEvent : "The originating touchstart event."
            }
        },
        "doubleswipecancel" : {
            description : "Raised when a double swipe is cancelled or completed and the listeners for the event need to be removed."
        },

        "beforedoubleswipe" : {
            description : "Raised when a user tap or click on the slider.",
            properties : {
                originalEvent : "The originating touchstart event."
            }
        }

    },
    $constructor : function () {
        this.$Gesture.constructor.call(this);
        /**
         * The initial double swipe data: distance, X and Y coordinates.
         * @type Object
         * @protected
         */
        this.initalDoubleSwipeData = null;
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

        this.__mouseEventMap = {
            start : "mousedown",
            move : "mousemove",
            end : "mouseup"

        };
    },
    $prototype : {
        /**
         * Initial listeners for the Swipe gesture.
         * @protected
         */
        _getInitialListenersList : function () {
            return [{
                        evt : this.touchEventMap.touchstart,
                        cb : {
                            fn : this._doubleSwipeStart,
                            scope : this
                        }
                    }];
        },

        /**
         * Additional listeners for the Swipe gesture.
         * @protected
         */
        _getAdditionalListenersList : function () {
            return [{
                        evt : this.touchEventMap.touchmove,
                        cb : {
                            fn : this._doubleSwipeMove,
                            scope : this
                        }
                    }, {
                        evt : this.touchEventMap.touchend,
                        cb : {
                            fn : this._doubleSwipeEnd,
                            scope : this
                        }
                    }];
        },

        /**
         * The fake events raised during the Swipe lifecycle.
         * @protected
         */
        _getFakeEventsMap : function () {
            return {
                start : "doubleswipestart",
                move : "doubleswipemove",
                end : "doubleswipe",
                cancel : "doubleswipecancel"
            };
        },

        /**
         * Double Swipe start mgmt: gesture is started if touch is one or two.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _doubleSwipeStart : function (event) {
            if (event.touches && event.touches.length >= this.NB_TOUCHES) {
                var touchEventUtil = aria.touch.Event, positions = touchEventUtil.getPositions(event);
                this.primaryPoint = positions[0] || null;
                this.secondaryPoint = positions[1] || null;

            }
            if (event.touches && event.touches.length >= this.NB_TOUCHES || typeof event.isPrimary != 'undefined'
                    && event.isPrimary === false) {

                var distance = 0, primarypoint = null, secondarypoint = null, time;
                time = (new Date()).getTime();
                primarypoint = this.primaryPoint;
                if (event.touches.length >= 2) {
                    secondarypoint = this.secondaryPoint;
                    distance = this._calculateDistance(primarypoint.x, primarypoint.y, secondarypoint.x, secondarypoint.y);

                }
                this.initalDoubleSwipeData = {
                    distance : distance,
                    primaryPoint : primarypoint,
                    secondaryPoint : secondarypoint,
                    time : time
                };
                this.$raiseEvent({
                    name : "doubleswipestart",
                    distance : distance,
                    originalEvent : event,
                    primaryPoint : primarypoint,
                    secondaryPoint : secondarypoint
                });
                return this._gestureStart(event, this.initalDoubleSwipeData);
            } else {
                if ((event.touches && event.touches.length == 1) || event.type === this.__mouseEventMap.start) {
                    var coordinates = [], distance = 0, time;
                    coordinates = aria.touch.Event.getPositions(event);
                    // To support single slider
                    this.NB_TOUCHES = 1;
                    this._connectAdditionalTouchEvents();
                    time = (new Date()).getTime();
                    this.initalDoubleSwipeData = {
                        distance : distance,
                        primaryPoint : coordinates[0],
                        secondaryPoint : "",
                        time : time
                    };
                    this.startData = {
                        positions : coordinates,
                        time : time
                    };
                    this.$raiseEvent({
                        name : "beforedoubleswipe",
                        originalEvent : event,
                        coordinates : coordinates
                    });

                }
                return (event.returnValue != null) ? event.returnValue : !event.defaultPrevented;
            }
        },

        /**
         * Swipe move mgmt: gesture continues if only one touch and if the move is within margins.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _doubleSwipeMove : function (event) {

            if ((event.touches && event.touches.length >= this.NB_TOUCHES)
                    || (this.NB_TOUCHES === 1 && event.type === this.__mouseEventMap.move)) {

                var positions = aria.touch.Event.getPositions(event);
                this.primaryPoint = positions[0] || null;
                this.secondaryPoint = positions[1] || null;
            } else {
                this.$raiseEvent({
                    name : "doubleswipecancel"
                });
                return this._gestureCancel(event);
            }
            var primarypoint = null, secondarypoint = null, distance = 0, route = "";
            primarypoint = this.primaryPoint;
            if (event.touches && event.touches.length >= 2) {
                secondarypoint = this.secondaryPoint;
                distance = this._calculateDistance(primarypoint.x, primarypoint.y, secondarypoint.x, secondarypoint.y);
            }
            this.newDoubleSwipeData = {
                distance : distance,
                primaryPoint : primarypoint,
                secondaryPoint : secondarypoint,
                initialPrimaryPoint : this.initalDoubleSwipeData.primaryPoint || "",
                initialSecondaryPoint : this.initalDoubleSwipeData.secondaryPoint || ""

            };
            if (this.NB_TOUCHES === 1) {
                this.newDoubleSwipeData.route = this._getSwipeRoute(this.initalDoubleSwipeData.primaryPoint, primarypoint);
            } else {
                this.newDoubleSwipeData.route = this._getRoute(this.initalDoubleSwipeData, this.newDoubleSwipeData);
            }
            this.$raiseEvent({
                name : "doubleswipemove",
                distance : distance,
                originalEvent : event,
                primaryPoint : primarypoint,
                secondaryPoint : secondarypoint
            });
            return this._gestureMove(event, this.newDoubleSwipeData);

        },

        /**
         * Swipe end mgmt: gesture ends if only one touch and if the end is within margins.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _doubleSwipeEnd : function (event) {

            if ((event.touches && event.changedTouches && (event.changedTouches.length || 0)
                    + (event.touches.length || 0) >= this.NB_TOUCHES)
                    || (this.NB_TOUCHES === 1 && event.type === this.__mouseEventMap.end)) {
                var positions = aria.touch.Event.getPositions(event);
                this.primaryPoint = positions[0] || null;
                this.secondaryPoint = positions[1] || null;
            }

            if ((event.touches && event.changedTouches && (event.changedTouches.length || 0)
                    + (event.touches.length || 0) >= this.NB_TOUCHES)
                    || (this.NB_TOUCHES === 1 && event.type === this.__mouseEventMap.end)) {
                var distance = 0, primarypoint = null, secondarypoint = null, distanceVar = 0, route = "", duration;
                primarypoint = this.primaryPoint;
                if (event.touches && event.touches.length >= 2) {
                    secondarypoint = this.secondaryPoint;
                    distance = this._calculateDistance(primarypoint.x, primarypoint.y, secondarypoint.x, secondarypoint.y);
                }
                if (this.initalDoubleSwipeData.time) {
                    duration = (new Date()).getTime() - this.initalDoubleSwipeData.time;
                }
                this.newDoubleSwipeData = {
                    distance : distance,
                    primaryPoint : primarypoint,
                    secondaryPoint : secondarypoint,
                    initialPrimaryPoint : this.initalDoubleSwipeData.primaryPoint || "",
                    initialSecondaryPoint : this.initalDoubleSwipeData.secondaryPoint || "",
                    duration : duration

                };
                if (this.NB_TOUCHES === 1) {
                    this.newDoubleSwipeData.route = this._getSwipeRoute(this.initalDoubleSwipeData.primaryPoint, primarypoint);
                } else {
                    this.newDoubleSwipeData.route = this._getRoute(this.initalDoubleSwipeData, this.newDoubleSwipeData);
                }

                this.$raiseEvent({
                    name : "doubleswipeend",
                    distance : distance,
                    originalEvent : event,
                    primaryPoint : primarypoint,
                    secondaryPoint : secondarypoint
                });
                return this._gestureEnd(event, this.newDoubleSwipeData);
            } else {
                this.$raiseEvent({
                    name : "doubleswipecancel"
                });
                return this._gestureCancel(event);
            }
        },

        /**
         * SingleTap cancellation.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _doubleSwipeCancel : function (event) {
            this.$raiseEvent({
                name : "doubleswipecancel"
            });
            return this._gestureCancel(event);
        },

        /**
         * Returns the direction and the distance of the swipe. Direction: left, right, up, down. Distance: positive
         * integer measured from touchstart and touchend. Will return false if the gesture is not a swipe.
         * @param {Object} startPosition contains the x,y position of the start of the gesture
         * @param {Object} startPosition contains the current x,y position of the gesture
         * @public
         * @return {Object} contains the direction and distance
         */
        _getRoute : function (startPosition, endPosition) {
            var distanceinitial = this._calculateDistance(startPosition.primaryPoint.x, startPosition.primaryPoint.y, startPosition.secondaryPoint.x, startPosition.secondaryPoint.y);
            var distancenew = this._calculateDistance(endPosition.primaryPoint.x, endPosition.primaryPoint.y, endPosition.secondaryPoint.x, endPosition.secondaryPoint.y);
            var distanceVariation = (distancenew - distanceinitial);
            if (Math.abs(distanceVariation) < this.TOLERANCE) {
                var direction1X = endPosition.primaryPoint.x - startPosition.primaryPoint.x;
                var direction1Y = endPosition.primaryPoint.y - startPosition.primaryPoint.y;
                var direction2X = endPosition.secondaryPoint.x - startPosition.secondaryPoint.x;
                var direction2Y = endPosition.secondaryPoint.y - startPosition.secondaryPoint.y;

                var thumb1directionX = Math.abs(direction1X);
                var thumb1directionY = Math.abs(direction1Y);
                var thumb2directionX = Math.abs(direction2X);
                var thumb2directionY = Math.abs(direction2Y);
                var vertical = ((thumb1directionY > thumb1directionX) && (thumb2directionY > thumb2directionX)
                        && (thumb1directionX <= this.THUMB_TOLERANCE) && (thumb2directionX <= this.THUMB_TOLERANCE));
                var horizontal = ((thumb1directionX > thumb1directionY) && (thumb2directionX > thumb2directionY)
                        && (thumb1directionY <= this.THUMB_TOLERANCE) && (thumb2directionY <= this.THUMB_TOLERANCE));
                if (vertical) {
                    return (direction1Y < 0 && direction2Y < 0) ? "UP" : "DOWN";
                }

                if (horizontal) {
                    return (direction1X < 0 && direction2X < 0) ? "LEFT" : "RIGHT";
                }
                return false;
            }
        },
        _getSwipeRoute : function (startPosition, endPosition) {
            var directionX = endPosition.x - startPosition.x;
            var directionY = endPosition.y - startPosition.y;
            var absDirectionX = Math.abs(directionX);
            var absDirectionY = Math.abs(directionY);
            var vertical = ((absDirectionY > absDirectionX) && (absDirectionX <= this.SINGLE_TOLERANCE));
            var horizontal = ((absDirectionX > absDirectionY) && (absDirectionY <= this.SINGLE_TOLERANCE));
            if (vertical) {
                return (directionY < 0) ? "UP" : "DOWN";

            }
            if (horizontal) {
                return (directionX < 0) ? "LEFT" : "RIGHT";
            }
            return false;
        }
    }
});

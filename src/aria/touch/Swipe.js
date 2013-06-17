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
    $classpath : "aria.touch.Swipe",
    $extends : "aria.touch.Gesture",
    $statics : {
        /**
         * The move tolerance to validate the gesture.
         * @type Integer
         */
        MARGIN : 20
    },
    $events : {
        "swipestart" : {
            description : "Raised when a user starts to swipe.",
            properties : {
                startX : "The pageX/clientX value of the swipe start event.",
                startY : "The pageY/clientY value of the swipe start event.",
                originalEvent : "The originating touchstart event."
            }
        },
        "swipemove" : {
            description : "Raised when a user is swiping.",
            properties : {
                route : "Contains the direction and the distance of the swipe from the swipe start to the current swipe event coordinates.",
                originalEvent : "The originating touchmove event."
            }
        },
        "swipeend" : {
            description : "Raised when a user completes a swipe",
            properties : {
                route : "Contains the direction and the distance of the swipe from the swipe start to the current swipe event coordinates.",
                originalEvent : "The originating touchend event."
            }
        },
        "swipecancel" : {
            description : "Raised when a swipe is cancelled or completed and the listeners for the event need to be removed."
        }
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
                            fn : this._swipeStart,
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
                            fn : this._swipeMove,
                            scope : this
                        }
                    }, {
                        evt : this.touchEventMap.touchend,
                        cb : {
                            fn : this._swipeEnd,
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
                start : "swipestart",
                move : "swipemove",
                end : "swipe",
                cancel : "swipecancel"
            };
        },

        /**
         * Swipe start mgmt: gesture is started if only one touch.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _swipeStart : function (event) {
            var status = this._gestureStart(event);
            if (status != null) {
                this.$raiseEvent({
                    name : "swipestart",
                    startX : this.startData.positions[0].x,
                    startY : this.startData.positions[0].y,
                    originalEvent : event
                });
                return status;
            } else {
                return (event.returnValue != null) ? event.returnValue : !event.defaultPrevented;
            }

        },

        /**
         * Swipe move mgmt: gesture continues if only one touch and if the move is within margins.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _swipeMove : function (event) {
            var route = this._getRoute(this.startData.positions[0], aria.touch.Event.getPositions(event)[0]);
            if (route) {
                var status = this._gestureMove(event, route);
                if (status != null) {
                    this.$raiseEvent({
                        name : "swipemove",
                        route : route,
                        originalEvent : event
                    });
                    return status;
                } else {
                    return this._swipeCancel(event);
                }
            } else {
                return this._swipeCancel(event);
            }
        },

        /**
         * Swipe end mgmt: gesture ends if only one touch and if the end is within margins.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _swipeEnd : function (event) {
            var route = this._getRoute(this.startData.positions[0], aria.touch.Event.getPositions(event)[0]);
            if (route) {
                var status = this._gestureEnd(event, route);
                if (status != null) {
                    this.$raiseEvent({
                        name : "swipeend",
                        route : route,
                        originalEvent : event
                    });
                    return status;
                } else {
                    return this._swipeCancel(event);
                }
            } else {
                return this._swipeCancel(event);
            }
        },

        /**
         * SingleTap cancellation.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _swipeCancel : function (event) {
            this.$raiseEvent({
                name : "swipecancel"
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
            var directionX = endPosition.x - startPosition.x;
            var directionY = endPosition.y - startPosition.y;
            var absDirectionX = Math.abs(directionX);
            var absDirectionY = Math.abs(directionY);
            var vertical = ((absDirectionY > absDirectionX) && (absDirectionX <= this.MARGIN));
            var horizontal = ((absDirectionX > absDirectionY) && (absDirectionY <= this.MARGIN));
            if (vertical) {
                return {
                    "direction" : (directionY < 0) ? "up" : "down",
                    "distance" : absDirectionY,
                    "startX" : startPosition.x,
                    "startY" : startPosition.y,
                    "endX" : endPosition.x,
                    "endY" : endPosition.y
                };
            }
            if (horizontal) {
                return {
                    "direction" : (directionX < 0) ? "left" : "right",
                    "distance" : absDirectionX,
                    "startX" : startPosition.x,
                    "startY" : startPosition.y,
                    "endX" : endPosition.x,
                    "endY" : endPosition.y
                };
            }
            return false;
        }
    }
});

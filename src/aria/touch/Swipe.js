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
    $dependencies : ["aria.utils.Event", "aria.utils.Delegate", "aria.utils.AriaWindow", "aria.touch.Event"],
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
    $constructor : function () {
        /**
         * reference to Aria.$window.document.body
         * @type HTMLElement
         */
        this.body = {};
        /**
         * event map uses aria.touch.Event for touch event detection
         */
        this.touchEventMap = aria.touch.Event.touchEventMap;
        var ariaWindow = aria.utils.AriaWindow;
        ariaWindow.$on({
            "attachWindow" : this._connectTouchEvents,
            "detachWindow" : this._disconnectTouchEvents,
            scope : this
        });
        if (ariaWindow.isWindowUsed) {
            this._connectTouchEvents();
        }
    },
    $destructor : function () {
        aria.utils.AriaWindow.$unregisterListeners(this);
        this._disconnectTouchEvents();
        this.body = null;
        this.touchEventMap = null;
    },
    $statics : {
        MARGIN : 20
    },
    $prototype : {
        /**
         * This method is called when AriaWindow sends an attachWindow event. It registers a listener on the touchstart
         * @protected
         */
        _connectTouchEvents : function () {
            this.body = Aria.$window.document.body;
            aria.utils.Event.addListener(this.body, this.touchEventMap.touchstart, {
                fn : this._swipeStart,
                scope : this
            });
        },
        /**
         * This method is called when AriaWindow sends a detachWindow event. It unregisters the listener on the
         * touchstart event.
         * @protected
         */
        _disconnectTouchEvents : function () {
            aria.utils.Event.removeListener(this.body, this.touchEventMap.touchstart, {
                fn : this._swipeStart,
                scope : this
            });
            this._swipeCancel();
        },
        /**
         * Entry point for the swipe handler
         * @param {Object} event touchstart event
         * @protected
         */
        _swipeStart : function (event) {
            var args = {
                startX : (event.pageX) ? event.pageX : event.clientX,
                startY : (event.pageY) ? event.pageY : event.clientY,
                start : (new Date()).getTime()
            };
            aria.utils.Event.addListener(this.body, this.touchEventMap.touchmove, {
                fn : this._swipeMove,
                scope : this,
                args : args
            });
            aria.utils.Event.addListener(this.body, this.touchEventMap.touchend, {
                fn : this._swipeEnd,
                scope : this,
                args : args
            });
            this.$raiseEvent({
                name : "swipestart",
                startX : args.startX,
                startY : args.startY,
                originalEvent : event
            });
        },
        /**
         * Handles the swipe: firstly determines if the touchstart and touchend events were within the same axis: for
         * horizontal swipe: Y axis is the same for vertical swipe: X axis is the same Delegate.delegate to accurately
         * delegate the event to the appropriate DOM element
         * @param {Object} event touchend event
         * @param {Object} args contains touchstart.Page/ClientX and touchstart.Page/ClientY
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _swipeEnd : function (event, args) {
            var duration = (new Date()).getTime() - args.start;
            args.eventType = "swipeend";
            var route = this._getRoute(args);
            var returnValue = false;
            if (route) {
                var target = (event.target) ? event.target : event.srcElement;
                var swipeEvent = aria.DomEvent.getFakeEvent("swipe", target);
                returnValue = event.returnValue;
                swipeEvent.duration = duration;
                swipeEvent.distance = route.distance;
                swipeEvent.direction = route.direction;
                swipeEvent.startX = route.startX;
                swipeEvent.startY = route.startY;
                swipeEvent.endX = route.endX;
                swipeEvent.endY = route.endY;
                aria.utils.Delegate.delegate(swipeEvent);
                event.cancelBubble = swipeEvent.hasStopPropagation;
                event.returnValue = !swipeEvent.hasPreventDefault;
                this.$raiseEvent({
                    name : "swipeend",
                    route : route,
                    originalEvent : event
                });
            }
            this._swipeCancel();
            return returnValue;
        },
        /**
         * Cancels the swipe by removing the listeners added for touchend, and touchmove
         * @protected
         */
        _swipeCancel : function () {
            var b = true;
            while (b) {
                b = aria.utils.Event.removeListener(this.body, this.touchEventMap.touchend, {
                    fn : this._swipeEnd,
                    scope : this
                });
            }
            b = true;
            while (b) {
                b = aria.utils.Event.removeListener(this.body, this.touchEventMap.touchmove, {
                    fn : this._swipeMove,
                    scope : this
                });
            }
            this.$raiseEvent({
                name : "swipecancel"
            });
        },
        /**
         * Checks that the swipe is still valid
         * @param {Object} event touchmove event
         * @param {Object} args contains touchstart.Page/ClientX and touchstart.Page/ClientY
         * @protected
         */
        _swipeMove : function (event, args) {
            args.endX = (event.pageX) ? event.pageX : event.clientX;
            args.endY = (event.pageY) ? event.pageY : event.clientY;
            args.eventType = "swipemove";
            var route = this._getRoute(args);
            if (!route) {
                this._swipeCancel();
            } else {
                this.$raiseEvent({
                    name : "swipemove",
                    route : route,
                    originalEvent : event
                });
            }
        },
        /**
         * Returns the direction and the distance of the swipe. Direction: left, right, up, down. Distance: positive
         * integer measured from touchstart and touchend. Will return false if the gesture is not a swipe.
         * @param {Object} args contains: touchstart.Page/ClientX, touchstart.Page/ClientY, touchend.Page/ClientX,
         * touchend.Page/ClientY
         * @protected
         * @return {Object} contains the direction and distance
         */
        _getRoute : function (args) {
            var directionX = args.endX - args.startX;
            var directionY = args.endY - args.startY;
            var absDirectionX = Math.abs(directionX);
            var absDirectionY = Math.abs(directionY);
            var vertical = ((absDirectionY > absDirectionX) && (absDirectionX <= this.MARGIN));
            var horizontal = ((absDirectionX > absDirectionY) && (absDirectionY <= this.MARGIN));
            if (args.eventType === "swipemove") {
                return {
                    "direction" : "unknown",
                    "distance" : "0",
                    "startX" : args.startX,
                    "startY" : args.startY,
                    "endX" : args.endX,
                    "endY" : args.endY
                };
            }
            if (vertical) {
                return {
                    "direction" : (directionY < 0) ? "up" : "down",
                    "distance" : absDirectionY,
                    "startX" : args.startX,
                    "startY" : args.startY,
                    "endX" : args.endX,
                    "endY" : args.endY
                };
            }
            if (horizontal) {
                return {
                    "direction" : (directionX < 0) ? "left" : "right",
                    "distance" : absDirectionX,
                    "startX" : args.startX,
                    "startY" : args.startY,
                    "endX" : args.endX,
                    "endY" : args.endY
                };
            }
            return false;
        }
    }
});

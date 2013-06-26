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
 * General class for gestures.
 * Actual gesture implementations should extend this class.
 */
Aria.classDefinition({
    $classpath : "aria.touch.Gesture",
    $dependencies : ["aria.utils.Event", "aria.utils.Delegate", "aria.utils.AriaWindow", "aria.touch.Event"],
    $statics: {
        /**
         * Defines the number of touch for the gesture.
         */
        NB_TOUCHES: 1
    },
    $constructor : function () {
        /**
         * reference to Aria.$window.document.body
         * @type HTMLElement
         */
        this.body = {};
        /**
         * Event map uses aria.touch.Event for touch event detection.
         * @type Object
         */
        this.touchEventMap = aria.touch.Event.touchEventMap;
        var ariaWindow = aria.utils.AriaWindow;
        ariaWindow.$on({
            "attachWindow" : this._connectTouchEvents,
            "detachWindow" : this._disconnectTouchEvents,
            scope : this
        });
        /**
         * A flag indicating whether the starting events are already attached.
         * @type Boolean
         */
        this.eventsAlreadyAttached = false;
        if (ariaWindow.isWindowUsed) {
            this._connectTouchEvents();
        }
        /**
         * The id of the timer associated to the gesture.
         * @type Integer
         */
        this.timerId = null;
        /**
         * The gesture initial data.
         * @type Object
         */
        this.startData = null;
        /**
         * The gesture current data.
         * @type Object
         */
        this.currentData = null;
    },
    $destructor : function () {
        aria.utils.AriaWindow.$unregisterListeners(this);
        this._disconnectTouchEvents();
        this.body = null;
    },
    $prototype : {

        /**
         * This method is called when AriaWindow sends an attachWindow event.
         * It registers the initial listeners for the gesture.
         * @private
         */
        _connectTouchEvents : function () {
            if (!this.eventsAlreadyAttached) {
                this.body = Aria.$window.document.body;
                var map = this._getInitialListenersList();
                for (var i = 0; i< map.length; i++) {
                    this._addListener(map[i].evt, map[i].cb);
                }
                this.eventsAlreadyAttached = true;
            }
        },

        /**
         * This method is called when AriaWindow sends a detachWindow event.
         * It unregisters the listeners added in _connectTouchEvents.
         * @private
         */
        _disconnectTouchEvents : function () {
            var map = this._getInitialListenersList();
            for (var i = 0; i< map.length; i++) {
                this._removeListener(map[i].evt, map[i].cb);
            }
            this.eventsAlreadyAttached = false;
        },

        /**
         * Returns the list of listeners to be attached when AriaWindow sends an attachWindow event, and detached when AriaWindow sends a detachWindow event.
         * These listeners are also detached during the gesture, and reattached when it ends or when it is cancelled.
         * @protected
         * @return {Object} the list of listeners.
         */
        _getInitialListenersList: function() {
            return [];
        },

        /**
         * Returns the list of listeners to be attached when the gesture is started, and detached when the gesture is finished.
         * @protected
         * @return {Object} the list of listeners.
         */
        _getAdditionalListenersList: function() {
            return [];
        },

        /**
         * Returns the map of fake events to be raised during the gesture lifecycle.
         * Format: {start: "start_event_name", move: "move_event_name", end : "end_event_name", cancel: "cancel_event_name"}
         * @protected
         * @return {Object} the map of listeners.
         */
        _getFakeEventsMap : function() {
            return {};
        },

        /**
         * Generic start point for a gesture: unregisters initial listeners, registers additional listeners, set initial data, optional fake event raised
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _gestureStart : function (event, extraData) {
            if (!this.__validateNbTouches(event)) {
                return null;
            }
            this._disconnectTouchEvents();
            this.startData = { positions : aria.touch.Event.getPositions(event),
                    time : (new Date()).getTime()
            };
            this.currentData = null;
            this._connectAdditionalTouchEvents();
            if (this._getFakeEventsMap().start) {
                return this._raiseFakeEvent(event, this._getFakeEventsMap().start, extraData);
            }
            else {
                return (event.returnValue != null)? event.returnValue: !event.defaultPrevented;
            }
        },

        /**
         * Generic optional move: manages intermediate states during the gesture
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _gestureMove : function (event, extraData) {
            if (!this.__validateNbTouches(event)) {
                return null;
            }
            this.currentData = { positions : aria.touch.Event.getPositions(event),
                    time : (new Date()).getTime()
            };
            if (this._getFakeEventsMap().move) {
                return this._raiseFakeEvent(event, this._getFakeEventsMap().move, extraData);
            }
            else {
                return (event.returnValue != null)? event.returnValue: !event.defaultPrevented;
            }
        },

        /**
         * Generic success end point for the gesture: final fake event raised, additional listeners unregistered, initial listeners attached again.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _gestureEnd : function (event, extraData) {
            if (!this.__validateNbTouches(event)) {
                return null;
            }
            this._disconnectAdditionalTouchEvents();
            this._connectTouchEvents();
            this.currentData = { positions : aria.touch.Event.getPositions(event),
                    time : (new Date()).getTime()
            };
            if (this._getFakeEventsMap().end) {
                return this._raiseFakeEvent(event, this._getFakeEventsMap().end, extraData);
            }
            else {
                return (event.returnValue != null)? event.returnValue: !event.defaultPrevented;
            }
        },

        /**
         * Generic failure end point for the gesture: optional fake event raised, additional listeners unregistered, initial listeners attached again.
         * @param {Object} event the original event
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _gestureCancel : function (event, extraData) {
            this._disconnectAdditionalTouchEvents();
            this._connectTouchEvents();
            this.currentData = { positions : aria.touch.Event.getPositions(event),
                    time : (new Date()).getTime()
            };
            if (this._getFakeEventsMap().cancel) {
                return this._raiseFakeEvent(event, this._getFakeEventsMap().cancel, extraData);
            }
            else {
                return (event.returnValue != null)? event.returnValue: !event.defaultPrevented;
            }
        },

        /**
         * Registers the listeners added during the gesture lifecycle, once the gesture is started.
         * @private
         */
        _connectAdditionalTouchEvents: function() {
            var map = this._getAdditionalListenersList();
            for (var i = 0; i< map.length; i++) {
                this._addListener(map[i].evt, map[i].cb);
            }
        },

        /**
         * Unregisters the listeners added during the gesture lifecycle.
         * @private
         */
        _disconnectAdditionalTouchEvents: function() {
            var map = this._getAdditionalListenersList();
            for (var i = 0; i< map.length; i++) {
                this._removeListener(map[i].evt, map[i].cb);
            }
        },

        /**
         * Adds an event listener
         * @param {Object} eventName the event name
         * @param {Object} cb the callback for the event
         * @protected
         */
        _addListener: function (eventName, cb) {
            aria.utils.Event.addListener(this.body, eventName, cb);
        },

        /**
         * Removes an event listener
         * @param {String} eventName the event name
         * @param {Object} cb the callback for the event
         * @protected
         */
        _removeListener: function (eventName, cb) {
            aria.utils.Event.removeListener(this.body, eventName, cb);
        },

        /**
         * Raises a fake event, using Delegate.delegate to accurately delegate the event to the appropriate DOM element.
         * @param {Object} event the original event
         * @param {String} name the fake event name
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _raiseFakeEvent: function(event, name, extraData) {
            var target = (event.target) ? event.target : event.srcElement;
            var fakeEvent = aria.DomEvent.getFakeEvent(name, target);
            if (!event.returnValue) {
                fakeEvent.preventDefault();
            }
            if (event.cancelBubble) {
                fakeEvent.stopPropagation();
            }
            fakeEvent.pageX = event.pageX;
            fakeEvent.pageY = event.pageY;
            fakeEvent.clientX = event.clientX;
            fakeEvent.clientY = event.clientY;
            fakeEvent.touches = event.touches;
            fakeEvent.changedTouches = event.changedTouches;
            fakeEvent.isPrimary = event.isPrimary;
            if (this.startData) {
                if (this.startData.time) {
                    fakeEvent.duration = (new Date()).getTime() - this.startData.time;
                }
            }
            if (!extraData) {
                extraData = {};
            }
            extraData.startX = this.startData.positions[0].x;
            extraData.startY = this.startData.positions[0].y;
            var position = aria.touch.Event.getPositions(event);
            extraData.currentX = position[0].x;
            extraData.currentY = position[0].y;
            fakeEvent.detail = extraData;
            aria.utils.Delegate.delegate(fakeEvent);
            event.cancelBubble = fakeEvent.hasStopPropagation;
            event.returnValue = !fakeEvent.hasPreventDefault;
            return event.returnValue;
        },

        /**
         * Returns the distance between two points.
         * @param {Integer} x1 x of the first point
         * @param {Integer} y1 y of the first point
         * @param {Integer} x2 x of the second point
         * @param {Integer} y2 y of the second point
         * @protected
         * @return {Number} the distance
         */
        _calculateDistance: function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        },

        /**
         * Validates the event against the number of touches required for the gesture.
         * Rules:
         * - single touch gestures are canceled as soon as multi touch is started.
         * - multi touch gestures need all touch events (IE 10 constraint).
         * @param {Object} event the event
         * @private
         * @return {Boolean} true if the event's touches are validated for the current gesture.
         */
        __validateNbTouches: function(event) {
            var fingerIndex = aria.touch.Event.getFingerIndex(event);
            return this.NB_TOUCHES == 1 && fingerIndex === 0 || this.NB_TOUCHES == 2 && fingerIndex >= 0;
        }
    }
});

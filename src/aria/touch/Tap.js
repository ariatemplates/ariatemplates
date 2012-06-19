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
 * Contains delegated handler for a tap event
 */
Aria.classDefinition({
    $singleton : true,
    $classpath : "aria.touch.Tap",
    $dependencies : ["aria.utils.Event", "aria.utils.Delegate", "aria.utils.AriaWindow", "aria.touch.Event"],
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
    $prototype : {
        /**
         * This method is called when AriaWindow sends an attachWindow event. It registers a listener on the touchstart,
         * and touchmove.
         * @protected
         */
        _connectTouchEvents : function () {
            this.body = Aria.$window.document.body;
            aria.utils.Event.addListener(this.body, this.touchEventMap.touchstart, {
                fn : this._tapStart,
                scope : this
            });
            aria.utils.Event.addListener(this.body, this.touchEventMap.touchmove, {
                fn : this._tapCancel,
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
                fn : this._tapStart,
                scope : this
            });
            aria.utils.Event.removeListener(this.body, this.touchEventMap.touchmove, {
                fn : this._tapCancel,
                scope : this
            });
            this._tapCancel();
        },

        /**
         * Entry point for the tap handler
         * @protected
         */
        _tapStart : function () {
            var args = {
                start : (new Date()).getTime()
            };
            aria.utils.Event.addListener(this.body, this.touchEventMap.touchend, {
                fn : this._tapEnd,
                scope : this,
                args : args
            });
        },

        /**
         * Handles the tap: firstly determines if the touchstart and touchend events were within 1000ms, secondly uses
         * Delegate.delegate to accurately delegate the event to the appropriate DOM element
         * @param {Object} event touchend event
         * @param {Object} args contains start time
         * @protected
         * @return {Boolean} false if preventDefault is true
         */
        _tapEnd : function (event, args) {
            this._tapCancel();
            var diff = (new Date()).getTime() - args.start;
            if (diff < 1000) {
                var target = (event.target) ? event.target : event.srcElement;
                var tapEvent = aria.DomEvent.getFakeEvent("tap", target);
                tapEvent.pageX = event.pageX;
                tapEvent.pageY = event.pageY;
                tapEvent.clientX = event.clientX;
                tapEvent.clientY = event.clientY;
                aria.utils.Delegate.delegate(tapEvent);
                event.cancelBubble = tapEvent.hasStopPropagation;
                event.returnValue = !tapEvent.hasPreventDefault;
                return event.returnValue;
            }
        },

        /**
         * Cancels the tap by removing the listeners added for touchend
         * @protected
         */
        _tapCancel : function () {
            var b = true;
            while (b) {
                b = aria.utils.Event.removeListener(this.body, this.touchEventMap.touchend, {
                    fn : this._tapEnd,
                    scope : this
                });
            }
        }
    }
});
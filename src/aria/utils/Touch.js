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

(function () {
    /**
     * Shortcut to aria.utils.Event
     * @type aria.utils.Event
     */
    var eventUtil;

    /**
     * Connect delegated touchmove and touchend events. For performances these are attached only after a touchstart.
     * @param {aria.utils.Touch} scope Instance of the listening class
     */
    function connectTouchEvents (scope) {
        var body = Aria.$window.document.body;
        eventUtil.addListener(body, "touchmove", {
            fn : scope._onTouchMove,
            scope : scope
        });
        eventUtil.addListener(body, "touchend", {
            fn : scope._onTouchend,
            scope : scope
        });
    }

    /**
     * Disconnect delegated touchmove and touchend events.
     * @param {aria.utils.Touch} scope Instance of the listening class
     */
    function disconnectTouchEvents (scope) {
        var body = Aria.$window.document.body;
        eventUtil.removeListener(body, "touchmove", {
            fn : scope._onTouchMove,
            scope : scope
        });
        eventUtil.removeListener(body, "touchend", {
            fn : scope._onTouchend,
            scope : scope
        });
    }

    /**
     * Handle Touch interaction globally. This class determines whether global actions like drag happen on the page and
     * notifies the listeners of such events.
     */
    Aria.classDefinition({
        $classpath : "aria.utils.Touch",
        $singleton : true,
        $events : {
            "eventUp" : "Raised on the touch end."
        },
        $dependencies : ["aria.utils.Event", "aria.utils.AriaWindow", "aria.touch.Event", "aria.utils.Mouse"],
        $destructor : function () {
            aria.utils.AriaWindow.$unregisterListeners(this);
            this._disconnectTouchStartEvent();

            eventUtil = null;
            this._mouseUtil = null;
        },
        $constructor : function () {
            eventUtil = aria.utils.Event;
            this._mouseUtil = aria.utils.Mouse;
            var ariaWindow = aria.utils.AriaWindow;
            ariaWindow.$on({
                "attachWindow" : this._connectTouchStartEvent,
                "detachWindow" : this._disconnectTouchStartEvent,
                scope : this
            });
            if (ariaWindow.isWindowUsed) {
                this._connectTouchStartEvent();
            }
        },
        $prototype : {
            /**
             * This method is called when AriaWindow sends an attachWindow event. It registers a listener on the
             * touchstart event.
             */
            _connectTouchStartEvent : function () {
                eventUtil.addListener(Aria.$window.document.body, "touchstart", {
                    fn : this._onTouchStart,
                    scope : this
                });
            },

            /**
             * This method is called when AriaWindow sends a detachWindow event. It unregisters the listener on the
             * touchstart event.
             */
            _disconnectTouchStartEvent : function () {
                eventUtil.removeListener(Aria.$window.document.body, "touchstart", {
                    fn : this._onTouchStart,
                    scope : this
                });
                disconnectTouchEvents(this);
            },

            /**
             * Element that is currently being dragged. Activation delay elapsed.
             * @type aria.utils.dragdrop.Drag
             * @private
             */
            _activeDrag : "",

            /**
             * Listener for the touchstart event. It detects possible gestures
             * @param {HTMLEvent} evt touchstart event. It is not wrapped yet
             * @private
             */
            _onTouchStart : function (evt) {
                var event = new aria.DomEvent(evt);

                connectTouchEvents(this);

                if (this._mouseUtil._detectDrag(evt)) {
                    event.preventDefault(true);
                }
                var elementPosition = aria.touch.Event.getPositions(event);
                this._mouseUtil._dragStartPosition = {
                    x : elementPosition[0].x,
                    y : elementPosition[0].y
                };
                event.$dispose();
                return false;
            },

            /**
             * After an activation delay, if no touchstart event is raised the drag has started.
             * @param {Object} coordinates X and Y coordinates of the initial touch position
             * @private
             */
            _startDrag : function (coordinates) {
                var element = this._mouseUtil._candidateForDrag;
                if (!element) {
                    return;
                }

                this._activeDrag = element;
                this._mouseUtil._dragStarted = true;
                element.start(coordinates);
            },

            /**
             * Listener for the touch move event.
             * @param {HTMLEvent} evt touch event. It is not wrapped yet
             * @private
             */
            _onTouchMove : function (evt) {
                if (this._mouseUtil._dragStartPosition && !this._mouseUtil._dragStarted) {

                    this._startDrag(this._mouseUtil._dragStartPosition);

                }
                var element = this._activeDrag;
                if (element) {
                    var event = new aria.DomEvent(evt);
                    var elementPosition = aria.touch.Event.getPositions(evt);
                    if (elementPosition.length === 1) {
                        event.clientX = elementPosition[0].x;
                        event.clientY = elementPosition[0].y;
                        element.move(event);
                    }
                    event.$dispose();
                }
            },

            /**
             * Listener for the touch end event.
             * @param {HTMLEvent} evt touch event. It is not wrapped yet
             * @private
             */
            _onTouchend : function (evt) {
                this._mouseUtil._dragStartPosition = null;
                disconnectTouchEvents(this);

                var element = this._activeDrag, event;
                if (element) {
                    element.end();
                }

                this._mouseUtil._candidateForDrag = null;
                this._activeDrag = null;
                event = new aria.DomEvent(evt);
                var elementPosition = aria.touch.Event.getPositions(evt);
                if (elementPosition.length === 1) {
                    event.clientX = elementPosition[0].x;
                    event.clientY = elementPosition[0].y;
                    this.$raiseEvent({
                        name : "eventUp",
                        originalEvent : evt,
                        posX : event.clientX,
                        posY : event.clientY
                    });
                    event.$dispose();
                }
            }

        }
    });
})();
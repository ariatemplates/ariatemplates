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
var Aria = require("../Aria");
var ariaUtilsEvent = require("./Event");
var ariaUtilsAriaWindow = require("./AriaWindow");
var ariaTouchEvent = require("../touch/Event");
var ariaDomEvent = require("../DomEvent");
var ariaCoreBrowser = require("../core/Browser");


(function () {
    /**
     * Shortcut to aria.utils.Event
     * @type aria.utils.Event
     */
    var eventUtil;

    /**
     * Unique counter for generating delegated ids.
     * @type Number
     */
    var _idCounter = 0;

    /**
     * Connect delegated mousemove and mouseup events. For performances these are attached only after a mousedown.
     * @param {aria.utils.Mouse} scope Instance of the listening class
     */
    function connectMouseEvents (scope) {
        var body = Aria.$window.document.body;
        eventUtil.addListener(body, "mousemove", {
            fn : scope._onMouseMove,
            scope : scope
        });
        eventUtil.addListener(body, "mouseup", {
            fn : scope._onMouseUp,
            scope : scope
        });
        eventUtil.addListener(body, "touchmove", {
            fn : scope._onMouseMove,
            scope : scope
        });
        eventUtil.addListener(body, "touchend", {
            fn : scope._onMouseUp,
            scope : scope
        });
    }

    /**
     * Disconnect delegated mousemove and mouseup events.
     * @param {aria.utils.Mouse} scope Instance of the listening class
     */
    function disconnectMouseEvents (scope) {
        var body = Aria.$window.document.body;
        eventUtil.removeListener(body, "mousemove", {
            fn : scope._onMouseMove,
            scope : scope
        });
        eventUtil.removeListener(body, "mouseup", {
            fn : scope._onMouseUp,
            scope : scope
        });
        eventUtil.removeListener(body, "touchmove", {
            fn : scope._onMouseMove,
            scope : scope
        });
        eventUtil.removeListener(body, "touchend", {
            fn : scope._onMouseUp,
            scope : scope
        });
    }

    /**
     * Find the first parent of 'start' element with the attribute specified by 'attribute'
     * @param {HTMLElement} start Node element from which we start searching
     * @param {String} attribute Attribute name
     * @param {Number} maxDepth Maximum number of elements to traverse, -1 for infinite
     * @param {HTMLElement} stopper Stop the search when reaching this element
     * @return {String} attribute value
     */
    function findByAttribute (start, attribute, maxDepth, stopper) {
        var target = start, expandoValue;

        while (maxDepth && target && target != stopper) {
            if (target.attributes) {
                var expandoValue = target.attributes[attribute];
                if (expandoValue) {
                    return expandoValue.nodeValue;
                }
            }
            target = target.parentNode;
            maxDepth--;
        }
    }

    /**
     * Handle mouse interaction globally. This class determines whether global actions like drag or gestures happen on
     * the page and notifies the listeners of such events.
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.utils.Mouse",
        $singleton : true,
        $statics : {
            /**
             * Expando used to mark an element as draggable
             * @type String
             */
            DRAGGABLE_ATTRIBUTE : "atdraggable"
        },
        $destructor : function () {
            ariaUtilsAriaWindow.$unregisterListeners(this);
            this._disconnectMouseDownEvent();

            eventUtil = null;

        },
        $constructor : function () {
            eventUtil = ariaUtilsEvent;
            var ariaWindow = ariaUtilsAriaWindow;
            ariaWindow.$on({
                "attachWindow" : this._connectMouseDownEvent,
                "detachWindow" : this._disconnectMouseDownEvent,
                scope : this
            });
            if (ariaWindow.isWindowUsed) {
                this._connectMouseDownEvent();
            }

            /**
             * Store the original mouse down position, once the drag is detected
             * @protected
             * @type Object
             */
            this._dragStartPosition = null;

            /**
             * Whether a drag has started
             * @protected
             * @type Boolean
             */
            this._dragStarted = false;

        },
        $prototype : {
            /**
             * This method is called when AriaWindow sends an attachWindow event. It registers a listener on the
             * mousedown event.
             */
            _connectMouseDownEvent : function () {
                eventUtil.addListener(Aria.$window.document.body, "mousedown", {
                    fn : this._onMouseDown,
                    scope : this
                });
                eventUtil.addListener(Aria.$window.document.body, "touchstart", {
                    fn : this._onMouseDown,
                    scope : this
                });
            },

            /**
             * This method is called when AriaWindow sends a detachWindow event. It unregisters the listener on the
             * mousedown event.
             */
            _disconnectMouseDownEvent : function () {
                eventUtil.removeListener(Aria.$window.document.body, "mousedown", {
                    fn : this._onMouseDown,
                    scope : this
                });
                eventUtil.removeListener(Aria.$window.document.body, "touchstart", {
                    fn : this._onMouseDown,
                    scope : this
                });
                disconnectMouseEvents(this);
            },

            /**
             * Maximum number of HTML Elements to traverse when looking for DRAGGABLE_ATTRIBUTE
             * @type Number
             */
            maxDepth : -1,

            /**
             * List of element listening for a specific gesture
             * @private
             * @type Object
             *
             * <pre>
             * {
             *    'gestureType' : {
             *       'uniqueId' : Element
             *    }
             * }
             * </pre>
             */
            _idList : {
                drag : {}
            },

            /**
             * Element on which drag event is about to be raised. The candidate element is the one on which mousedown
             * event happened but the activation delay has not ended yet.
             * @type aria.utils.dragdrop.Drag
             * @private
             */
            _candidateForDrag : "",

            /**
             * Element that is currently being dragged. Activation delay elapsed.
             * @type aria.utils.dragdrop.Drag
             * @private
             */
            _activeDrag : "",

            /**
             * Register a listener for a mouse action or gesture.<br />
             * Possible values for gesture are
             * <ul>
             * <li>'drag': hold and move and element. <em>instance</em> must implement from aria.utils.dragdrop.IDrag</li>
             * </ul>
             * @param {String} gesture mouse action or gesture
             * @param {Object} instance listening class
             */
            listen : function (gesture, instance) {
                if (gesture == "drag") {
                    return this._listenDrag(instance);
                }
            },

            /**
             * Register a listener for a drag action
             * @param {aria.utils.dragdrop.IDrag} instance listening class
             * @private
             */
            _listenDrag : function (instance) {
                var id = ++_idCounter;

                this._idList.drag[id] = instance;

                return id;
            },

            /**
             * Remove a listener for a mouse action or gesture.
             * @param {String} gesture mouse action or gesture
             * @param {String} id id of the listening instance
             */
            stopListen : function (gesture, id) {
                if (this._idList[gesture]) {
                    delete this._idList[gesture][id];
                }
            },

            /**
             * Listener for the mouse down event. It detects possible gestures
             * @param {HTMLEvent} evt mousedown event. It is not wrapped yet
             * @private
             */
            _onMouseDown : function (evt) {
                var event = new ariaDomEvent(evt);

                connectMouseEvents(this);

                if (evt.type === "touchstart") {
                    // The position of touch events is not determined correctly by clientX/Y
                    var elementPosition = ariaTouchEvent.getPositions(event);
                    event.clientX = elementPosition[0].x;
                    event.clientY = elementPosition[0].y;
                }

                if (this._detectDrag(event)) {
                    event.preventDefault(true);
                }

                event.$dispose();
                return false;
            },

            /**
             * Base function to detect if a drag gesture is happening or not.
             * @param {aria.DomEvent} evt mouse down event
             * @private
             */
            _detectDrag : function (evt) {
                var stopper = Aria.$window.document.body;
                var elementId = findByAttribute(evt.target, this.DRAGGABLE_ATTRIBUTE, this.maxDepth, stopper);
                if (!elementId) {
                    return;
                }

                var candidate = this._idList.drag[elementId];
                this.$assert(211, !!candidate);

                this._candidateForDrag = candidate;
                this._dragStartPosition = {
                    x : evt.clientX,
                    y : evt.clientY
                };
                this._dragStarted = false;

                return true;
            },

            /**
             * After an activation delay, if no mouseup event is raised the drag has started.
             * @param {Object} coordinates X and Y coordinates of the initial mouse position
             * @private
             */
            _startDrag : function (coordinates) {
                var element = this._candidateForDrag;
                if (!element) {
                    return;
                }

                this._activeDrag = element;
                this._dragStarted = true;
                element.start(coordinates);
            },

            /**
             * Listener for the mouse move event.
             * @param {HTMLEvent} evt mouse event. It is not wrapped yet
             * @private
             */
            _onMouseMove : function (evt) {
                var event = new ariaDomEvent(evt);

                if (event.type === "touchmove") {
                    var elementPosition = ariaTouchEvent.getPositions(evt);
                    if (elementPosition.length === 1) {
                        event.clientX = elementPosition[0].x;
                        event.clientY = elementPosition[0].y;
                    }
                }

                if (this._dragStartPosition && !this._dragStarted) {
                    this._startDrag(this._dragStartPosition);
                }

                var element = this._activeDrag;
                if (element) {
                    // IE mouseup check - mouseup happened when mouse was out of window
                    if (evt.type !== "touchmove" && !evt.button) {
                        var browser = ariaCoreBrowser;
                        if (browser.isIE8 || browser.isIE7) {
                            event.$dispose();
                            return this._onMouseUp(evt);
                        }
                    }

                    element.move(event);
                }
                event.$dispose();
            },

            /**
             * Listener for the mouse up event.
             * @param {HTMLEvent} evt mouse event. It is not wrapped yet
             * @private
             */
            _onMouseUp : function (evt) {
                this._dragStartPosition = null;
                disconnectMouseEvents(this);

                var element = this._activeDrag;
                if (element) {
                    element.end();
                }

                this._candidateForDrag = null;
                this._activeDrag = null;
            }
        }
    });
})();

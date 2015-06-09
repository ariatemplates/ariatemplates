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
     * Set an expando attribute on the draggable element, useful for delegation
     * @param {HTMLElement} element Element on which the attribute should be set
     * @param {String} name Attribute's name
     * @param {String} value Attribute's value
     */
    function setAttribute (element, name, value) {
        if (element) {
            element.setAttribute(name, value);
        }
    }

    /**
     * Remove an expando attribute from the draggable element
     * @param {HTMLElement} element Element from which the attribute should be removed
     * @param {String} name Attribute's name
     */
    function removeAttribute (element, name) {
        if (element) {
            element.removeAttribute(name);
        }
    }

    /**
     * Incremented whenever creating a proxy
     * @private
     * @type Number
     */
    var __proxyId = 0;

    /**
     * This class defines a draggable element and implements IDrag interface providing dragstart/end events.
     */
    Aria.classDefinition({
        $classpath : "aria.utils.dragdrop.Drag",
        $dependencies : ["aria.utils.Dom", "aria.utils.Mouse", "aria.utils.Type"],
        $implements : ["aria.utils.dragdrop.IDrag"],
        $statics : {
            INVALID_ATTRIBUTE : "Invalid attribute '%1' in '%2'"
        },
        $constructor : function (id, params) {
            params = params || {};
            /**
             * Id of the draggable element
             * @type String
             */
            this.id = null;

            /**
             * Draggable element
             * @type HTMLElement
             */
            this.element = null;

            var typeUtils = aria.utils.Type;
            if (typeUtils.isString(id)) {
                this.id = id;
            } else if (typeUtils.isHTMLElement(id)) {
                this.element = id;
                this.id = this.element.id;
            } else {
                this.$logError(this.INVALID_ATTRIBUTE, ["id", "constructor"]);
                // Override functions from the interface so it's safe to call them
                this.start = Aria.empty;
                this.move = Aria.empty;
                this.end = Aria.empty;
            }

            /**
             * Configuration parameters
             * @type aria.utils.dragdrop.DragDropBean:DragCfg
             */
            this.params = params;

            /**
             * Handle element. This is the element from which drag can be initialized by the user.
             * @type HTMLElement
             */
            this.handle = params.handle;

            /**
             * Cursor element. The user can set a particular cursor.
             * @type HTMLElement
             */
            this.cursor = params.cursor;

            /**
             * Cursor style applied on the element before drag starts
             * @type String
             */
            this.originalCursor = null;

            /**
             * Instance of Overlay acting as Proxy
             * @type aria.utils.overlay.Overlay
             */
            this.proxy = null;

            /**
             * Coordinate of the draggable element. X coordinate.
             * @type Number
             */
            this.posX = null;

            /**
             * Coordinate of the draggable element. Y coordinate.
             * @type Number
             */
            this.posY = null;

            /**
             * Geometry to which the draggable element is constrained
             * @protected
             * @type aria.utils.DomBeans:Geometry
             */
            this._boundary = null;

            /**
             * True if the draggable can only move horizontally
             * @protected
             * @type Boolean
             */
            this._horizontal = params.axis && (params.axis == "x");

            /**
             * True if the draggable can only move vertically
             * @protected
             * @type Boolean
             */
            this._vertical = params.axis && (params.axis == "y");

            /**
             * Position of the element to drag at drag start
             * @protected
             * @type aria.utils.DomBeans:Position
             */
            this._elementInitialPosition = null;

            /**
             * Geometry of the movable element at drag start
             * @protected
             * @type aria.utils.DomBeans:Geometry
             */
            this._movableInitialGeometry = null;

            /**
             * Geometry of the movable element while it is being moved
             * @protected
             * @type aria.utils.DomBeans:Geometry
             */
            this._movableGeometry = null;

            /**
             * Base offset to subtract to the movable geometry in order to set the correct left and top properties on
             * the element
             * @protected
             * @type aria.utils.DomBeans:Position
             */
            this._baseMovableOffset = null;

            /**
             * Unique identifier for the draggable instance
             * @type Number
             */
            this.listenerId = aria.utils.Mouse.listen("drag", this);

            /**
             * By default this is true to fix a bug for all draggable elements containing an IFrame, but can be switched
             * off if necessary.
             * @type Boolean
             */
            this.dragOverIFrame = (params.dragOverIFrame !== undefined) ? params.dragOverIFrame : false;

            /**
             * Used with this.dragOverIFrame to add an overlay to the document, fixes an issue caused by dragging over
             * IFrames
             * @type HTMLElement
             */
            this.overlay = null;

            setAttribute(this.getDraggable(true), aria.utils.Mouse.DRAGGABLE_ATTRIBUTE, this.listenerId);

            // This will start loading the proxy class if needed without creating it.
            this.getMovable(false);

        },
        $destructor : function () {
            var draggable = this.getDraggable();
            if (draggable) {
                removeAttribute(draggable, aria.utils.Mouse.DRAGGABLE_ATTRIBUTE);

                draggable.style.cursor = this.originalCursor;
                draggable = null;
            }
            if (this.proxy && this.proxy.overlay) {
                this.proxy.$dispose();
            }
            this.element = null;
            this.handle = null;
            this.cursor = null;
            this.proxy = null;
            aria.utils.Mouse.stopListen("drag", this);
        },
        $prototype : {

            /**
             * Get the element from which drag can start. This is the handle if specified or the draggable element
             * itself otherwise.
             * @param {Boolean} logError Whether an error should be logged when the draggable element is not found
             * @return {HTMLElement}
             */
            getDraggable : function (logError) {
                var handle = this.handle;
                var cursor = this.cursor;
                var element;

                if (!handle) {
                    element = this.getElement(logError);
                } else {
                    var typeUtils = aria.utils.Type;

                    if (typeUtils.isString(handle)) {
                        handle = aria.utils.Dom.getElementById(handle);
                    }
                    if (typeUtils.isHTMLElement(handle)) {
                        this.handle = handle;
                        element = handle;
                    } else if (logError === true) {
                        this.$logError(this.INVALID_ATTRIBUTE, ["handle", "params"]);
                    }
                }
                if (element) {
                    if (cursor) {
                        if (this.originalCursor == null) {
                            this.originalCursor = element.style.cursor;
                        }
                        element.style.cursor = cursor;
                    }
                    return element;
                }

            },

            /**
             * Get the draggable element. This is the element that should be moved when drag ends.
             * @param {Boolean} logError Whether an error should be logged when the element is not found
             * @return {HTMLElement}
             */
            getElement : function (logError) {
                var element = this.element;

                if (!element) {
                    element = aria.utils.Dom.getElementById(this.id);
                    if (!element) {
                        if (logError === true) {
                            this.$logError(this.INVALID_ATTRIBUTE, ["id", "constructor"]);
                        }
                        return;
                    }

                    this.element = element;
                }
                return element;
            },

            /**
             * Compute the initial position of the element and set its style properties
             * @protected
             * @param {HTMLElement} element
             */
            _setElementStyle : function (element) {
                var offset = aria.utils.Dom.getOffset(element);
                var position = {
                    left : offset.left,
                    top : offset.top
                };
                this._elementInitialPosition = position;

                var style = element.style;
                style.position = "absolute";
                style.left = position.left + "px";
                style.top = position.top + "px";

            },

            /**
             * Get the element that moves on every mouse move. This is the proxy if specified or the draggable element
             * itself otherwise.
             * @param {Boolean} create Whether to create or not the proxy as soon as it's class is loaded. Default true
             * @return {HTMLElement} or undefined if the movable element is not ready yet
             */
            getMovable : function (create) {
                var proxy = this.proxy;

                if (proxy) {
                    return proxy.overlay;
                }

                var params = this.params, config = params.proxy;
                if (config) {
                    var classpath = "aria.utils.overlay." + config.type;
                    Aria.load({
                        classes : [classpath],
                        oncomplete : create === false ? null : {
                            fn : this._createProxy,
                            scope : this,
                            args : {
                                classpath : classpath,
                                cfg : config.cfg
                            }
                        },
                        onerror : {
                            fn : function () {
                                this.$logError(this.INVALID_ATTRIBUTE, ["proxy", "params"]);
                            },
                            scope : this,
                            override : true
                        }
                    });
                    // Aria.load might be synchronous and this.proxy could be already available here
                    if (create !== false && !this.proxy) {
                        // this won't cause another Aria.load on next move if the proxy is not ready
                        this.proxy = {};
                    }
                    if (this.proxy) {
                        return this.proxy.overlay;
                    } else {
                        return this.proxy;
                    }
                } else {
                    return this.getElement();
                }
            },

            /**
             * Instantiate the proxy instance.
             * @protected
             * @param {Object} args Initialization arguments
             *
             * <pre>
             * {
             *     classpath : Proxy's classpath,
             *     cfg : Proxy's configuration
             * }
             * </pre>
             */
            _createProxy : function (args) {
                var classRef = Aria.getClassRef(args.classpath);
                try {
                    var cfg = args.cfg || {};
                    cfg.id = this.id || ("proxy_" + __proxyId);
                    __proxyId++;
                    this.proxy = new classRef(this.getElement(), cfg);
                } catch (ex) {
                    this.$logError(this.INVALID_ATTRIBUTE, ["proxy", "params"]);
                }
            },

            /**
             * Handle the drag start. Initialize some reference geometries and raise the dragstart event
             * @param {Object} coord Contains the x and y coordinates of the mouse when a drag start has been detected
             */
            start : function (coord) {
                this.posX = coord.x;
                this.posY = coord.y;
                var element = this.getElement(true), parentScroll, domUtil = aria.utils.Dom;
                // This will prevent text selection on IE on the element
                element.onselectstart = Aria.returnFalse;

                this._setElementStyle(element);
                this._setBoundary();
                var movable = this.getMovable();
                if (movable) {
                    // This will prevent text selection on IE on the movable
                    movable.onselectstart = Aria.returnFalse;
                    if (this.dragOverIFrame) {
                        // add overlay here for the visible page
                        this.overlay = new aria.utils.overlay.Overlay(Aria.$window.document.body, {
                            className : ' '
                        });
                    }
                    if (movable.offsetTop < element.offsetTop) {
                        movable.style.top = element.offsetTop + "px";
                    }
                    this._movableInitialGeometry = aria.utils.Dom.getGeometry(movable);
                    this._movableGeometry = aria.utils.Json.copy(this._movableInitialGeometry);
                    // This is to handle if there is a scroll
                    parentScroll = domUtil._getDocumentScroll().scrollTop;
                    this._movableGeometry.y += (parentScroll > 0) ? parentScroll : 0;
                    var offset = aria.utils.Dom.getOffset(movable);
                    this._baseMovableOffset = {
                        left : this._movableGeometry.x - offset.left,
                        top : this._movableGeometry.y - offset.top
                    };
                    this.$raiseEvent("dragstart");
                }
            },

            /**
             * Handle the mouse move during a drag by setting the correct position on the movable element. Raise the
             * move event
             * @param {aria.DomEvent} evt
             */
            move : function (evt) {
                var movable = this.getMovable();
                var domUtil = aria.utils.Dom;

                if (movable && movable.style) {
                    var offsetX = this._vertical ? 0 : evt.clientX - this.posX;
                    var offsetY = this._horizontal ? 0 : evt.clientY - this.posY;
                    var geometry = aria.utils.Json.copy(this._movableGeometry);
                    geometry.x += offsetX;
                    geometry.y += offsetY;
                    var pos = (this._boundary) ? domUtil.fitInside(geometry, this._boundary) : {
                        top : geometry.y,
                        left : geometry.x
                    };

                    movable.style.top = (pos.top - this._baseMovableOffset.top) + "px";
                    movable.style.left = (pos.left - this._baseMovableOffset.left) + "px";

                    geometry.y = pos.top;
                    geometry.x = pos.left;

                    this.posY += geometry.y - this._movableGeometry.y;
                    this.posX += geometry.x - this._movableGeometry.x;
                    this._movableGeometry = geometry;
                    this.$raiseEvent("move");
                }
            },

            /**
             * Handle the drag end. Apply the correct positioning to the draggable element
             */
            end : function () {
                var element = this.getElement(), parentScroll, domUtil = aria.utils.Dom;
                // This is to handle if there is a scroll
                parentScroll = domUtil._getDocumentScroll().scrollTop;
                element.onselectstart = Aria.returnTrue;
                if (this.dragOverIFrame) {
                    // remove overlay here
                    this.overlay.$dispose();
                }
                if (this.proxy && this.proxy.overlay) {
                    this._movableInitialGeometry.y += (parentScroll > 0) ? parentScroll : 0;
                    element.style.top = (this._elementInitialPosition.top + this._movableGeometry.y - this._movableInitialGeometry.y)
                            + "px";
                    element.style.left = (this._elementInitialPosition.left + this._movableGeometry.x - this._movableInitialGeometry.x)
                            + "px";
                    this.proxy.$dispose();
                    this.proxy = null;
                }

                this.$raiseEvent("dragend");
            },

            /**
             * Compute the geometry of the element to which the draggable element is constrained
             * @protected
             */
            _setBoundary : function () {
                var constrainTo = this.params.constrainTo, domUtil = aria.utils.Dom;
                if (!constrainTo || constrainTo === domUtil.VIEWPORT) {
                    this._boundary = constrainTo;
                    return;
                }
                if (aria.utils.Type.isString(constrainTo)) {
                    constrainTo = domUtil.getElementById(constrainTo);

                }
                if (constrainTo) {
                    this._boundary = aria.utils.Dom.getGeometry(constrainTo);
                    return;
                }
                this._boundary = null;
                this.$logError(this.INVALID_ATTRIBUTE, ["constrainTo", "params"]);

            }
        }
    });
})();

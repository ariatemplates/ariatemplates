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
 * This Class defines resizable element and implements IResize interface providing beforeresize/resizeend events
 */
Aria.classDefinition({
    $classpath : "aria.utils.resize.Resize",
    $extends : "aria.utils.dragdrop.Drag",
    $dependencies : ["aria.utils.Dom", "aria.utils.String", "aria.utils.Json"],
    $constructor : function (id, params) {
        params = params || {};

        var proxy = {
            type : 'Overlay'
        }, ContainerId = id, that = this;
        /*
         * The minimum height to which element can be resized
         */
        this.minHeight = 100;
        /*
         * The minimum width to which element can be resized
         */
        this.minWidth = 100;

        this.$Drag.constructor.call(that, ContainerId, {
            handle : params.handle,
            cursor : params.cursor,
            proxy : proxy,
            axis : params.axis,
            constrainTo : aria.utils.Dom.VIEWPORT
        });

    },
    $destructor : function () {
        this.$Drag.$destructor.call(this);
        this.minHeight = null;
        this.minWidth = null;
    },
    $prototype : {
        /**
         * Handle the resize start. Initialize some reference geometries and raise the beforeresize event
         * @param {Object} coord Contains the x and y coordinates of the mouse when a drag start has been detected on
         * resize handle
         */
        start : function (coord) {
            this.posX = coord.x;
            this.posY = coord.y;
            this._mouseInitialPosition = {
                left : coord.x,
                top : coord.y
            };
            var element = this.getElement(true), movable, document = Aria.$window.document;
            // This will prevent text selection on IE on the element
            element.onselectstart = Aria.returnFalse;
            document.onselectstart = Aria.returnFalse;
            this._setElementStyle(element);
            this._setBoundary();
            movable = this.getMovable();
            if (movable) {
                // This will prevent text selection on IE on the movable
                movable.onselectstart = Aria.returnFalse;
                this._movableInitialGeometry = aria.utils.Dom.getGeometry(movable);
                this._movableGeometry = aria.utils.Json.copy(this._movableInitialGeometry);
                this._baseMovableOffset = {
                    left : this._movableGeometry.x - movable.offsetLeft,
                    top : this._movableGeometry.y - movable.offsetTop,
                    height : this._movableGeometry.height - movable.offsetHeight,
                    width : this._movableGeometry.width - movable.offsetWidth
                };
                this.$raiseEvent("beforeresize");
            }
        },
        /**
         * Handle the mouse move during a drag by setting the correct position on the resize handle element. It will
         * Raise the resize event
         * @param {aria.DomEvent} evt
         */
        move : function (evt) {

            var movable = this.getMovable();
            if (movable && movable.style) {
                var mouseInitPos = this._mouseInitialPosition;
                var movableInitPos = this._movableInitialGeometry;

                var offsetX = this._vertical ? 0 : evt.clientX - mouseInitPos.left;
                var offsetY = this._horizontal ? 0 : evt.clientY - mouseInitPos.top;
                var geometry = aria.utils.Json.copy(movableInitPos), dw, dh;

                geometry = this._resizeWitHandlers(geometry, this.cursor, offsetX, offsetY);

                var chkWidth = /sw-resize|nw-resize|w-resize/.test(this.cursor), chkHeight = /nw-resize|ne-resize|n-resize/.test(this.cursor), minWidth = geometry.width < this.minWidth, minHeight = geometry.height < this.minHeight;

                if (minWidth) {
                    geometry.width = this.minWidth;
                }
                if (minHeight) {
                    geometry.height = this.minHeight;
                }

                dw = this._movableGeometry.x + this._movableGeometry.width;
                dh = this._movableGeometry.y + this._movableGeometry.height;
                if (minWidth && chkWidth) {
                    geometry.x = dw - this.minWidth;
                }
                if (minHeight && chkHeight) {
                    geometry.y = dh - this.minHeight;
                }
                // for resizing the dialog
                movable.style.cursor = this.cursor;
                movable.style.top = (geometry.y - this._baseMovableOffset.top) + "px";
                movable.style.left = (geometry.x - this._baseMovableOffset.left) + "px";
                movable.style.height = (geometry.height - this._baseMovableOffset.height) + "px";
                movable.style.width = (geometry.width - this._baseMovableOffset.width) + "px";

                this.posY = mouseInitPos.top + geometry.y - movableInitPos.y;
                this.posX = mouseInitPos.left + geometry.x - movableInitPos.x;
                this._movableGeometry = geometry;
                this.$raiseEvent("resize");
            }
        },
        /**
         * Handle the resize end. Apply the correct positioning to the height and width to the resizable element
         */
        end : function () {
            var element = this.getElement();
            element.onselectstart = Aria.returnTrue;

            if (this.proxy && this.proxy.overlay) {
                element.style.top = (this._elementInitialPosition.top + this._movableGeometry.y - this._movableInitialGeometry.y)
                        + "px";
                element.style.left = (this._elementInitialPosition.left + this._movableGeometry.x - this._movableInitialGeometry.x)
                        + "px";

                element.style.height = (this._elementInitialPosition.height + this._movableGeometry.height - this._movableInitialGeometry.height)
                        + "px";
                element.style.width = (this._elementInitialPosition.width + this._movableGeometry.width - this._movableInitialGeometry.width)
                        + "px";
                this.proxy.$dispose();
                this.proxy = null;
            }
            this.$raiseEvent("resizeend");
        },

        /**
         * Calculates the top, left position and size of the resizable element and new position of resize cursor.
         * @param {Object} geometry initial position and size of the resizable element
         * @param {String} cursor css class of resizable handle element
         * @param {Number} offX left position which resizable handle element has moved from its initial.
         * @param {Number} offY top position which resizable handle element has moved from its initial.
         * @return {Object} new position of resized and resize handle element
         */
        _resizeWitHandlers : function (geometry, cursor, offX, offY) {
            var geometry = aria.utils.Json.copy(geometry), trim = aria.utils.String.trim;
            cursor = trim(cursor);
            var offsetX = geometry.width >= this.minWidth ? offX : 0;
            var offsetY = geometry.height >= this.minHeight ? offY : 0;

            switch (cursor) {
                case "n-resize" :
                    geometry.y += offsetY;
                    geometry.height -= offsetY;
                    geometry = this._fitResizeBoundary(geometry);
                    break;
                case "ne-resize" :
                    geometry.y += offsetY;
                    geometry.height -= offsetY;
                    geometry.width += offsetX;
                    geometry = this._fitResizeBoundary(geometry);
                    break;
                case "nw-resize" :
                    geometry.x += offsetX;
                    geometry.y += offsetY;
                    geometry.height -= offsetY;
                    geometry.width -= offsetX;
                    geometry = this._fitResizeBoundary(geometry);
                    break;
                case "s-resize" :
                    geometry.height += offsetY;
                    geometry = this._fitResizeBoundary(geometry);
                    break;
                case "se-resize" :
                    geometry.height += offsetY;
                    geometry.width += offsetX;
                    geometry = this._fitResizeBoundary(geometry);
                    break;
                case "sw-resize" :
                    geometry.x += offsetX;
                    geometry.height += offsetY;
                    geometry.width -= offsetX;
                    geometry = this._fitResizeBoundary(geometry);
                    break;
                case "e-resize" :
                    geometry.width += offsetX;
                    geometry = this._fitResizeBoundary(geometry);
                    break;
                case "w-resize" :
                    geometry.x += offsetX;
                    geometry.width -= offsetX;
                    geometry = this._fitResizeBoundary(geometry);
                    break;
            }
            return geometry;
        },
        /**
         * Fits the resized element within viewport
         * @param {aria.utils.DomBeans:Geometry} geometry
         * @return {aria.utils.DomBeans:Geometry} fitted geometry
         */

        _fitResizeBoundary : function (geometry) {
            var boundary = this._boundary;
            if (boundary) {
                var ariaUtilsDom = aria.utils.Dom;
                var boundaryGeometry = boundary;
                if (boundary == ariaUtilsDom.VIEWPORT) {
                    var viewportSize = ariaUtilsDom._getViewportSize();
                    boundaryGeometry = {
                        x: 0,
                        y: 0,
                        width: viewportSize.width,
                        height: viewportSize.height
                    };
                }
                var deltaLeft = geometry.x - boundaryGeometry.x;
                var deltaTop = geometry.y - boundaryGeometry.y;
                var deltaRight = boundaryGeometry.x + boundaryGeometry.width - geometry.x - geometry.width;
                var deltaBottom = boundaryGeometry.y + boundaryGeometry.height - geometry.y - geometry.height;
                if (deltaLeft < 0) {
                    geometry.x -= deltaLeft;
                    geometry.width += deltaLeft;
                }
                if (deltaTop < 0) {
                    geometry.y -= deltaTop;
                    geometry.height += deltaTop;
                }
                if (deltaRight < 0) {
                    geometry.width += deltaRight;
                }
                if (deltaBottom < 0) {
                    geometry.height += deltaBottom;
                }
            }
            return geometry;
        },
        /**
         * Compute the initial position and initial size of the element and set its style properties
         * @protected
         * @param {HTMLElement} element
         */
        _setElementStyle : function (element) {
            var position = aria.utils.Dom.getOffset(element);
            position.width = element.offsetWidth;
            position.height = element.offsetHeight;
            var style = element.style;
            this._elementInitialPosition = position;
            style.position = "absolute";
            style.left = position.left + "px";
            style.top = position.top + "px";
            style.height = position.height + "px";
            style.width = position.width + "px";
        }

    }
});

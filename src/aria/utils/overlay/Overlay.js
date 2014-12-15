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
var Aria = require("../../Aria");
var ariaUtilsDom = require("../Dom");


/**
 * This class creates an overlay and keeps it positioned above a given HTML element
 * @class aria.utils.overlay.Overlay
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.overlay.Overlay',
    $constructor : function (element, params) {
        var overlay = this._createOverlay(params);

        /**
         * Overlay HTML Element
         * @type HTMLElement
         */
        this.overlay = overlay;

        /**
         * Element on which the overlay is applied
         * @type HTMLElement
         */
        this.element = element;

        this._appendToDOM(overlay);
        this._setInPosition(element, overlay);
        this._computeZIndex(element, overlay);
    },
    $destructor : function () {
        this.overlay.parentNode.removeChild(this.overlay);
        this.overlay = null;
        this.element = null;
    },
    $prototype : {
        /**
         * Creates DIV element to act as the overlay
         * @param {Object} params Configuration object
         *
         * <pre>
         * {
         * type : Element type, default div,
         * id : Overlay id,
         * className : Overlay's classname, default xOverlay
         * position : Style position, default fixed
         * }
         * </pre>
         *
         * @return {HTMLElement}
         * @protected
         */
        _createOverlay : function (params) {
            var document = Aria.$window.document;
            var overlay = document.createElement(params.type || "div");
            if (params.id) {
                overlay.id = "xOverlay" + params.id;
            }
            overlay.className = params.className || "xOverlay";

            // absolute positioning is preferred over fixed since Safari Mobile doesn't repaint fixed elements on scroll
            var position = params.position || "absolute";

            // Place it in the top-left corner of the page, otherwise if it happens to be inserted far in the DOM, it
            // may temporarily create unnecessary scrollbars on the page - this may affect proper positioning of the
            // overlay. We'll set left/top later.
            overlay.style.left = 0;
            overlay.style.top = 0;
            overlay.style.position = position;

            return overlay;
        },

        /**
         * Appends Overlay to DOM. The element is always added to the DOM and its position is refreshed on scroll
         * @param {HTMLElement} overlay Overlay element
         * @protected
         */
        _appendToDOM : function (overlay) {
            var document = Aria.$window.document;
            document.body.appendChild(overlay);
        },

        /**
         * Calculate the Geometry/Position for the overlay
         * @param {HTMLElement} element DOM element to apply the overlay
         * @param {HTMLElement} overlay DOM element of the overlay
         * @protected
         */
        _setInPosition : function (element, overlay) {
            var dom = ariaUtilsDom;
            var overlayStyle = overlay.style;
            var positions = ["Top", "Right", "Bottom", "Left"], singleBorder, border = {};
            for (var i = 0, posCount = positions.length; i < posCount; i++) {
                singleBorder = dom.getStyle(overlay, "border" + positions[i] + "Width").split("px")[0];
                border[positions[i].toLowerCase()] = singleBorder ? +singleBorder : 0;
            }
            var geometry = ariaUtilsDom.getGeometry(element);
            if (geometry) {
                overlayStyle.position = "absolute";
                var scroll = dom.getDocumentScrollElement();
                overlayStyle.top = geometry.y + scroll.scrollTop + "px";
                overlayStyle.left = geometry.x + scroll.scrollLeft + "px";
                overlayStyle.width = (geometry.width - border.left - border.right) + "px";
                overlayStyle.height = (geometry.height - border.top - border.bottom) + "px";
                overlayStyle.display = "block";
            }
        },

        /**
         * Apply a zIndex to the overlay
         * @param {HTMLElement} element Reference zIndex
         * @param {HTMLElement} overlay DOM element of the overlay
         * @protected
         */
        _computeZIndex : function (element, overlay) {
            var document = Aria.$window.document;
            var zIndex = 20000, stopper = document.body;

            // inspect parent z-Indexes
            while (element && element != stopper) {
                var style = element.style, elementZIndex = style.zIndex;
                if (elementZIndex) {
                    var intZIndex = parseInt(elementZIndex, 10);
                    if (intZIndex > zIndex) {
                        zIndex = intZIndex + 1;
                    }
                }
                element = element.parentNode;
            }

            // set zindex to maximum value from parents
            overlay.style.zIndex = "" + zIndex;

        },

        /**
         * Refresh the position of the overlay
         */
        refreshPosition : function () {
            this._setInPosition(this.element, this.overlay);
        },

        /**
         * Refresh the position and the z-index of the overlay
         */
        refresh : function () {
            this._setInPosition(this.element, this.overlay);
            this._computeZIndex(this.element, this.overlay);

        }
    }
});

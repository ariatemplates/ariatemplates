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

var Environment = require("../../core/environment/Environment");



/**
 * This class creates an overlay and keeps it positioned above a given HTML element
 * @class aria.utils.overlay.Overlay
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.overlay.Overlay',

    /**
     * <p>The options object contains the following properties: </p>
     * <ul>
     *  <li><em>waiAria</em>: activate waiAria or not; global setting is also taken into account</li>
     * </ul>
     *
     * @param {HTMLElement} element The element to put the overlay on
     * @param {Object} params Object to forward to the _createOverlay method, called by this constructor
     * @param {Object} options The optional options, see description for more details.
     */
    $constructor : function (element, params, options) {
        /**
         * Element on which the overlay is applied
         * @type HTMLElement
         */
        this.element = element;

        if (options == null) {
            options = {};
        }

        var waiAria = options.waiAria;
        if (waiAria == null) {
            waiAria = Environment.isWaiAria();
        }
        this._waiAria = waiAria;

        var overlay = this._createOverlay(params);

        /**
         * Overlay HTML Element
         * @type HTMLElement
         */
        this.overlay = overlay;

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
                singleBorder = + dom.getStyle(overlay, "border" + positions[i] + "Width").split("px")[0];
                border[positions[i].toLowerCase()] = isNaN(singleBorder) ? 0 : singleBorder;
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
         *
         * <p>Resources: </p>
         * <ul>
         *   <li><a href="http://www.cssmojo.com/everything_you_always_wanted_to_know_about_z-index_but_were_afraid_to_ask/">Find out how elements stack and start using low z-index values</a></li>
         *   <li><a href="https://philipwalton.com/articles/what-no-one-told-you-about-z-index/">What No One Told You About Z-Index — Philip Walton</a></li>
         * </ul>
         * @param {HTMLElement} element Reference zIndex
         * @param {HTMLElement} overlay DOM element of the overlay
         * @protected
         */
        _computeZIndex : function (element, overlay) {
            // --------------------------------------------------- destructuring

            var window = Aria.$window;
            var document = window.document;
            var body = document.body;

            // ------------------------------------------------- local functions

            function getStyle(element, property) {
                return ariaUtilsDom.getStyle(element, property);
            }

            function getZIndex(element) {
                return getStyle(element, 'zIndex');
            }

            function createsANewStackingContext(element) {
                var zIndex = getZIndex(element);
                var position = getStyle(element, 'position');
                var opacity = getStyle(element, 'opacity');

                return (opacity < 1) || ((zIndex !== 'auto') && (position !== 'static'));
            }

            // ------------------------------------------------------ processing

            var zIndexToBeat = null;

            // building parent branch ------------------------------------------

            var ancestors = [];
            var currentElement = element;
            while (currentElement !== body && currentElement != null) {
                ancestors.unshift(currentElement);
                currentElement = currentElement.parentNode;
            }

            // checking parent branch ------------------------------------------
            // only the first (top-most) parent has to be taken into account, further children then being contained in its new stacking context

            for (var index = 0, length = ancestors.length; index < length; index++) {
                var potentialStackingContextRoot = ancestors[index];

                if (createsANewStackingContext(potentialStackingContextRoot)) {
                    zIndexToBeat = getZIndex(potentialStackingContextRoot);
                    break;
                }
            }

            // checking children if necessary ----------------------------------

            if (zIndexToBeat == null) {
                var getMax = function(values) {
                    return values.length === 0 ? null : Math.max.apply(Math, values);
                };

                var isANumber = function(value) {
                    return !isNaN(value);
                };

                var stackingContexts = [];

                var findChildrenCreatingANewStackingContext = function(root) {
                    var children = root.children;

                    for (var index = 0, length = children.length; index < length; index++) {
                        var child = children[index];

                        if (createsANewStackingContext(child)) {
                            stackingContexts.push(child);
                        } else {
                            findChildrenCreatingANewStackingContext(child);
                        }
                    }
                };

                findChildrenCreatingANewStackingContext(element);

                var zIndexes = [];
                for (var index = 0, length = stackingContexts.length; index < length; index++) {
                    var stackingContext = stackingContexts[index];

                    var currentZIndex = getZIndex(stackingContext);
                    if (isANumber(currentZIndex)) {
                        zIndexes.push(currentZIndex);
                    }
                }
                zIndexToBeat = getMax(zIndexes);
            }

            // final zindex application ----------------------------------------
            // Our overlay element is put at last in the DOM, so if there is no other stacking context found, there is no need to put a zIndex ourselves since the natural stacking order will apply.
            // However, still due to the natural stacking order applied within a same stacking context, there's no need to put a higher zIndex than the top-most stacking context's root, putting the same is sufficient

            if (zIndexToBeat !== null) {
                overlay.style.zIndex = '' + zIndexToBeat;
            }
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

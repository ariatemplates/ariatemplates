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
var ariaUtilsOverlayOverlay = require("./Overlay");
var ariaCoreBrowser = require("../../core/Browser");
var ariaUtilsEvent = require("../Event");

/**
 * This class creates an overlay and keeps it positioned above a given HTML element
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.overlay.LoadingOverlay",
    $extends : ariaUtilsOverlayOverlay,
    $constructor : function (element, overlayId, text) {
        // This is used by the parent constructor.
        this.__text = text;

        this.$Overlay.constructor.call(this, element, {
            id : overlayId,
            className : "xLDI"
        });

        var browser = aria.core.Browser;
        // fix 08364518 : if IE<9, the scroll event on an element does not bubble up and trigger the handler
        // attached to the window
        if (browser.isIE8 || browser.isIE7 || browser.isIE6) {
            this._scrollRecListener = true;
            ariaUtilsEvent.addListenerRecursivelyUp(this.element, "scroll", {
                fn : this.refreshPosition,
                scope : this
            }, true, function (element) {
                return element.style && element.style.overflow != "hidden";
            });
        }
    },
    $destructor : function () {
        if (this._scrollRecListener) {
            ariaUtilsEvent.removeListenerRecursivelyUp(this.element, "scroll", {
                fn : this.refreshPosition,
                scope : this
            });
            this._scrollRecListener = false;
        }
        this.$Overlay.$destructor.call(this);
    },
    $prototype : {
        /**
         * Creates DIV element to act as the overlay
         * @param {Object} params Configuration object
         * @return {HTMLElement}
         * @protected
         * @override
         */
        _createOverlay : function (params) {
            var overlay = this.$Overlay._createOverlay.call(this, params);

            if (this.__text) {
                overlay.innerHTML = "<span class='xLDI-text'>" + this.__text + "</span>";
            }

            return overlay;
        },

        /**
         * Appends Overlay to DOM. The element is always added to the DOM and it's position is refreshed on scroll
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
            var geometry = aria.utils.Dom.getGeometry(element);
            var viewportSize = aria.utils.Dom.getViewportSize();
            var overlayGeometry = null;

            if (geometry) {
                if (overlay.style.position == "absolute") {
                    // geometry is relative to viewport
                    var documentScroll = aria.utils.Dom._getDocumentScroll();
                    overlayGeometry = {
                        x : Math.max(geometry.x + documentScroll.scrollLeft, 0),
                        y : Math.max(geometry.y + documentScroll.scrollTop, 0)
                    };
                } else { // fixed
                    overlayGeometry = {
                        x : Math.max(geometry.x, 0),
                        y : Math.max(geometry.y, 0)
                    };
                }

                overlayGeometry.width = Math.min(geometry.width + Math.min(geometry.x, 0), viewportSize.width
                        - overlayGeometry.x);
                overlayGeometry.height = Math.min(geometry.height + Math.min(geometry.y, 0), viewportSize.height
                        - overlayGeometry.y);
            }

            var style = overlay.style;
            // geometry may be null if the element is not currently visible
            if (overlayGeometry && overlayGeometry.height > 0 && overlayGeometry.width > 0) {
                style.top = overlayGeometry.y + "px";
                style.left = overlayGeometry.x + "px";
                style.width = overlayGeometry.width + "px";
                style.height = overlayGeometry.height + "px";
                style.display = "block";
                var browser = ariaCoreBrowser;
                if (browser.isIE && browser.majorVersion < 9 && overlay.firstChild) {
                    overlay.firstChild.style.top = Math.round(overlayGeometry.height / 2) + "px";
                }
            } else {
                style.display = "none";
            }
        }
    }
});

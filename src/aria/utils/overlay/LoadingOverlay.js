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
var ariaUtilsType = require("../Type");
var ariaUtilsFunction = require("../Function");
var ariaUtilsAccessibility = require("../Accessibility");
var ariaUtilsDomNavigationManager = require("../DomNavigationManager");



/**
 * This class creates an overlay and keeps it positioned above a given HTML element
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.overlay.LoadingOverlay",
    $extends : ariaUtilsOverlayOverlay,
    /**
     * Creates a loading overlay above a DOM Element.
     *
     * <p>The options object contains the following properties: </p>
     * <ul>
     *  <li><em>message</em>: the message to display</li>
     *  <li><em>waiAria</em>: forwarded to the parent constructor</li>
     *  <li><em>waiAriaReadInterval</em>: when waiAria is activated, the interval (in milliseconds) at which to read the message. Defaults to 2000.</li>
     *  <li><em>waiAriaReadOnceFirst</em>: when waiAria is activated, whether to read the message once first or not. Defaults to <em>true</em>.</li>
     * </ul>
     *
     * @param {HTMLElement} element The element that should be hidden by an overlay
     * @param {String} overlayId The id of the overlay
     * @param {Object|String} options The optional options, see description for more details. If a string is passed directly it is assumed to be the message.
     */
    $constructor : function (element, overlayId, options) {
        // ------------------------------------------ input arguments processing

        if (options == null) {
            options = {};
        }

        if (ariaUtilsType.isString(options)) {
            options = {message: options};
        }

        var waiAria = options.waiAria;

        var message = options.message;
        this.__text = message;

        var waiAriaReadInterval = options.waiAriaReadInterval;
        if (waiAriaReadInterval == null) {
            waiAriaReadInterval = 2000;
        }
        this._waiAriaReadInterval = waiAriaReadInterval;

        var waiAriaReadOnceFirst = options.waiAriaReadOnceFirst;
        if (waiAriaReadOnceFirst == null) {
            waiAriaReadOnceFirst = true;
        }
        this._waiAriaReadOnceFirst = waiAriaReadOnceFirst;

        // ---------------------------------------------------------- processing

        this.$Overlay.constructor.call(this, element, {
            id : overlayId,
            className : "xLDI"
        }, {
            waiAria: waiAria
        });

        var browser = aria.core.Browser;
        // fix 08364518 : if IE<9, the scroll event on an element does not bubble up and trigger the handler
        // attached to the window
        if (browser.isIE8 || browser.isIE7) {
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

        if (this._waiAriaReadIntervalId != null) {
            clearInterval(this._waiAriaReadIntervalId);
            this._waiAriaReadIntervalId = null;
        }

        if (this._showElementBack != null) {
            this._showElementBack();
            this._showElementBack = null;
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
            var element = this.element;
            var text = this.__text;
            var waiAria = this._waiAria;
            var waiAriaReadInterval = this._waiAriaReadInterval;
            var waiAriaReadOnceFirst = this._waiAriaReadOnceFirst;

            var overlay = this.$Overlay._createOverlay.call(this, params);

            if (waiAria) {
                this._showElementBack = ariaUtilsDomNavigationManager.hidingManager.hide(element);
            }

            if (text) {
                overlay.innerHTML = waiAria ?
                    "<span class='xLDI-text' aria-live='polite'>" + text + "</span>" :
                    "<span class='xLDI-text'>" + text + "</span>";

                if (waiAria) {
                    if (waiAriaReadOnceFirst) {
                        this._readText();
                    }
                    this._waiAriaReadIntervalId = setInterval(ariaUtilsFunction.bind(this._readText, this), waiAriaReadInterval);
                }
            }

            return overlay;
        },

        _readText : function () {
            ariaUtilsAccessibility.readText(this.__text, {
                parent: this.element
            });
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
                var width1, width2, height1, height2;

                var overlayGeometryViewportRelative = {
                    x : Math.max(geometry.x, 0),
                    y : Math.max(geometry.y, 0)
                };
                if (overlay.style.position == "absolute") {
                    // geometry is relative to viewport
                    // overlayGeometry will be relative to the page!
                    var documentScroll = aria.utils.Dom._getDocumentScroll();
                    overlayGeometry = {
                        x : Math.max(geometry.x, 0) + documentScroll.scrollLeft,
                        y : Math.max(geometry.y, 0) + documentScroll.scrollTop
                    };
                } else { // fixed
                    // geometry is relative to viewport
                    // overlayGeometry will be relative to the viewport too
                    overlayGeometry = overlayGeometryViewportRelative;
                }

                // "cut-off" the overlay if the element stands out of the viewport to the left / top
                width1 = geometry.width + Math.min(geometry.x, 0);
                height1 = geometry.height + Math.min(geometry.y, 0);

                // "cut-off" the overlay if the element stands out of the viewport to the right / bottom
                width2 = viewportSize.width - overlayGeometryViewportRelative.x;
                height2 = viewportSize.height - overlayGeometryViewportRelative.y;

                overlayGeometry.width = Math.min(width1, width2);
                overlayGeometry.height = Math.min(height1, height2);
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

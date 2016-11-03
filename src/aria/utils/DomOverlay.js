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
var ariaUtilsOverlayLoadingOverlay = require("./overlay/LoadingOverlay");
var ariaUtilsType = require("./Type");
var ariaUtilsEvent = require("./Event");
var ariaUtilsAriaWindow = require("./AriaWindow");
var ariaTemplatesLayout = require("../templates/Layout");

/**
 * This class contains utilities to show and hide a loading indicator above a DOM Element
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.DomOverlay",
    $singleton : true,
    $statics : {
        UNIQUE_ID_GENERATOR : 12
    },
    $constructor : function () {
        /**
         * List of overlays objects
         * @type Object
         *
         * <pre>
         * {
         *     uniqueId : aria.utils.overlay.LoadingOverlay
         * }
         * </pre>
         */
        this.overlays = null;

        /**
         * Number of overlay objects in overlays.
         * @type Number
         */
        this._nbOverlays = 0;

        /**
         * Keep the overlay above the body in a special place since there's no need to destroy it on refresh
         * @type aria.utils.overlay.LoadingOverlay
         */
        this.bodyOverlay = null;

        ariaUtilsAriaWindow.$on({
            "unloadWindow" : this._reset,
            scope : this
        });
    },
    $destructor : function () {
        this._reset();
        ariaUtilsAriaWindow.$unregisterListeners(this);
    },
    $prototype : {
        /**
         * If it is not done already, notifies AriaWindow that we are starting to use Aria.$window, and registers the
         * scroll event listener.
         */
        _init : function () {
            if (this.overlays == null) {
                this.overlays = {};
                ariaUtilsAriaWindow.attachWindow();

                // Listen for scroll event to update the position of the overlay
                ariaUtilsEvent.addListener(Aria.$window, "scroll", {
                    fn : this.__refresh,
                    scope : this
                }, true);
                ariaTemplatesLayout.$on({
                    "viewportResized" : this.__refresh,
                    scope : this
                });
            }
        },

        /**
         * If it is not done already, unregisters the scroll event listener and notifies AriaWindow that we are no
         * longer using Aria.$window.
         */
        _reset : function () {
            if (this.overlays != null) {
                ariaUtilsEvent.removeListener(Aria.$window, "scroll", {
                    fn : this.__refresh
                });
                ariaTemplatesLayout.$removeListeners({
                    "viewportResized" : this.__refresh,
                    scope : this
                });
                ariaUtilsAriaWindow.detachWindow();
                this.overlays = null;
                this._nbOverlays = 0;
            }
        },

        /**
         * Create a DomOverlay above a DOM Element. This function should only be used for elements outside a template or a section.
         *
         * @param {HTMLElement} element See aria.utils.overlay.LoadingOverlay
         * @param {Object|String} options See aria.utils.overlay.LoadingOverlay
         */
        create : function (element, options) {
            // Check if there is already an overlay on this element
            var overlay = this.__getOverlay(element);
            if (overlay) {
                overlay.overlay.refresh();
                return overlay.id;
            }

            // Generate an id for that
            var id = ++this.UNIQUE_ID_GENERATOR;

            // Create the overlay
            overlay = new ariaUtilsOverlayLoadingOverlay(element, id, options);

            this._init(); // check it is initialized

            // Store the overlay internally
            if (element !== Aria.$window.document.body) {
                this.overlays[id] = overlay;
                this._nbOverlays++;

                // Store the id on the element expando
                element.__overlay = id;
            } else {
                this.bodyOverlay = overlay;
            }

            return id;
        },

        /**
         * Detach an overlay from a DOM Element
         * @param {HTMLElement} element The element with an overlay to detach
         */
        detachFrom : function (element) {
            var overlayInfo = this.__getOverlay(element);

            if (!overlayInfo) {
                return;
            }

            // Dispose the overlay
            overlayInfo.overlay.$dispose();
            var id = overlayInfo.id;

            // Remove any pointer
            if (element === Aria.$window.document.body) {
                this.bodyOverlay = null;
            } else {
                delete this.overlays[id];
                this._nbOverlays--;
            }

            overlayInfo = null;

            if (this._nbOverlays === 0 && this.bodyOverlay == null) {
                this._reset();
            }

            return id;
        },

        /**
         * Get the information about an overlay
         * @private
         * @param {HTMLElement} element
         * @return {Object}
         *
         * <pre>
         * {overlay: Overlay object, id : unique verlay id}
         * </pre>
         */
        __getOverlay : function (element) {
            if (element === Aria.$window.document.body) {
                return !this.bodyOverlay ? null : {
                    overlay : this.bodyOverlay
                };
            } else {
                // Get the overlay object
                var id = element.__overlay;

                if (!id || this.overlays == null) {
                    return;
                }

                var overlay = this.overlays[id];

                if (!overlay) {
                    element.__overlay = null;
                    return;
                }

                return {
                    overlay : overlay,
                    id : id
                };
            }
        },

        /**
         * Refresh the position of the overlays
         * @private
         */
        __refresh : function () {
            // Refresh any open overlay
            this.$assert(184, this.overlays != null);
            var overlays = this.overlays;
            for (var key in overlays) {
                if (overlays.hasOwnProperty(key)) {
                    var overlay = overlays[key];
                    overlay.refreshPosition();
                }
            }
            if (this.bodyOverlay) {
                this.bodyOverlay.refreshPosition();
            }
        },

        /**
         * Dispose a list of overlays specified by their unique identifier
         * @param {Array} ids Array of overlay id
         */
        disposeOverlays : function (ids) {
            if (!ariaUtilsType.isArray(ids) || this.overlays == null) {
                return;
            }
            for (var i = 0, len = ids.length; i < len; i += 1) {
                var overlay = this.overlays[ids[i]];

                if (overlay) {
                    overlay.$dispose();
                    delete this.overlays[ids[i]];
                    this._nbOverlays--;
                }
            }
            if (this._nbOverlays === 0 && this.bodyOverlay == null) {
                this._reset();
            }
        }
    }
});

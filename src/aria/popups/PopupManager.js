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

    // shortcuts
    var utilsArray = null;
    var utilsDom = null;
    var utilsEvent = null;

    /**
     * Singleton dedicated to popup management
     * @singleton
     */
    Aria.classDefinition({
        $classpath : "aria.popups.PopupManager",
        $dependencies : ["aria.DomEvent", "aria.utils.Event", "aria.utils.Array", "aria.utils.Dom", "aria.utils.Math",
                "aria.templates.NavigationManager", "aria.utils.AriaWindow"],
        $events : {
            "modalPopupPresent" : {
                description : "Notifies that a modal popup has been opened when no other modal popup was already opened."
            },
            "modalPopupAbsent" : {
                description : "Notifies that a modal popup has been closed when no other modal popup remains open."
            },
            "popupOpen" : {
                description : "Notifies that a popup has been opened.",
                properties : {
                    popup : "Reference to the popup"
                }
            },
            "popupClose" : {
                description : "Notifies that a popup has been closed",
                properties : {
                    popup : "Reference to the popup"
                }
            }
        },
        $onload : function () {
            utilsArray = aria.utils.Array;
            utilsDom = aria.utils.Dom;
            utilsEvent = aria.utils.Event;
        },
        $onunload : function () {
            utilsArray = null;
            utilsDom = null;
            utilsEvent = null;
        },
        $singleton : true,
        $constructor : function () {
            /**
             * Array containing the aria.popups.Popup managed by the popup manager
             * @type Array
             */
            this.openedPopups = [];

            /**
             * Number of modal popups in openedPopups
             * @type Number
             */
            this.modalPopups = 0;

            /**
             * Array containing the aria.popups.Popup managed by the popup manager
             * @type Array
             */
            this.popups = [];

            /**
             * Used for start and reinitialization of zIndex
             * @type Number
             */
            this.baseZIndex = 20000;

            /**
             * zIndex used to create a new popup. Start value is 20000 not to conflict with AriaJSP (consequence is that
             * AT popup will always be above AriaJSP popup until a common dialog manager is developped)
             * @type Number
             */
            this.currentZIndex = this.baseZIndex;

            aria.utils.AriaWindow.$on({
                "unloadWindow" : this._reset,
                scope : this
            });
        },

        $destructor : function () {
            aria.utils.AriaWindow.$unregisterListeners(this);
            this._reset();
        },

        $prototype : {

            /**
             * Resets the popup manager (especially, this is done on page navigation inside Aria.$window).
             */
            _reset : function () {
                this._closeAllPopups();
                this._unregisterAllPopups();
                this.disconnectEvents();
            },

            /**
             * Close all opened popups
             * @protected
             */
            _closeAllPopups : function () {
                for (var i = this.openedPopups.length - 1; i >= 0; i--) {
                    var popup = this.openedPopups[i];
                    popup.close();
                }
            },

            /**
             * Check if an event happen in the box a a popup
             * @protected
             * @param {aria.DomEvent} domEvent
             * @param {aria.popups.Popup} popup
             * @return {Boolean}
             */
            _isEventInsidePopup : function (domEvent, popup) {
                var documentScroll = aria.utils.Dom._getDocumentScroll();
                var clickPosition = {
                    'top' : domEvent.clientY + documentScroll.scrollTop,
                    'left' : domEvent.clientX + documentScroll.scrollLeft
                };

                var popupPosition = {
                    'top' : popup.computedStyle.top,
                    'left' : popup.computedStyle.left
                };

                var popupSize = {
                    'width' : popup.computedStyle.width,
                    'height' : popup.computedStyle.height
                };
                return (clickPosition.top >= popupPosition.top && clickPosition.left >= popupPosition.left
                        && clickPosition.top <= popupPosition.top + popupSize.height && clickPosition.left <= popupPosition.left
                        + popupSize.width);
            },

            /**
             * Unregister all popups
             * @protected
             */
            _unregisterAllPopups : function () {
                for (var i = this.popups.length - 1; i >= 0; i--) {
                    var popup = this.popups[i];
                    this.unregisterPopup(popup);
                }
            },

            /**
             * Connect or reconnect global events on the document
             */
            connectEvents : function () {
                this.disconnectEvents();
                aria.utils.AriaWindow.attachWindow();
                this._document = Aria.$window.document;
                utilsEvent.addListener(this._document, "mousedown", {
                    fn : this.onDocumentClick,
                    scope : this
                }, true);
                utilsEvent.addListener(this._document, "mouseout", {
                    fn : this.onDocumentMouseOut,
                    scope : this
                }, true);
                utilsEvent.addListener(this._document, "mousewheel", {
                    fn : this.onDocumentMouseScroll,
                    scope : this
                }, true);
                if (aria.core.Browser.isIE) {
                    // IE does not support scroll event on the document until IE9
                    aria.utils.Event.addListener(Aria.$window, "mousewheel", {
                        fn : this._onScroll,
                        scope : this
                    }, true);

                } else {
                    // All other browsers support scroll event on the document
                    aria.utils.Event.addListener(Aria.$window, "scroll", {
                        fn : this._onScroll,
                        scope : this
                    }, true);
                }
            },

            /**
             * Disconnect global events on the document
             */
            disconnectEvents : function () {
                if (this._document) {
                    utilsEvent.removeListener(this._document, "mousedown", {
                        fn : this.onDocumentClick
                    });
                    utilsEvent.removeListener(this._document, "mouseout", {
                        fn : this.onDocumentMouseOut
                    });
                    utilsEvent.removeListener(this._document, "mousewheel", {
                        fn : this.onDocumentMouseScroll
                    });
                    aria.utils.AriaWindow.detachWindow();
                    this._document = null;
                    if (aria.core.Browser.isIE) {
                        aria.utils.Event.removeListener(Aria.$window, "mousewheel", {
                            fn : this._onScroll
                        });
                    } else {
                        aria.utils.Event.removeListener(Aria.$window, "scroll", {
                            fn : this._onScroll
                        });
                    }
                }
            },

            /**
             * Connect events specific to modal popups.
             */
            connectModalEvents : function () {
                utilsEvent.addListener(this._document.body, "focusin", {
                    fn : this.onDocumentFocusIn,
                    scope : this
                });
            },

            /**
             * Disconnect events specific to modal popups.
             */
            disconnectModalEvents : function () {
                utilsEvent.removeListener(this._document.body, "focusin", {
                    fn : this.onDocumentFocusIn
                });
            },

            /**
             * handles the scroll for the popup
             * @param {Object} Event that triggered the scroll.
             */
            _onScroll : function (event) {
                for (var i = this.openedPopups.length - 1; i >= 0; i--) {
                    var popup = this.openedPopups[i];
                    if (event.type === "mousewheel") {
                        aria.core.Timer.addCallback({
                            fn : popup._isScrolling,
                            scope : popup
                        });
                    } else if (event.type === "scroll") {
                        popup._isScrolling();
                    }
                }
            },

            /**
             * Return the Zindex of a given popup
             * @param {aria.popups.Popup} popup
             * @return {Number}
             */
            getZIndexForPopup : function (popup) {
                this.currentZIndex += 10;
                return this.currentZIndex;
            },

            /**
             * Hide a given popup
             * @param {aria.popups.Popup} The popup to hide
             */
            hide : function (popup) {
                popup.close();
                popup.$dispose();
            },

            /**
             * Callback after the focus is put on an element in the document, when a modal popup is displayed.
             * @param {Object} event The DOM focusin event triggering the callback
             */
            onDocumentFocusIn : function (event) {
                var domEvent = new aria.DomEvent(event);
                var target = domEvent.target;
                var searchModal = target != this._document.body;
                if (searchModal) {
                    for (var i = this.openedPopups.length - 1; i >= 0; i--) {
                        var popup = this.openedPopups[i];
                        if (utilsDom.isAncestor(target, popup.getDomElement())) {
                            // the element is in the modal popup, it is fine to focus it
                            break;
                        }
                        if (popup.modalMaskDomElement) {
                            aria.templates.NavigationManager.focusFirst(popup.domElement);
                            break;
                        }
                    }
                }
                domEvent.$dispose();
            },

            /**
             * Callback when the user clicks on the document
             * @param {Object} event The DOM click event triggering the callback
             */
            onDocumentClick : function (event) {
                var domEvent = /** @type aria.DomEvent */
                new aria.DomEvent(event), target = /** @type HTMLElement */
                domEvent.target;

                if (this.openedPopups.length === 0) {
                    domEvent.$dispose();
                    return;
                }

                // restrict this to the popup on the top
                var popup = /** @type aria.popups.Popup */
                this.openedPopups[this.openedPopups.length - 1];

                var ignoreClick = false;
                for (var j = 0, length = popup._ignoreClicksOn.length; j < length; j++) {
                    if (utilsDom.isAncestor(target, popup._ignoreClicksOn[j])) {
                        ignoreClick = true;
                        break;
                    }
                }

                if (!(ignoreClick || utilsDom.isAncestor(target, popup.getDomElement()))) {
                    popup.closeOnMouseClick(domEvent);
                }

                domEvent.$dispose();
            },

            /**
             * Callback when the mouse move on the document. This is required to close some popups.
             * @param {Object} event
             */
            onDocumentMouseOut : function (event) {
                var domEvent = /** @type aria.DomEvent */
                new aria.DomEvent(event);
                var fromTarget = /** @type HTMLElement */
                domEvent.target;
                var toTarget = /** @type HTMLElement */
                domEvent.relatedTarget;
                for (var i = this.openedPopups.length - 1; i >= 0; i--) {
                    var popup = /** @type aria.popups.Popup */
                    this.openedPopups[i];
                    if (!utilsDom.isAncestor(toTarget, popup.getDomElement())
                            && utilsDom.isAncestor(fromTarget, popup.getDomElement())) {
                        popup.closeOnMouseOut(domEvent);
                    }
                }
                domEvent.$dispose();
            },

            /**
             * Callback for mouse scroll. This is required to close some popups.
             * @param {Object} event
             */
            onDocumentMouseScroll : function (event) {
                var domEvent = /** @type aria.DomEvent */
                new aria.DomEvent(event);

                // Retrieve the dom target
                var target = /** @type HTMLElement */
                domEvent.target;

                // Close first popup on the stack that can be closed
                var scrollPrevented = false;
                var popupsToClose = [];
                for (var i = this.openedPopups.length - 1; i >= 0; i--) {
                    var popup = /** @type aria.popups.Popup */
                    this.openedPopups[i];
                    if (!utilsDom.isAncestor(target, popup.getDomElement())) {
                        var closed = popup.closeOnMouseScroll(domEvent);
                        if (closed) {
                            break;
                        }
                    }
                }
                domEvent.$dispose();
            },

            /**
             * Manager handler when a popup is open. Register the popup as opened, register global events if needed.
             * @param {aria.popups.Popup} popup
             */
            onPopupOpen : function (popup) {
                if (utilsArray.isEmpty(this.openedPopups)) {
                    this.connectEvents();
                }
                if (popup.modalMaskDomElement) {
                    if (this.modalPopups === 0) {
                        this.connectModalEvents();
                        this.$raiseEvent("modalPopupPresent");
                    }
                    this.modalPopups += 1;
                }
                this.openedPopups.push(popup);

                this.$raiseEvent({
                    name : "popupOpen",
                    popup : popup
                });
            },

            /**
             * Manager handler when a popup is open. Unregister the popup as opened, unregister global events if needed.
             * @param {aria.popups.Popup} popup
             */
            onPopupClose : function (popup) {
                utilsArray.remove(this.openedPopups, popup);
                if (popup.modalMaskDomElement) {
                    this.modalPopups -= 1;
                    if (this.modalPopups === 0) {
                        this.disconnectModalEvents();
                        this.$raiseEvent("modalPopupAbsent");
                    }
                }
                if (utilsArray.isEmpty(this.openedPopups)) {
                    this.disconnectEvents();
                }

                this.$raiseEvent({
                    name : "popupClose",
                    popup : popup
                });
            },

            /**
             * Register the popup in the manager.
             * @param {aria.popups.Popup} popup
             */
            registerPopup : function (popup) {
                if (!utilsArray.contains(this.popups, popup)) {
                    this.popups.push(popup);
                }
            },

            /**
             * Show a popup with the given configuration. Returns the aria.popups.Popup instance create to handle the
             * popup.
             * @param {aria.popups.Beans.PopupConf} The configuration object describing the popup
             * @return {aria.popups.Popup} The aria.popups.Popup object created to handle the popup
             */
            show : function (popupConf) {
                var popup = new aria.popups.Popup();
                popup.open(popupConf);
                return popup;
            },

            /**
             * Unregister the popup in the manager.
             * @param {aria.popups.Popup} popup
             */
            unregisterPopup : function (popup) {
                if (utilsArray.contains(this.openedPopups, popup)) {
                    utilsArray.remove(this.openedPopups, popup);
                }
                if (utilsArray.contains(this.popups, popup)) {
                    utilsArray.remove(this.popups, popup);
                }
                if (utilsArray.isEmpty(this.openedPopups)) {
                    this.currentZIndex = this.baseZIndex;
                }
            },

            /**
             * Get the popup object from its DOM element.
             * @param {HTMLElement} domElement DOM element of the popup
             * @return {aria.popups.Popup}
             */
            getPopupFromDom : function (domElement) {
                var popups = this.popups;
                for (var i = 0, l = popups.length; i < l; i++) {
                    var curPopup = popups[i];
                    if (curPopup.domElement == domElement) {
                        return curPopup;
                    }
                }
                return null;
            }
        }
    });
})();

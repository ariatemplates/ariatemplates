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
var ariaDomEvent = require("../DomEvent");
var ariaUtilsEvent = require("../utils/Event");
var ariaUtilsArray = require("../utils/Array");
var ariaUtilsDom = require("../utils/Dom");
var ariaTemplatesNavigationManager = require("../templates/NavigationManager");
var ariaUtilsAriaWindow = require("../utils/AriaWindow");
var ariaCoreBrowser = require("../core/Browser");
var ariaCoreTimer = require("../core/Timer");

(function () {

    // shortcuts
    var utilsArray = null;
    var utilsDom = null;
    var utilsEvent = null;

    /**
     * Singleton dedicated to popup management
     * @singleton
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.popups.PopupManager",
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
            },
            "beforePreventingFocus" : {
                description : "Notifies that the popup manager is about to prevent an element from being focused (because it is behind a modal popup).",
                properties : {
                    event: "Focus event (instance of aria.DomEvent)",
                    modalPopup : "Modal popup which is above the element.",
                    cancel : "If set to true, the focus will not be prevented."
                }
            },
            "beforeBringingPopupsToFront" : {
                description : "Notifies that several popups are being brought to the front.",
                properties : {
                    popups : "Array of popups being brought to the front. The last popup in the list should be on the top.",
                    cancel : "If set to true, the zIndex of the popups will not be changed."
                }
            }
        },
        $onload : function () {
            utilsArray = ariaUtilsArray;
            utilsDom = ariaUtilsDom;
            utilsEvent = ariaUtilsEvent;
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

            ariaUtilsAriaWindow.$on({
                "unloadWindow" : this._reset,
                scope : this
            });
        },

        $destructor : function () {
            ariaUtilsAriaWindow.$unregisterListeners(this);
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
                var documentScroll = ariaUtilsDom._getDocumentScroll();
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
                ariaUtilsAriaWindow.attachWindow();
                this._document = Aria.$window.document;
                utilsEvent.addListener(this._document, "mousedown", {
                    fn : this.onDocumentClick,
                    scope : this
                }, true);
                utilsEvent.addListener(this._document, "touchend", {
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
                utilsEvent.addListener(this._document.body, "focusin", {
                    fn : this.onDocumentFocusIn,
                    scope : this
                });

                if (ariaCoreBrowser.isOldIE) {
                    // IE does not support scroll event on the document until IE9
                    ariaUtilsEvent.addListener(Aria.$window, "mousewheel", {
                        fn : this._onScroll,
                        scope : this
                    }, true);

                } else {
                    // All other browsers support scroll event on the document
                    ariaUtilsEvent.addListener(Aria.$window, "scroll", {
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
                    utilsEvent.removeListener(this._document, "touchend", {
                        fn : this.onDocumentClick
                    });
                    utilsEvent.removeListener(this._document, "mouseout", {
                        fn : this.onDocumentMouseOut
                    });
                    utilsEvent.removeListener(this._document, "mousewheel", {
                        fn : this.onDocumentMouseScroll
                    });
                    utilsEvent.removeListener(this._document.body, "focusin", {
                        fn : this.onDocumentFocusIn
                    });
                    ariaUtilsAriaWindow.detachWindow();
                    this._document = null;
                    if (ariaCoreBrowser.isOldIE) {
                        ariaUtilsEvent.removeListener(Aria.$window, "mousewheel", {
                            fn : this._onScroll
                        });
                    } else {
                        ariaUtilsEvent.removeListener(Aria.$window, "scroll", {
                            fn : this._onScroll
                        });
                    }
                }
            },

            /**
             * Connect events specific to modal popups.
             */
            connectModalEvents : function () {
                var navManager = ariaTemplatesNavigationManager;
                navManager.addGlobalKeyMap({
                    key : "ESCAPE",
                    modal : true,
                    callback : {
                        fn : this._raiseOnEscapeEvent,
                        scope : this
                    }
                });
                // global navigation is disabled in case of a modal popup
                navManager.setModalBehaviour(true);
            },

            /**
             * Disconnect events specific to modal popups.
             */
            disconnectModalEvents : function () {
                var navManager = ariaTemplatesNavigationManager;
                navManager.removeGlobalKeyMap({
                    key : "ESCAPE",
                    modal : true,
                    callback : {
                        fn : this._raiseOnEscapeEvent,
                        scope : this
                    }
                });
                // restore globalKeyMap
                navManager.setModalBehaviour(false);
            },

            /**
             * Updates the position of all opened popups.
             */
            updatePositions : function () {
                for (var i = this.openedPopups.length - 1; i >= 0; i--) {
                    var popup = this.openedPopups[i];
                    popup.updatePosition();
                }
            },

            /**
             * handles the scroll for the popup
             * @param {Object} Event that triggered the scroll.
             */
            _onScroll : function (event) {
                if (event.type === "mousewheel") {
                    ariaCoreTimer.addCallback({
                        fn : this.updatePositions,
                        scope : this
                    });
                } else if (event.type === "scroll") {
                    this.updatePositions();
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
             * Returns the popup which contains the given target DOM element, if the DOM element is not hidden
             * behind a modal popup.
             * @param {HTMLElement} target DOM element for which the containing popup has to be found
             * @param {Function} notifyTargetBehindModalPopup function which is called in case the target is behind
             * a modal popup. The function receives the modal popup as a parameter and its return value becomes
             * the return value of findParentPopup.
             */
            findParentPopup : function (target, notifyTargetBehindModalPopup) {
                var searchPopup = this._document && target !== this._document.body;
                if (searchPopup) {
                    for (var i = this.openedPopups.length - 1; i >= 0; i--) {
                        var popup = this.openedPopups[i];
                        if (utilsDom.isAncestor(target, popup.getDomElement())) {
                            // the element is in the modal popup, it is fine to focus it
                            return popup;
                        }
                        if (popup.modalMaskDomElement && utilsDom.isAncestor(target, popup.popupContainer.getContainerElt())) {
                            // the element is inside the container for which there is a modal mask
                            if (notifyTargetBehindModalPopup) {
                                return notifyTargetBehindModalPopup(popup);
                            }
                            return;
                        }
                    }
                }
            },

            /**
             * Callback after the focus is put on an element in the document, when a modal popup is displayed.
             * @param {Object} event The DOM focusin event triggering the callback
             */
            onDocumentFocusIn : function (event) {
                var domEvent = new ariaDomEvent(event);
                var target = domEvent.target;
                var self = this;
                var popup = this.findParentPopup(target, function (popup) {
                    var eventObject = {
                        name: "beforePreventingFocus",
                        event: domEvent,
                        modalPopup: popup,
                        cancel: false
                    };
                    self.$raiseEvent(eventObject);
                    if (!eventObject.cancel) {
                        ariaTemplatesNavigationManager.focusFirst(popup.domElement);
                        return popup;
                    }
                    // if the focus is allowed, don't return any popup to bring to the front
                });
                if (popup) {
                    this.bringToFront(popup);
                }
                domEvent.$dispose();
            },

            /**
             * Returns the popup with the highest zIndex.
             */
            getTopPopup : function () {
                var openedPopups = this.openedPopups;
                var topPopup = null;
                if (openedPopups.length > 0) {
                    topPopup = openedPopups[openedPopups.length - 1];
                    var topZIndex = topPopup.getZIndex();
                    for (var i = openedPopups.length - 2; i >= 0; i--) {
                        var curPopup = openedPopups[i];
                        var curZIndex = curPopup.getZIndex();
                        if (curZIndex > topZIndex) {
                            topPopup = curPopup;
                            topZIndex = curZIndex;
                        }
                    }
                }
                return topPopup;
            },

            /**
             * Bring the given popup to the front, changing its zIndex, if it is necessary.
             * @param {aria.popups.Popup} popup popup whose zIndex is to be changed
             */
            bringToFront : function (popup) {
                var curZIndex = popup.getZIndex();
                var newBaseZIndex = this.currentZIndex;
                if (curZIndex === newBaseZIndex) {
                    // already top most, nothing to do in any case!
                    return;
                }
                // gets all popups supposed to be in front of this one, including this one
                var openedPopups = this.openedPopups;
                var popupsToKeepInFront = [];
                var i, l;
                for (i = openedPopups.length - 1; i >= 0; i--) {
                    var curPopup = openedPopups[i];
                    if (curPopup === popup || curPopup.conf.zIndexKeepOpenOrder) {
                        popupsToKeepInFront.unshift(curPopup);
                        if (curPopup.getZIndex() === newBaseZIndex) {
                            newBaseZIndex -= 10;
                        }
                        if (curPopup === popup) {
                            break;
                        }
                    }
                }
                if (i < 0 || newBaseZIndex + 10 === curZIndex) {
                    // either the popup is not in openedPopups (i < 0)
                    // or it is already correctly positioned (newBaseZIndex + 10 === curZIndex)
                    return;
                }
                var eventObject = {
                    name : "beforeBringingPopupsToFront",
                    popups : popupsToKeepInFront,
                    cancel : false
                };
                this.$raiseEvent(eventObject);
                if (eventObject.cancel) {
                    return;
                }
                this.currentZIndex = newBaseZIndex;
                for (i = 0, l = popupsToKeepInFront.length; i < l; i++) {
                    var curPopup = popupsToKeepInFront[i];
                    curPopup.setZIndex(this.getZIndexForPopup(curPopup));
                }
            },

            /**
             * Callback when the user clicks on the document
             * @param {Object} event The DOM click event triggering the callback
             */
            onDocumentClick : function (event) {
                var domEvent = /** @type aria.DomEvent */
                new ariaDomEvent(event), target = /** @type HTMLElement */
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

                var topPopup = this.findParentPopup(target);
                if (topPopup) {
                    this.bringToFront(topPopup);
                }

                domEvent.$dispose();
            },

            /**
             * Callback when the mouse move on the document. This is required to close some popups.
             * @param {Object} event
             */
            onDocumentMouseOut : function (event) {
                var domEvent = /** @type aria.DomEvent */
                new ariaDomEvent(event);
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
                new ariaDomEvent(event);

                // Retrieve the dom target
                var target = /** @type HTMLElement */
                domEvent.target;

                // Close first popup on the stack that can be closed
                for (var i = this.openedPopups.length - 1; i >= 0; i--) {
                    var popup = /** @type aria.popups.Popup */
                    this.openedPopups[i];
                    if (!utilsDom.isAncestor(target, popup.getDomElement())) {

                        if (ariaCoreBrowser.isFirefox) {
                            // There's a strange bug in FF when wheelmouse'ing quickly raises an event which target is HTML instead of the popup
                            if (utilsDom.isAncestor(this._document.elementFromPoint(domEvent.clientX, domEvent.clientY), popup.getDomElement()))
                                continue;
                        }

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
             * Manager handler when a popup is closed. Unregister the popup as opened, unregister global events if needed.
             * @param {aria.popups.Popup} popup
             */
            onPopupClose : function (popup) {
                var openedPopups = this.openedPopups;
                utilsArray.remove(openedPopups, popup);
                if (popup.modalMaskDomElement) {
                    this.modalPopups -= 1;
                    if (this.modalPopups === 0) {
                        this.disconnectModalEvents();
                        this.$raiseEvent("modalPopupAbsent");
                    }
                }
                if (utilsArray.isEmpty(openedPopups)) {
                    this.disconnectEvents();
                }
                var curZIndex = popup.getZIndex();
                if (curZIndex === this.currentZIndex) {
                    this.currentZIndex -= 10;
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
             * @param {aria.popups.Beans:PopupConf} The configuration object describing the popup
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
            },

            /**
             * Raise the "onEscape" event on the last popup that has been opened, if that popup is modal
             * @protected
             */
            _raiseOnEscapeEvent : function () {
                var topPopup = this.getTopPopup();
                if (topPopup && topPopup.modalMaskDomElement) {
                    topPopup.$raiseEvent("onEscape");
                }
            }
        }
    });
})();

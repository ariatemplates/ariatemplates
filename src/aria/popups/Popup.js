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
 * Popup instance
 * @class aria.popups.Popup
 */
Aria.classDefinition({
    $classpath : "aria.popups.Popup",
    $dependencies : ["aria.popups.PopupManager", "aria.popups.Beans", "aria.DomEvent", "aria.utils.Math",
            "aria.utils.Dom", "aria.utils.Size", "aria.utils.Event", "aria.utils.Delegate"],
    $events : {
        onBeforeClose : {
            description : "Event triggered before closing the event",
            properties : {
                domEvent : "{aria.DomEvent} The event that triggered the closing of the popup",
                cancelClose : "{Boolean} Cancel the closing of the popup"
            }
        },
        onMouseOutTimerStart : {
            description : "Event triggered when the mouseout timer",
            properties : {
                domEvent : "{aria.DomEvent} The event that triggered the closing of the popup",
                cancelClose : "{Boolean} Cancel the closing of the popup"
            }
        },
        onMouseClickClose : {
            description : "Event triggered when the popup is close with a mouse click outside the popup",
            properties : {
                domEvent : "{aria.DomEvent} The event that triggered the closing of the popup"
            }
        },
        onAfterClose : "",
        onBeforeOpen : "",
        onAfterOpen : "",
        onPositioned : {
            description : "Triggered when position of the popup is chosen, according to prefered position provided",
            properties : {
                position : "Position chosen if any. If empty, no position in viewset was found."
            }
        }
    },
    $statics : {
        ANCHOR_BOTTOM : "bottom",
        ANCHOR_TOP : "top",
        ANCHOR_LEFT : "left",
        ANCHOR_RIGHT : "right"
    },
    $constructor : function () {
        /**
         * The array of positions (couples of anchors) used for positionning the popup
         * @type Array
         */
        this.preferredPositions = [];

        /**
         * Mask for modal popups
         * @type HTMLElement
         */
        this.modalMaskDomElement = null;

        /**
         * Id for event delegation, for the contentchange event
         * @protected
         * @type String
         */
        this._delegateId = aria.utils.Delegate.add({
            fn : this._handleDelegate,
            scope : this
        });

        /**
         * Popup dom element
         * @type HTMLElement
         */
        this.domElement = null;

        /**
         * Flag indicating if the popup is displayed or not
         * @type Boolean
         */
        this.isOpen = false;

        /**
         * Reference position for the popup positioning
         * @type HTMLElement
         */
        this.reference = null;

        /**
         * Configuration for relative positioning
         * @type aria.popups.Beans:PositionCfg
         */
        this.referencePosition = null;

        /**
         * Size of the reference element
         * @type aria.popups.Beans:SizeCfg
         */
        this.referenceSize = null;

        /**
         * Section associated with the popup content.
         * @type aria.templates.Section
         */
        this.section = null;

        /**
         * Size of the section
         * @type aria.popups.Beans:SizeCfg
         */
        this.sectionSize = null;

        /**
         * Static Array defining the available keys for an anchor describing a position (such as 'bottom left')
         * @static
         * @type Array
         */
        this.ANCHOR_KEYS = [this.ANCHOR_BOTTOM, this.ANCHOR_TOP, this.ANCHOR_LEFT, this.ANCHOR_RIGHT];

        /**
         * A list of HTMLElements which, when clicked upon, do not cause the popup to close
         * @protected
         * @type Array
         */
        this._ignoreClicksOn = null;

        /**
         * Stores the old "overflow" style of the root element (overflow hidden is used for the modal dialog)
         * @protected
         * @type String
         */
        this._rootElementOverflow = -1;

        /**
         * Root element on which the style changes should be done
         * @protected
         * @type HTMLElement
         */
        this._rootElement = aria.utils.Dom.getDocumentScrollElement();
        // PTR 04893174 was rolled back for release 1.1-13 because it introduces
        // a regression on Airrail.
        // TO BE FIXED LATER
        // PTR 04893174: do not set this._rootElement = document.body on
        // Firefox, as it resets all scrolling
        // position when changing the overflow style
        // PTR 05210073: the changes reverted for PTR 04893174 were put back in
        // place and the code changes in order to
        // fix the regression were implemented

        /**
         * Document where the popup is displayed.
         * @type HTMLElement
         */
        this._document = Aria.$window.document;
        aria.popups.PopupManager.registerPopup(this);

    },

    $destructor : function () {
        this.close();
        this.reference = null;
        if (this._delegateId) {
            aria.utils.Delegate.remove(this._delegateId);
        }
        if (this.section) {
            this.section.$unregisterListeners(this);
            if (this.conf.keepSection) {
                this.section.removeContent();
            } else {
                this.section.$dispose();
            }
            this.section = null;
        }
        if (this.modalMaskDomElement) {
            aria.utils.Dom.removeElement(this.modalMaskDomElement);
            this.modalMaskDomElement = null;
        }
        if (this.domElement) {
            aria.utils.Dom.removeElement(this.domElement);
            this.domElement = null;
        }
        this.conf.domReference = null;
        this._parentDialog = null;
        this._ignoreClicksOn = null;
        this._document = null;
        this.$unregisterListeners();
        // The popup manager is responsible for destroying the DOM of the popup
        aria.popups.PopupManager.unregisterPopup(this);
    },

    $prototype : {

        /**
         * Save the configuration information for this popup.
         * @param {aria.popups.Beans:PopupCfg} conf
         * @protected
         */
        _applyConfig : function (conf) {
            aria.core.JsonValidator.normalize({
                json : conf,
                beanName : "aria.popups.Beans.PopupConf"
            });

            if (this.modalMaskDomElement) {
                aria.utils.Dom.removeElement(this.modalMaskDomElement);
                this.modalMaskDomElement = null;
            }
            if (conf.modal) {
                this.modalMaskDomElement = this._createMaskDomElement(conf.maskCssClass);
            }
            if (this.domElement != null) {
                aria.utils.Dom.removeElement(this.domElement);
            }
            this.domElement = this._createDomElement();

            this.setPreferredPositions(conf.preferredPositions);
            this.setSection(conf.section);

            if (conf.absolutePosition === null) {
                this.setReference(conf.domReference);
            } else {
                this.setPositionAsReference(conf.absolutePosition);
            }

            this._ignoreClicksOn = conf.ignoreClicksOn;

            this._parentDialog = conf.parentDialog;

            this.conf = conf;
        },

        /**
         * Attach mouseover event listeners. This listener is only used when the popup closes after a certain delay on
         * mouseout. It allows to cancel the delay if the mouse overs again the popup.
         * @protected
         */
        _attachMouseOverListener : function () {
            this._detachMouseOverListener();
            aria.utils.Event.addListener(this.getDomElement(), "mouseover", {
                fn : this._clearMouseOutTimer,
                scope : this
            });
        },

        /**
         * Handle event delegation for the container, for the contentchange event
         * @protected
         * @param {aria.DomEvent} domEvent
         */
        _handleDelegate : function (domEvent) {
            if (domEvent.type == "contentchange") {
                this.refresh();
            }
        },

        /**
         * Create the DOM element of the popup, which will be used as the container
         * @protected
         * @return {HTMLElement} The DOM element created for this popup
         */
        _createDomElement : function () {
            var document = this._document;
            var div = document.createElement("div");
            div.style.cssText = "position:absolute;top:-15000px;left:-15000px;";
            document.body.appendChild(div);
            div.innerHTML = "<div " + aria.utils.Delegate.getMarkup(this._delegateId)
                    + " style='position:absolute;top:-15000px;left:-15000px;visibility:hidden;display:block;'></div>";
            var domElement = div.firstChild;
            document.body.removeChild(div);
            document.body.appendChild(domElement);
            return domElement;
        },

        /**
         * Create the DOM element of the mask, for modal popups.
         * @protected
         * @param {String} className CSS classes for the dialog mask.
         * @return {HTMLElement}
         */
        _createMaskDomElement : function (className) {
            var document = this._document;
            var div = document.createElement("div");
            div.className = className || "xModalMask-default";
            div.style.cssText = "position:absolute;top:-15000px;left:-15000px;visibility:hidden;display:block;";
            return document.body.appendChild(div);
        },

        /**
         * Callback for the mouseover event. It is called to clear the timeout that should close the dropdown on mouse
         * out event after a delay.
         * @protected
         */
        _clearMouseOutTimer : function () {
            aria.core.Timer.cancelCallback(this._mouseOutTimer);
        },

        /**
         * The default callback used when opening the popup To be overrided by the popup creator
         * @protected
         * @return {Boolean} Returns true
         */
        _defaultBeforeOpenCallback : function () {
            return true;
        },

        /**
         * The default callback used when closing the popup. To be overriden by the popup creator
         * @protected
         * @return {Boolean} Returns true
         */
        _defaultBeforeCloseCallback : function () {
            return true;
        },

        /**
         * Remove the listener on mouseover event
         * @protected
         */
        _detachMouseOverListener : function () {
            aria.utils.Event.removeListener(this.getDomElement(), "mouseover", {
                fn : this._clearMouseOutTimer
            });
        },

        /**
         * Compute the size, position and zIndex of the popup dom element, based on its content and configuration and
         * return it in the form of a JSON object
         * @return {Object} Object of the form
         *
         * <pre>
         *  {
         *      top: // {Number}
         *      left: // {Number}
         *      height: // {Number}
         *      width: // {Number}
         *      zIndex: // {Number}
         *  }
         * </pre>
         *
         * @protected
         */
        _getComputedStyle : function () {
            var size, zIndex;
            if (this.isOpen && this.computedStyle.zIndex) {
                // This is a parial refresh, no need to update the zindex
                zIndex = this.computedStyle.zIndex;
            } else {
                zIndex = aria.popups.PopupManager.getZIndexForPopup(this);
            }

            if (this.conf.preferredWidth > 0) {
                size = {
                    width : this.conf.preferredWidth,
                    height : 0
                };
            } else {
                // PTR 04315046: calling
                // aria.utils.Size.getFreeSize(this.domElement) is not possible
                // here as it moves
                // the element in the DOM, which resets scrolling positions
                size = this._getFreeSize();
            }

            // The computed size is required to calculate the position
            var position = this._getPosition(size);

            var computedStyle = {
                'top' : position.top,
                'left' : position.left,
                'height' : size.height,
                'width' : size.width,
                'zIndex' : zIndex
            };

            return computedStyle;
        },

        /**
         * Get the size of the popup in an unconstrained context. Note that this hides the popup, but does NOT move it
         * in the DOM hierarchy, so that it keeps scrolling positions (cf PTR 04315046).
         * @return {Object} JSON object like { height : {Number}, width : {Number} }
         * @protected
         */
        _getFreeSize : function () {
            var domElement = this.domElement;
            var browser = aria.core.Browser;
            domElement.style.cssText = "position:absolute;top:-15000px;left:-15000px;visibility:hidden;display:block;";

            // PTR05398297: fixes rounding issue in IE9 for offsetWidth.
            var width = (browser.isIE9 || browser.isIE10) ? domElement.offsetWidth + 1 : domElement.offsetWidth;
            return {
                width : width,
                height : domElement.offsetHeight
            };
        },

        /**
         * Retrieve the absolute position of the popup on the page The position is calculated from the popup's size and
         * configuration
         * @param {aria.popups.Beans:Size} size The computed size of the popup
         * @return {aria.popups.Beans:Position} The absolute position where the popup should be displayed
         * @protected
         */
        _getPosition : function (size) {
            var position, isInViewSet;
            if (this.conf.maximized) {
                var offset = this.conf.offset;
                position = {
                    top : -offset.top,
                    left : -offset.left
                };
            } else if (this.conf.center) {
                // apply the offset (both left and right, and also top and bottom)
                // before centering the whole thing in the viewport
                var offset = this.conf.offset;
                var newSize = {
                    width : size.width + offset.left + offset.right,
                    height : size.height + offset.top + offset.bottom
                };
                position = aria.utils.Dom.centerInViewport(newSize, this.reference);
                position = aria.utils.Dom.fitInViewport(position, newSize, this.reference);
            } else {
                var i = 0, preferredPosition;
                do {
                    preferredPosition = this.preferredPositions[i];
                    // Calculate position for a given anchor
                    position = this._getPositionForAnchor(preferredPosition, size);
                    // If this position+size is out of the viewport, try the
                    // next anchor available
                    isInViewSet = aria.utils.Dom.isInViewport(position, size);
                    i++;
                } while (!isInViewSet && this.preferredPositions[i]);

                var positionEvent = {
                    name : "onPositioned"
                };

                // If all anchors setting were out of the viewport, fallback
                if (!isInViewSet) {
                    // Currently simply fallback to first anchor ...
                    position = this._getPositionForAnchor(this.preferredPositions[0], size);
                    position = aria.utils.Dom.fitInViewport(position, size);
                } else {
                    positionEvent.position = this.preferredPositions[i - 1];
                }
                this.$raiseEvent(positionEvent);
            }
            return position;
        },

        /**
         * @param {aria.popups.Beans:PreferredPosition} preferredPosition An anchor binding
         * @param {aria.popups.Beans:Size} size The computed size of the popup
         * @return {aria.popups.Beans:Position} The absolute position where the popup should be displayed for this
         * anchor binding
         * @protected
         */
        _getPositionForAnchor : function (preferredPosition, size) {
            var referenceAnchor = preferredPosition.reference;
            var popupAnchor = preferredPosition.popup;

            // Origin has the same position as the reference in the beginning
            var top = this.referencePosition.top;
            var left = this.referencePosition.left;

            // Depending on the reference's anchor configuration
            // the origin has to be modified
            // Anchor at the bottom of the reference, add its height to the top
            if (referenceAnchor.indexOf(this.ANCHOR_BOTTOM) != -1) {
                top = top + this.referenceSize.height;
            }

            // Anchor at the right of the reference, add its width to the left
            if (referenceAnchor.indexOf(this.ANCHOR_RIGHT) != -1) {
                left = left + this.referenceSize.width;
            }

            var offset = preferredPosition.offset || this.conf.offset;
            // Depending on the popup's anchor configuration, the origin can be
            // modified as well
            // Anchor at the bottom of the popup, substract the height of the
            // popup to the top
            if (popupAnchor.indexOf(this.ANCHOR_BOTTOM) != -1) {
                top = top - size.height;
                // apply the bottom offset
                top = top - offset.bottom;
            } else if (popupAnchor.indexOf(this.ANCHOR_TOP) != -1) {
                // apply the top offset
                top = top + offset.top;
            }

            // Anchor at the right of the popup, substract the width of the
            // popup to the top
            if (popupAnchor.indexOf(this.ANCHOR_RIGHT) != -1) {
                left = left - size.width;
                // apply the right offset
                left = left - offset.right;
            } else if (popupAnchor.indexOf(this.ANCHOR_LEFT) != -1) {
                // apply the left offset
                left = left + offset.left;
            }

            // add scroll of document from absolute positioning
            var documentScroll = aria.utils.Dom._getDocumentScroll();
            left += documentScroll.scrollLeft;
            top += documentScroll.scrollTop;

            var position = {
                'top' : top,
                'left' : left
            };

            return position;
        },

        /**
         * Hide the popup and the modal mask. The popup is not removed from the DOM, neither disposed.
         * @protected
         */
        _hide : function () {
            if (!this.domElement) {
                return;
            }
            this.domElement.style.cssText = "position:absolute;display:none;overflow:auto;";
            if (this.modalMaskDomElement) {
                this.modalMaskDomElement.style.cssText = "position:absolute;display:none";
                if (this._rootElementOverflow != -1) {
                    if (aria.core.Browser.isFirefox) {
                        var docScroll = aria.utils.Dom._getDocumentScroll();
                        this._rootElement.style.overflow = this._rootElementOverflow;
                        this._rootElement.scrollTop = docScroll.scrollTop;
                        this._rootElement.scrollLeft = docScroll.scrollLeft;
                    } else {
                        this._rootElement.style.overflow = this._rootElementOverflow;
                    }
                    this._rootElementOverflow = -1;
                }
            }
        },

        /**
         * Check that a given anchor only has valid values ('bottom', 'top', 'left', 'right') And has a reglementary
         * size
         * @param {String} anchor
         * @return {Boolean}
         * @protected
         */
        _isValidAnchor : function (anchor) {
            var keys = anchor.split(" ");
            if (keys.length > 2) {
                return false;
            }

            for (var i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                if (!aria.utils.Array.contains(this.ANCHOR_KEYS, key)) {
                    return false;
                }
            }

            return true;
        },

        /**
         * @param {aria.popups.Beans:PreferredPosition} preferredPosition
         * @return {Boolean}
         * @protected
         */
        _isValidPosition : function (preferredPosition) {
            return (this._isValidAnchor(preferredPosition.reference) && this._isValidAnchor(preferredPosition.popup));
        },

        /**
         * Callback associated to the mouse out setTimeout Timeout should have been removed when the mouse entered the
         * @param {aria.DomEvent} event
         * @protected
         */
        _onMouseOutTimeout : function () {
            this._detachMouseOverListener();
            this.close();
        },

        /**
         * Compute the popup style (size, position, zIndex) and show it.
         * @protected
         */
        _show : function () {

            // Insure that the top left corner is visible
            if (this.modalMaskDomElement) {

                if (this._rootElementOverflow == -1) {
                    this._rootElementOverflow = this._rootElement.style.overflow;
                    if (aria.core.Browser.isFirefox) {
                        var docScroll = aria.utils.Dom._getDocumentScroll();
                        this._rootElement.style.overflow = "hidden";
                        this._rootElement.scrollTop = docScroll.scrollTop;
                        this._rootElement.scrollLeft = docScroll.scrollLeft;
                    } else {
                        this._rootElement.style.overflow = "hidden";
                    }
                }
                var viewport = aria.utils.Dom._getViewportSize();

                var width = this._rootElement.scrollWidth;
                var height = this._rootElement.scrollHeight;

                // ensure that all viewport is used
                height = Math.max(viewport.height, height);
                width = Math.max(viewport.width, width);
                // Compute the style after scrollbars are removed from the
                // document. Thus the dialog can be properly
                // centered
                this.computedStyle = this._getComputedStyle();

                this.modalMaskDomElement.style.cssText = ['left:0px;top:0px;', 'width:', width, 'px;', 'height:',
                        height, 'px;', 'z-index:', this.computedStyle.zIndex, ';', 'position:absolute;display:block;'].join('');
            } else {
                this.computedStyle = this._getComputedStyle();
            }
            // Need to check that the reference point is still completely visible after a scroll
            var referenceIsInViewSet = aria.utils.Dom.isInViewport(this.referencePosition, this.referenceSize, this.domElement);
            if (referenceIsInViewSet) {
                this.domElement.style.cssText = ['top:', this.computedStyle.top, 'px;', 'left:',
                        this.computedStyle.left, 'px;', 'z-index:', this.computedStyle.zIndex, ';',
                        'position:absolute;display:inline-block;'].join('');
                if (aria.core.Browser.isIE7 && !this.isOpen) {
                    // Without the following line, the autocomplete does not
                    // initially display its content on IE7:
                    this._document.body.appendChild(this.domElement);
                }
            }
        },

        /**
         * Refresh the style of the popup
         */
        refresh : function () {
            if (this.isOpen) {
                // PROFILING // var profilingId = this.$startMeasure("refresh");
                this._show();
                // PROFILING // this.$stopMeasure(profilingId);
            }
        },

        /**
         * Set absolute position of the popup and refresh it. Refresh also processing indicators that might be displayed
         * on top of it
         * @param {aria.utils.DomBeans:Position} absolutePosition
         */
        moveTo : function (conf) {
            if (conf) {
                if ("center" in conf) {
                    this.conf.center = conf.center;
                }
                if ("absolutePosition" in conf) {
                    this.setPositionAsReference(conf.absolutePosition);
                }
            }
            this.refresh();
            this.refreshProcessingIndicators();
        },

        /**
         * If a Timer is currently running to close a Popup after a mouseout event, cancel it.
         */
        cancelMouseOutTimer : function () {
            if (this._mouseOutTimer) {
                this._clearMouseOutTimer();
            }
        },

        /**
         * Close/Hide the tooltip If defined the user callback 'beforeCloseCallback' will be called to verify the popup
         * can be closed
         * @param {aria.DomEvent} domEvent event that triggered the closing of the popup
         */
        close : function (domEvent) {
            if (this.isOpen) {
                var event = {
                    name : "onBeforeClose",
                    cancelClose : false,
                    domEvent : domEvent
                };
                this.$raiseEvent(event);
                if (!event.cancelClose) {
                    this._hide();
                    this.isOpen = false;
                    // Notify the popup manager this popup was closed
                    aria.popups.PopupManager.onPopupClose(this);
                    this.$raiseEvent("onAfterClose");
                }
            }
        },

        /**
         * Close triggered by a mouse click, coming from the popup manager Close the popup according to the
         * configuration
         * @param {aria.DomEvent} domEvent event that triggered the closing of the popup
         */
        closeOnMouseClick : function (domEvent) {
            if (this.conf.closeOnMouseClick) {
                var event = {
                    name : "onMouseClickClose",
                    cancelClose : false,
                    domEvent : domEvent
                };
                this.$raiseEvent(event);
                this.close(domEvent);
                return true;
            }
        },

        /**
         * Close triggered by a mouse out event, coming from the popup manager Close the popup according to the
         * configuration
         * @param {aria.DomEvent} event mouseout event that triggered the action
         */
        closeOnMouseOut : function (domEvent) {
            if (this.conf.closeOnMouseOut) {
                if (!this.conf.closeOnMouseOutDelay) { // If delay is not set
                    // OR is equal to zero
                    this.close(domEvent);
                } else {
                    this.cancelMouseOutTimer();
                    this._mouseOutTimer = aria.core.Timer.addCallback({
                        fn : this._onMouseOutTimeout,
                        scope : this,
                        delay : this.conf.closeOnMouseOutDelay
                    });

                    this._attachMouseOverListener();
                }
            }
        },

        /**
         * Close triggered by a mouse scroll, coming from the popup manager Close the popup according to the
         * configuration
         * @param {aria.DomEvent} event scroll event that triggered the action
         * @return {Boolean} true of closed
         */
        closeOnMouseScroll : function (event) {
            if (this.conf.closeOnMouseScroll) {
                this.close(event);
                return true;
            }
        },

        /**
         * Repositions the popup based on the dom reference, if the dom reference is no longer visible then closes the
         * popup and blurs the dom reference.
         * @param {Object} event scroll event that triggered the handler.
         */
        _isScrolling : function () {
            var domReference = this.reference;
            if (domReference) {
                var geometry = aria.utils.Dom.getGeometry(domReference);
                if (geometry) {
                    this.referencePosition = {
                        left : geometry.x,
                        top : geometry.y
                    };
                    this.referenceSize = {
                        width : geometry.width,
                        height : geometry.height
                    };
                    this.refresh();
                    if (this.domElement && this.domElement.style.visibility === "hidden") {
                        this.domElement.style.visibility = "visible";
                    }
                } else {
                    this.domElement.style.visibility = "hidden";
                }
            }
        },

        /**
         * Retrieve the DOM element of the popup, used as the container
         * @return {HTMLElement} The DOM element of this popup
         */
        getDomElement : function () {
            return this.domElement;
        },

        /**
         * Open/Show the tooltip with the given configuration
         * @param {aria.popups.Beans:PopupConf} conf Configuration object. See aria.popups.Beans.PopupCfg bean
         * documentation
         */
        open : function (conf) {
            if (!this.isOpen) {
                this.$raiseEvent("onBeforeOpen");
                this._applyConfig(conf);
                this._show();
                this.isOpen = true;
                aria.popups.PopupManager.onPopupOpen(this);
                this.refreshProcessingIndicators();
                this.$raiseEvent("onAfterOpen");
            }
        },

        /**
         * @param {Array} preferredPositions Array of content type {aria.popups.Beans.PreferredPosition}
         */
        setPreferredPositions : function (preferredPositions) {
            this.preferredPositions = [];
            for (var i = 0, l = preferredPositions.length; i < l; i++) {
                var preferredPosition = preferredPositions[i];
                if (this._isValidPosition(preferredPosition)) {
                    this.preferredPositions[this.preferredPositions.length] = preferredPosition;
                }
            }
        },

        /**
         * If an absolutePosition was set in the configuration object for this popup, create a virtual reference of the
         * given position, a size of size(0,0) and no DOM element. The reference position is the viewport, so (0,0) is
         * top left and not the beginning of the page when scrolled.
         * @param {Object} position The absolute position which will be used to display the popup
         */
        setPositionAsReference : function (position) {
            var size = {
                'height' : 0,
                'width' : 0
            };

            position = {
                'top' : position.top,
                'left' : position.left
            };

            this.reference = null;
            this.referencePosition = position;
            this.referenceSize = size;
        },

        /**
         * Set the given HTML element as the reference which will be used to position the popup. Calculate the position
         * and size of the element
         * @param {HTMLElement} element Element which will be used as a reference to position the popup
         */
        setReference : function (element) {
            var size = aria.utils.Size.getSize(element), domUtil = aria.utils.Dom;
            domUtil.scrollIntoView(element);
            var position = domUtil.calculatePosition(element);

            this.reference = element;
            this.referencePosition = position;
            this.referenceSize = size;
        },

        /**
         * Set the section which will be used as the content of this popup Calculate its size and initialize the widgets
         * inside it
         * @param {aria.templates.Section} section
         */
        setSection : function (section) {
            // PROFILING // var profilingId = this.$startMeasure("Inserting
            // section in DOM");
            aria.utils.Dom.replaceHTML(this.domElement, section.html);

            var sectionDomElement = this.domElement.firstChild;

            // Maybe the initWidget should be done after displaying the popup ?
            section.initWidgets();

            this.section = section;
            // PROFILING // this.$stopMeasure(profilingId);
        },

        /**
         * Recursively refresh rpocessing indicators associated to the section displayed
         */
        refreshProcessingIndicators : function () {
            if (this.section) {
                this.section.refreshProcessingIndicator(true);
            }

        }
    }
});

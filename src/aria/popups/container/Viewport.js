/*
 * Copyright 2015 Amadeus s.a.s.
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
 * Implementation of the IPopupContainer interface to use the viewport (document.body)
 * as a popup container.
 */
Aria.classDefinition({
    $classpath : "aria.popups.container.Viewport",
    $singleton : true,
    $dependencies : ["aria.utils.Dom", "aria.core.Browser"],
    $implements : ["aria.popups.container.IPopupContainer"],
    $prototype : {
        /**
         * Returns the DOM element of the container, to which the popup DOM element
         * and its mask will be appended.
         * @return {HTMLElement}
         */
        getContainerElt : function () {
            return Aria.$window.document.body;
        },

        /**
         * Returns aria.utils.Dom.VIEWPORT.
         * @return {String}
         */
        getContainerRef : function () {
            return aria.utils.Dom.VIEWPORT;
        },

        /**
         * Returns an object containing the scroll position of the container.
         * @return {Object} Object with 'scrollLeft' and 'scrollTop' properties.
         */
        getContainerScroll : function () {
            return aria.utils.Dom._getDocumentScroll();
        },

        /**
         * Returns the overflow style of the container.
         * @return {String}
         */
        getContainerOverflow : function () {
            return aria.utils.Dom.getDocumentScrollElement().style.overflow;
        },

        /**
         * Changes the overflow style of the container.
         * Returns the previous value.
         * @param {String} new overflow value
         * @return {String} old overflow value
         */
        changeContainerOverflow : function (newValue) {
            // PTR 04893174 was rolled back for release 1.1-13 because it introduces a regression on Airrail.
            // PTR 04893174: do not set scrollElement = document.body on Firefox, as it resets all scrolling
            // position when changing the overflow style
            // PTR 05210073: the changes reverted for PTR 04893174 were put back in place and the code changes
            // in order to fix the regression were implemented

            var scrollElement = aria.utils.Dom.getDocumentScrollElement();
            var res = scrollElement.style.overflow;
            if (aria.core.Browser.isFirefox) {
                var docScroll = aria.utils.Dom._getDocumentScroll();
                scrollElement.style.overflow = newValue;
                scrollElement.scrollTop = docScroll.scrollTop;
                scrollElement.scrollLeft = docScroll.scrollLeft;
            } else {
                scrollElement.style.overflow = newValue;
            }
            return res;
        },

        /**
         * Returns the position of the given domElt, in the coordinates of the container.
         * @param {HTMLElement} domElt element whose position will be returned
         * @return {aria.utils.DomBeans:Position}
         */
        calculatePosition : function (domElt) {
            var position = aria.utils.Dom.calculatePosition(domElt);
            return {
                left: position.left,
                top: position.top
            };
        },

        /**
         * Returns the size of the container's content (if this is larger than the value returned
         * by getClientSize, scrollbars are needed to view the full content).
         * @return {aria.utils.DomBeans:Size}
         */
        getScrollSize : function () {
            var viewport = aria.utils.Dom._getViewportSize();
            var scrollElement = aria.utils.Dom.getDocumentScrollElement();
            // ensure that all viewport is used
            return {
                width: Math.max(viewport.width, scrollElement.scrollWidth),
                height: Math.max(viewport.height, scrollElement.scrollHeight)
            };
        },

        /**
         * Returns the size of the container's client area.
         * @return {aria.utils.DomBeans:Size}
         */
        getClientSize : function () {
            return aria.utils.Dom._getViewportSize();
        },

        /**
         * Check if a given position + size couple can fit in the container.
         * @param {aria.utils.DomBeans:Position} position
         * @param {aria.utils.DomBeans:Size} size
         * @param {Object} base The base element used to account for scrolling offsets
         * @return {Boolean} True if the given position+size couple can fit in the current viewport
         */
        isInside : function (position, size, base) {
            return aria.utils.Dom.isInViewport(position, size, base);
        },

        /**
         * Given a position + size couple, returns a corrected position that should fit in the container.
         * If the size is bigger than the container it returns a position such that the top left corner
         * of the element is in the container.
         * @param {aria.utils.DomBeans:Position} position
         * @param {aria.utils.DomBeans:Size} size
         * @param {Object} base The base element used to account for scrolling offsets
         * @return {aria.utils.DomBeans:Position}
         */
        fitInside : function (position, size, base) {
            return aria.utils.Dom.fitInViewport(position, size, base);
        },

        /**
         * Center the given size in the container.
         * @param {aria.utils.DomBeans:Size} size size of the element to center in the container
         * @param {Object} base The base element used to account for scrolling offsets
         * @return {aria.utils.DomBeans:Position} position of the element when centered in the container
         */
        centerInside : function (size, base) {
            return aria.utils.Dom.centerInViewport(size, base);
        }
    }
});

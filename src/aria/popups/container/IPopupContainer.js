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
var Aria = require("ariatemplates/Aria");

/**
 * Interface used by the Popup class and the @aria:Dialog widget to interact with
 * the popup container.
 */
module.exports = Aria.interfaceDefinition({
    $classpath : "aria.popups.container.IPopupContainer",
    $interface : {
        /**
         * Returns the DOM element of the container, to which the popup DOM element
         * and its mask will be appended.
         * @return {HTMLElement}
         */
        getContainerElt : function () {},

        /**
         * Returns aria.utils.Dom.VIEWPORT if the container is the viewport,
         * otherwise the DOM element of the container (as returned by getContainerElt).
         * @return {String|HTMLElement}
         */
        getContainerRef : function () {},

        /**
         * Returns an object containing the scroll position of the container.
         * @return {Object} Object with 'scrollLeft' and 'scrollTop' properties.
         */
        getContainerScroll : function () {},

        /**
         * Returns the overflow style of the container.
         * @return {String}
         */
        getContainerOverflow : function () {},

        /**
         * Changes the overflow style of the container.
         * Returns the previous value.
         * @param {String} new overflow value
         * @return {String} old overflow value
         */
        changeContainerOverflow : function (newValue) {},

        /**
         * Returns the position of the given domElt, in the coordinates of the container.
         * @param {HTMLElement} domElt element whose position will be returned
         * @return {aria.utils.DomBeans:Position}
         */
        calculatePosition : function (domElt) {},

        /**
         * Returns the size of the container's content (if this is larger than the value returned
         * by getClientSize, scrollbars are needed to view the full content).
         * @return {aria.utils.DomBeans:Size}
         */
        getScrollSize : function () {},

        /**
         * Returns the size of the container's client area.
         * @return {aria.utils.DomBeans:Size}
         */
        getClientSize : function () {},

        /**
         * Check if a given position + size couple can fit in the container.
         * @param {aria.utils.DomBeans:Position} position
         * @param {aria.utils.DomBeans:Size} size
         * @param {Object} base The base element used to account for scrolling offsets
         * @return {Boolean} True if the given position+size couple can fit in the current viewport
         */
        isInside : function (position, size, base) {},

        /**
         * Given a position + size couple, returns a corrected position that should fit in the container.
         * If the size is bigger than the container it returns a position such that the top left corner
         * of the element is in the container.
         * @param {aria.utils.DomBeans:Position} position
         * @param {aria.utils.DomBeans:Size} size
         * @param {Object} base The base element used to account for scrolling offsets
         * @return {aria.utils.DomBeans:Position}
         */
        fitInside : function (position, size, base) {},

        /**
         * Center the given size in the container.
         * @param {aria.utils.DomBeans:Size} size size of the element to center in the container
         * @param {Object} base The base element used to account for scrolling offsets
         * @return {aria.utils.DomBeans:Position} position of the element when centered in the container
         */
        centerInside : function (size, base) {}
    }
});

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
 * Implementation of the IPopupContainer interface to use any HTMLElement as a popup
 * container.
 */
Aria.classDefinition({
    $classpath : "aria.popups.container.DomElement",
    $implements : ["aria.popups.container.IPopupContainer"],
    $dependencies : ["aria.utils.Dom"],
    $constructor : function (container) {
        this.container = container;
    },
    $destructor : function () {
        this.container = null;
    },
    $statics : {
        BASE_NOT_IMPLEMENTED: "The 'base' parameter for the %1 method is not implemented."
    },
    $prototype : {
        /**
         * Returns the DOM element of the container, to which the popup DOM element
         * and its mask will be appended.
         * @return {HTMLElement}
         */
        getContainerElt : function () {
            return this.container;
        },

        /**
         * Returns the DOM element of the container (as returned by getContainerElt).
         * @return {String|HTMLElement}
         */
        getContainerRef : function () {
            return this.container;
        },

        /**
         * Returns an object containing the scroll position of the container.
         * @return {Object} Object with 'scrollLeft' and 'scrollTop' properties.
         */
        getContainerScroll : function () {
            var container = this.container;
            return {
                scrollLeft: container.scrollLeft,
                scrollTop: container.scrollTop
            };
        },

        /**
         * Returns the overflow style of the container.
         * @return {String}
         */
        getContainerOverflow : function () {
            return this.container.style.overflow;
        },

        /**
         * Changes the overflow style of the container.
         * Returns the previous value.
         * @param {String} new overflow value
         * @return {String} old overflow value
         */
        changeContainerOverflow : function (newValue) {
            var containerStyle = this.container.style;
            var res = containerStyle.overflow;
            containerStyle.overflow = newValue;
            return res;
        },

        /**
         * Returns the position of the given domElt, in the coordinates of the container.
         * @param {HTMLElement} domElt element whose position will be returned
         * @return {aria.utils.DomBeans:Position}
         */
        calculatePosition : function (domElt) {
            var position = aria.utils.Dom.calculatePosition(domElt);
            var container = this.container;
            var containerPosition = aria.utils.Dom.calculatePosition(container);
            return {
                left : position.left - containerPosition.left - container.clientLeft,
                top: position.top - containerPosition.top - container.clientTop
            };
        },

        /**
         * Returns the size of the container's content (if this is larger than the value returned
         * by getClientSize, scrollbars are needed to view the full content).
         * @return {aria.utils.DomBeans:Size}
         */
        getScrollSize : function () {
            var container = this.container;
            return {
                width: container.scrollWidth,
                height: container.scrollHeight
            };
        },

        /**
         * Returns the size of the container's client area.
         * @return {aria.utils.DomBeans:Size}
         */
        getClientSize : function () {
            var container = this.container;
            return {
                width: container.clientWidth,
                height: container.clientHeight
            };
        },

        /**
         * Returns the position and size of the container's client area, in the
         * container's coordinates.
         */
        _getGeometry : function () {
            var container = this.container;
            return {
                x: container.scrollLeft,
                y: container.scrollTop,
                width: container.clientWidth,
                height: container.clientHeight
            };
        },

        /**
         * Check if a given position + size couple can fit in the container.
         * @param {aria.utils.DomBeans:Position} position
         * @param {aria.utils.DomBeans:Size} size
         * @param {Object} base This parameter should not be defined (not implemented)
         * @return {Boolean} True if the given position+size couple can fit in the current viewport
         */
        isInside : function (position, size, base) {
            if (base) {
                this.$logError(this.BASE_NOT_IMPLEMENTED, ["isInside"]);
            }
            return aria.utils.Dom.isInside({
                x: position.left,
                y: position.top,
                width: size.width,
                height: size.height
            }, this._getGeometry());
        },

        /**
         * Given a position + size couple, returns a corrected position that should fit in the container.
         * If the size is bigger than the container it returns a position such that the top left corner
         * of the element is in the container.
         * @param {aria.utils.DomBeans:Position} position
         * @param {aria.utils.DomBeans:Size} size
         * @param {Object} base This parameter should not be defined (not implemented)
         * @return {aria.utils.DomBeans:Position}
         */
        fitInside : function (position, size, base) {
            if (base) {
                this.$logError(this.BASE_NOT_IMPLEMENTED, ["fitInside"]);
            }
            return aria.utils.Dom.fitInside({
                x: position.left,
                y: position.top,
                width: size.width,
                height: size.height
            },  this._getGeometry());
        },

        /**
         * Center the given size in the container.
         * @param {aria.utils.DomBeans:Size} size size of the element to center in the container
         * @param {Object} base This parameter should not be defined (not implemented)
         * @return {aria.utils.DomBeans:Position} position of the element when centered in the container
         */
        centerInside : function (size, base) {
            if (base) {
                this.$logError(this.BASE_NOT_IMPLEMENTED, ["centerInside"]);
            }
            var container = this.container;
            return {
                left : Math.floor(container.scrollLeft + (container.clientWidth - size.width) / 2),
                top : Math.floor(container.scrollTop + (container.clientHeight - size.height) / 2)
            };
        }

    }
});

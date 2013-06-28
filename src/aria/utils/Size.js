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
 * Handles sizes measurements and application for DOM elements
 * @class aria.utils.Size
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
    $classpath : 'aria.utils.Size',
    $dependencies : ['aria.utils.Math'],
    $singleton : true,
    $prototype : {

        /**
         * Get size of a DOM element
         * @param {HTMLElement} element
         * @return {Object} width and height
         */
        getSize : function (element) {
            return {
                width : element.offsetWidth,
                height : element.offsetHeight
            };
        },

        /**
         * Create a simple hidden DIV to be used by functions requiring to compute sizes for hidden elements
         * @return {HTMLElement}
         * @private
         */
        __createDomContainer : function () {
            var document = Aria.$window.document;
            var domContainer = document.createElement("div");
            domContainer.style.cssText = "position:absolute;top:0px;left:0px;visibility:hidden;display:block;width:0px;height:0px;";
            return document.body.appendChild(domContainer);
        },

        /**
         * Measure the size of an element without constrains
         * @param {HTMLElement} element
         * @return {Object} JSON object like { height : {Number}, width : {Number} }
         */
        getFreeSize : function (element) {
            // Note: as of 8/02/2012, getFreeSize doesn't seem to be used in the framework
            var domContainer = this.__createDomContainer();
            var parentNode = element.parentNode;
            domContainer.appendChild(element);

            var width = element.offsetWidth;
            var height = element.offsetHeight;

            var size = /** @type aria.utils.Dom.Size */
            {
                'width' : width,
                'height' : height
            };

            if (aria.utils.Type.isHTMLElement(parentNode)) {
                parentNode.appendChild(element);
            }

            // remove dom container:
            domContainer.parentNode.removeChild(domContainer);

            return size;
        },

        /**
         * Set the size of a given DOM element with contrains (min and max)
         * @param {HTMLElement} element
         * @param {Object} widthConf
         *
         * <pre>
         * {
         *     min : Integer
         *     max : Integer
         * }
         * </pre>
         *
         * @param {Object} heightConf
         *
         * <pre>
         * {
         *     min : Integer
         *     max : Integer
         * }
         * </pre>
         *
         * @return {Object} new width and height if one of them have changed
         */
        setContrains : function (element, widthConf, heightConf) {
            // PROFILING // var profilingId = this.$startMeasure("setContrains");
            var measured, newValue, result = {}, changedWidth = false, changedHeight = false;
            var changedOverflowY = false;
            var savedScrollBarY = element.style.overflowY;

            // for width
            if (widthConf) {
                measured = element.offsetWidth;
                newValue = aria.utils.Math.normalize(measured, widthConf.min, widthConf.max);
                if (newValue != measured) {
                    element.style.width = newValue + "px";
                    changedWidth = true;
                }
                result.width = newValue;
            }

            // for height
            if (heightConf) {
                measured = element.offsetHeight;
                newValue = aria.utils.Math.normalize(measured, heightConf.min, heightConf.max);
                if (newValue != measured) {
                    element.style.height = newValue + "px";
                    changedHeight = true;
                    changedOverflowY = (newValue < measured);
                    if (changedOverflowY) {
                        element.style.overflowY = "scroll";
                        if ((aria.core.Browser.isIE && aria.core.Browser.majorVersion < 8) || (aria.core.Browser.isMac)) {
                            var scrollbarSize = aria.templates.Layout.getScrollbarsWidth();
                            element.style['paddingRight'] = element.style['paddingRight'] === '' ? scrollbarSize + 'px' : (parseInt(element.style['paddingRight'], 10) + scrollbarSize) + "px";
                        }
                        // recalculate the width
                        var newWidth = aria.utils.Math.normalize(element.offsetWidth, widthConf.min, widthConf.max);
                        element.style.width = newWidth + "px";
                        changedWidth = true;
                        result.width = newWidth;
                    }
                }
                result.height = newValue;
            }

            if (changedWidth || changedHeight) {
                // update missing value
                if (!widthConf) {
                    result.width = element.offsetWidth;
                }
                if (!heightConf) {
                    result.height = element.offsetHeight;
                }

                if (changedOverflowY) {
                    element.style.overflowY = savedScrollBarY;
                    if ((aria.core.Browser.isIE && aria.core.Browser.majorVersion < 8)  || (aria.core.Browser.isMac)) {
                        var scrollbarSize = aria.templates.Layout.getScrollbarsWidth();
                        element.style['paddingRight'] = (parseInt(element.style['paddingRight'], 10) - scrollbarSize) + "px";
                    }
                }
                // PROFILING // this.$stopMeasure(profilingId);
                return result;
            }
            // PROFILING // this.$stopMeasure(profilingId);
            return null;
        }
    }
});
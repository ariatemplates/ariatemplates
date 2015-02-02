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
var ariaUtilsMath = require("./Math");
var ariaUtilsType = require("./Type");
var ariaTemplatesLayout = require("../templates/Layout");

/**
 * Handles sizes measurements and application for DOM elements
 * @class aria.utils.Size
 * @extends aria.core.JsObject
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.Size',
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

            var size = /** @type aria.utils.DomBeans:Size */
            {
                'width' : width,
                'height' : height
            };

            if (ariaUtilsType.isHTMLElement(parentNode)) {
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

            // for width
            if (widthConf) {
                measured = element.offsetWidth;
                newValue = ariaUtilsMath.normalize(measured, widthConf.min, widthConf.max);
                if (newValue != measured) {
                    element.style.width = newValue + "px";
                    changedWidth = true;
                }
                result.width = newValue;
            }

            // for height
            if (heightConf) {
                measured = element.offsetHeight;
                newValue = ariaUtilsMath.normalize(measured, heightConf.min, heightConf.max);
                if (newValue != measured) {
                    element.style.height = newValue + "px";
                    changedHeight = true;
                    changedOverflowY = (newValue < measured);
                    if (changedOverflowY) {
                        var additionalWidth = ariaTemplatesLayout.getScrollbarsMeasuredWidth() + 1;
                        // recalculate the width
                        var newWidth = ariaUtilsMath.normalize(element.offsetWidth + additionalWidth, widthConf.min, widthConf.max);

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
                // PROFILING // this.$stopMeasure(profilingId);
                return result;
            }
            // PROFILING // this.$stopMeasure(profilingId);
            return null;
        }
    }
});

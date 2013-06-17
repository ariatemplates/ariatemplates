/*
 * Copyright 2013 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.utils.overlay.loadingIndicator.IndicatorHelper",
    $singleton : true,
    $constructor : function () {},
    $prototype : {
        __getOverlay : function () {
            var document = Aria.$window.document;
            var divs = document.getElementsByTagName("div");

            // Start from the end, should be faster
            for (var i = divs.length - 1; i >= 0; i -= 1) {
                var id = divs[i].id;
                if (id && id.indexOf("xOverlay") === 0) {
                    return divs[i];
                }
            }

            return false;
        },
        isInDom : function () {
            return !!this.__getOverlay();
        },

        getText : function () {
            var overlay = this.__getOverlay();

            if (!overlay || !overlay.firstChild) {
                return false;
            } else {
                return overlay.firstChild.innerHTML;
            }
        },

        totalOverlays : function () {
            var overlays = aria.utils.DomOverlay.overlays, count = 0;
            for (var num in overlays) {
                if (overlays.hasOwnProperty(num)) {
                    count += 1;
                }
            }

            if (aria.utils.DomOverlay.bodyOverlay) {
                count += 1;
            }

            return count;
        },

        countInDom : function () {
            var document = Aria.$window.document;
            var divs = document.getElementsByTagName("div");
            var count = 0;

            // Start from the end, should be faster
            for (var i = divs.length - 1; i >= 0; i -= 1) {
                var id = divs[i].id;
                if (id && id.indexOf("xOverlay") === 0) {
                    count += 1;
                }
            }

            return count;
        },

        /**
         * Return the overlay associated to that element
         * @param {HTMLElement} element
         * @return {Object} object with overlay and id properties
         */
        getOverlay : function (element) {
            return aria.utils.DomOverlay.__getOverlay(element);
        }
    }
});

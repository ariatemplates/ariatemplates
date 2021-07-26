/*
 * Copyright 2016 Amadeus s.a.s.
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

var ariaUtilsDom = require('./Dom');



/**
 * Utilities for accessibility, interactions with screen readers, etc.
 *
 * @class aria.utils.Accessibility
 * @extends aria.core.JsObject
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.Accessibility',
    $singleton : true,

    $prototype : {
        /**
         * Forces the screen reader to read the given piece of text.
         *
         * <p>The options object can contain the following properties: </p>
         * <ul>
         *  <li><em>parent</em>: the DOM element in which to put the temporarily generated element</li>
         *  <li><em>alert</em>: whether or not to treat the generated element as an alert (role = "alert" instead of "status")</li>
         * </ul>
         *
         * @param {String} text The text to be read
         * @param {Object} options Optional options object, see description for more information.
         */
        readText : function (text, options) {
            // -------------------------------------- input arguments processing

            var document = Aria.$window.document;

            if (options == null) {
                options = {};
            }

            var parent = options.parent;
            if (parent == null) {
                parent = document.body;
            }

            var alert = options.alert;

            // ------------------------------------------------------ processing

            var waiReadTextElt = document.createElement("span");
            waiReadTextElt.className = "xSROnly";
            waiReadTextElt.setAttribute("role", alert ? "alert" : "status");
            waiReadTextElt.setAttribute("aria-live", "assertive");
            waiReadTextElt.setAttribute("aria-relevant", "additions");
            if (alert) {
                waiReadTextElt.style.visibility = "hidden";
            }
            parent.appendChild(waiReadTextElt);

            var nextStep = function () {
                var textChild = document.createElement("span");
                var textNode = document.createTextNode(text);
                textChild.appendChild(textNode);
                waiReadTextElt.appendChild(textChild);

                if (alert) {
                    waiReadTextElt.style.visibility = "visible";
                }

                setTimeout(function () {
                    ariaUtilsDom.removeElement(waiReadTextElt);
                }, 500);
            };
            if (alert) {
                nextStep();
            } else {
                setTimeout(nextStep, 200);
            }
        }
    }
});

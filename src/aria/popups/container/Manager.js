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
 * This class allows to create and release popup containers.
 */
Aria.classDefinition({
    $classpath : "aria.popups.container.Manager",
    $dependencies : ["aria.utils.Dom", "aria.utils.Type", "aria.popups.container.Viewport",
        "aria.popups.container.DomElement"],
    $singleton : true,
    $statics : {
        ID_NOT_FOUND : "Missing element with id '%1' in DOM."
    },
    $prototype : {
        /**
         * Creates (if needed) and returns a popup container object corresponding to the given DOM element.
         * The return value is an object which implements the aria.popups.container.IPopupContainer interface.
         * When the returned object is no longer useful, it has to be released with the releasePopupContainer
         * method.
         * @param {String|HTMLElement} idOrElt Id of an element or
         * @return {Object}
         */
        createPopupContainer : function (idOrElt) {
            var domElt = idOrElt;
            if (aria.utils.Type.isString(idOrElt)) {
                domElt = aria.utils.Dom.getElementById(idOrElt);
                if (!domElt) {
                    this.$logError(this.ID_NOT_FOUND, [idOrElt]);
                }
            }
            var body = Aria.$window.document.body;
            domElt = domElt || body;
            return (domElt == body ? aria.popups.container.Viewport : new aria.popups.container.DomElement(domElt));
        },

        /**
         * This method should be called with the value returned by createPopupContainer when it is no longer
         * useful, to properly dispose it.
         * @param {Object} instance Value returned by createPopupContainer.
         */
        releasePopupContainer : function (instance) {
            if (instance instanceof aria.popups.container.DomElement) {
                instance.$dispose();
            }
        }
    }
 });

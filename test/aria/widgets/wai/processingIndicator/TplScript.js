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

var Aria = require('ariatemplates/Aria');

var ariaUtilsString = require('ariatemplates/utils/String');
var subst = ariaUtilsString.substitute;



module.exports = Aria.tplScriptDefinition({
    $classpath: 'test.aria.widgets.wai.processingIndicator.TplScript',

    $prototype: {
        ////////////////////////////////////////////////////////////////////////
        // Data
        ////////////////////////////////////////////////////////////////////////

        $dataReady: function() {
            // -----------------------------------------------------------------

            var data = this.data;

            // -----------------------------------------------------------------

            var loadingElementName = this.data.section ? 'section' : 'div';

            data.elements = {
                // -------------------------------------------------------------

                before: {
                    id: 'element_before',
                    content: 'focus me'
                },

                after: {
                    id: 'element_after',
                    content: 'focus me'
                },

                // -------------------------------------------------------------

                previous: {
                    id: 'previous_element',
                    content: 'previous element'
                },

                loading: {
                    id: 'loading_element',
                    content: subst('loading %1', loadingElementName),
                    message: subst('loading %1 message', loadingElementName),
                    overlaySet: false
                },

                next: {
                    id: 'next_element',
                    content: 'next element'
                },

                // -------------------------------------------------------------

                toggleOverlay: {
                    id: 'toggle_overlay',
                    content: 'toggle overlay'
                }
            };

            // -----------------------------------------------------------------

            data.readInterval = 2500;
            data.readOnceFirst = false;

            data.stepsDefaultDelay = 500;
            data.listeningTime = 4000;
        },



        ////////////////////////////////////////////////////////////////////////
        // Actions
        ////////////////////////////////////////////////////////////////////////

        toggleOverlay: function () {
            if (this.data.section) {
                this.toggleOverlayOnSection();
            } else {
                this.toggleOverlayOnDiv();
            }
        },

        toggleOverlayOnDiv: function () {
            // --------------------------------------------------- destructuring

            var data = this.data;

            // options ---------------------------------------------------------

            var readInterval = data.readInterval;
            var readOnceFirst = data.readOnceFirst;

            // element ---------------------------------------------------------

            var element = data.elements.loading;
            var id = element.id;
            var message = element.message;
            var overlaySet = element.overlaySet;

            // ------------------------------------------------------ processing

            var value = !overlaySet;
            element.overlaySet = value;

            var domElement = this.$getElementById(id);
            domElement.setProcessingIndicator(value, {
                message: message,
                waiAria: true,
                waiAriaReadInterval: readInterval,
                waiAriaReadOnceFirst: readOnceFirst
            });
            domElement.$dispose();
        },

        toggleOverlayOnSection: function () {
            // --------------------------------------------------- destructuring

            var element = this.data.elements.loading;
            var overlaySet = element.overlaySet;

            // ------------------------------------------------------ processing

            var value = !overlaySet;
            this.$json.setValue(element, 'overlaySet', value);
        }
    }
});

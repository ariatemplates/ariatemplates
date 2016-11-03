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

var ariaUtilsArray = require('ariatemplates/utils/Array');
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

            data.elements = {
                before: {
                    id: 'element_before',
                    content: 'focus me'
                },
                div: {
                    content: 'Div',
                    id: 'div',
                    message: 'Loading div',
                    overlaySet: false
                },
                section: {
                    content: 'Section',
                    id: 'section',
                    message: 'Loading section',
                    overlaySet: false
                },

                toggleDivOverlay: {
                    content: 'Toggle Div overlay',
                    id: 'toggle_div_overlay'
                },

                toggleSectionOverlay: {
                    content: 'Toggle Section overlay',
                    id: 'toggle_section_overlay'
                }
            };

            // -----------------------------------------------------------------

            // Timing is important in this test, so let's calculate.
            // By default, each user step in the test scenario introduces a delay after. This delay time is set by the property "stepsDefaultDelay" below.
            // By looking at the scenario, we can see four steps (involving some content to be read by the screen reader) between the moment we activate the processing indicator and the one we are simply waiting for its message to be read periodically.
            // To make things more predictive, we don't want the processing indicator's message to be read once first, that is when we are doing the additional steps mentioned above (where other things should be read). Hence the property below "readOnceFirst" set to "false".
            // Now, we would like to hear the message twice. Let's compute:
            // - there are four steps, with a delay of "stepsDefaultDelay", so 4 * stepsDefaultDelay, before we simply wait
            // Then the read interval is "readInterval" and we want to hear it twice, so we need to have a total delay of readInterval * 2 + some spare time
            // Therefore the remaining, additional delay should be of "readInterval * 2 + some spare time - 4 * stepsDefaultDelay"
            // With current values below, it makes (assuming some spare time to be 500): 2500 * 2 + 500 - 4 * 500 = 3500

            data.readInterval = 2500;
            data.readOnceFirst = false;

            data.stepsDefaultDelay = 500;
            data.listeningTime = 3500;
        },

        setOverlayOnDiv: function () {
            var data = this.data;
            var div = data.elements.div;

            var value = !div.overlaySet;
            div.overlaySet = value;

            var element = this.$getElementById(div.id);
            element.setProcessingIndicator(value, {
                message: div.message,
                waiAria: true,
                waiAriaReadInterval: data.readInterval,
                waiAriaReadOnceFirst: data.readOnceFirst
            });
        },

        setOverlayOnSection: function () {
            var section = this.data.elements.section;

            var value = !section.overlaySet;
            this.$json.setValue(section, 'overlaySet', value);
        }
    }
});

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

Aria.tplScriptDefinition({
    $classpath: 'test.aria.widgets.wai.datePicker.readDate.TplScript',

    $prototype: {
        ////////////////////////////////////////////////////////////////////////
        // Data
        ////////////////////////////////////////////////////////////////////////

        $dataReady: function() {
            // -----------------------------------------------------------------

            var data = this.data;

            // -----------------------------------------------------------------

            var elements = {};
            data.elements = elements;

            var before = {
                id: 'element_before',
                content: 'focus me'
            };
            elements.before = before;

            // -----------------------------------------------------------------

            var binding = {
                inside: {},
                to: 'date'
            };
            binding.inside[binding.to] = new Date(2016, 8, 6, 12);

            var confirmDateDelay = data.confirmDateDelay;
            var confirmDateFormat = 'EEEE d MMMM yyyy';

            var widgets = this.map([
                'one',
                'two'
            ], function (name) {
                return {
                    label: 'calendar ' + name + ' label',
                    waiAria: true,
                    waiAriaCalendarLabel: 'calendar ' + name,
                    waiIconLabel: 'calendar ' + name + ' button',
                    bind: {value: binding},
                    waiAriaConfirmDateDelay: confirmDateDelay,
                    waiAriaConfirmDateFormat: confirmDateFormat
                };
            });
            data.widgets = widgets;
        },



        ////////////////////////////////////////////////////////////////////////
        // Helpers
        ////////////////////////////////////////////////////////////////////////

        map : function (array, callback, thisArg) {
            var result = [];
            for (var index = 0, length = array.length; index < length; index++) {
                result.push(callback(array[index], index, array));
            }
            return result;
        }
    }
});

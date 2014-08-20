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

{Template {
    $classpath:"test.aria.widgets.form.datepicker.bindableMinMax.DatePickerTpl",
    $hasScript: true
}}

    {macro main()}
        <div {on keydown domKeyDown/}>
            {@aria:DatePicker {
                id: "DPInit",
                label : "Date",
                autoselect: true,
                bind : {
                    value: {"to" : "boundValueDPInit", "inside": data}
                }
            }/}

            {@aria:DatePicker {
                id: "DPMinT",
                label : "Date",
                autoselect: true,
                bind : {
                    value: {"to" : "boundValueDPMinT", "inside": data},
                    "minValue":{"to":"boundValueDPInit","inside":data}
                }
            }/}

            {@aria:DatePicker {
                id: "DPMinF",
                label : "Date",
                autoselect: true,
                bind : {
                    value: {"to" : "boundValueDPMinF", "inside": data},
                    "minValue":{"to":"boundValueDPInit","inside":data}
                }
            }/}

            {@aria:DatePicker {
                id: "DPMaxT",
                label : "Date",
                autoselect: true,
                bind : {
                    value: {"to" : "boundValueDPMaxT", "inside": data},
                    "maxValue":{"to":"boundValueDPInit","inside":data}
                }
            }/}

            {@aria:DatePicker {
                id: "DPMaxF",
                label : "Date",
                autoselect: true,
                bind : {
                    value: {"to" : "boundValueDPMaxF", "inside": data},
                    "maxValue":{"to":"boundValueDPInit","inside":data}
                }
            }/}

            {@aria:TextField {
                id : "TBdummy",
                label: "Dummy Text"
            }/}
        </div>
    {/macro}

{/Template}

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
{Template {
    $classpath : "test.aria.widgets.wai.popup.errortooltip.ErrorTooltipTestCaseTpl",
    $hasScript: true
}}

    {macro main()}
        {call fields(false)/}
    {/macro}

    {macro fields(waiAria)}
        {call field_tf(waiAria)/}
        {call field_ta(waiAria)/}
        {call field_nf(waiAria)/}
        {call field_df(waiAria)/}
        {call field_time(waiAria)/}
        {call field_dp(waiAria)/}
        {call field_ac(waiAria)/}
        {call field_ms(waiAria)/}
        {call field_sb(waiAria)/}
        {call field_mac(waiAria)/}
    {/macro}

    {macro field_tf(waiAria)}
        {@aria:TextField {
            id: "tf",
            directOnBlurValidation:true,
            label: "Textfield",
            labelWidth: 200,
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"tf"
                }
            }
        }/}<br>
    {/macro}

    {macro field_ta(waiAria)}
        {@aria:Textarea {
            id: "ta",
            directOnBlurValidation:true,
            label: "Textarea",
            labelWidth: 200,
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"ta"
                }
            }
        }/}<br>
    {/macro}

    {macro field_nf(waiAria)}
        {@aria:NumberField {
            id: "nf",
            directOnBlurValidation:true,
            label: "Number field",
            labelWidth: 200,
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"nf"
                }
            }
        }/}<br>
    {/macro}

    {macro field_df(waiAria)}
        {@aria:DateField {
            id: "df",
            directOnBlurValidation:true,
            label: "Date field",
            labelWidth: 200,
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"df"
                }
            }
        }/}<br>
    {/macro}

    {macro field_time(waiAria)}
        {@aria:TimeField {
            id: "time",
            directOnBlurValidation:true,
            label: "Time field",
            labelWidth: 200,
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"time"
                }
            }
        }/}<br>
    {/macro}

    {macro field_dp(waiAria)}
        {@aria:DatePicker {
            id: "dp",
            directOnBlurValidation:true,
            label: "Datepicker",
            labelWidth: 200,
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"dp"
                }
            }
        }/}<br>
    {/macro}

    {macro field_ac(waiAria)}
        {@aria:AutoComplete {
            id: "ac",
            directOnBlurValidation:true,
            label: "Autocomplete",
            labelWidth: 200,
            resourcesHandler: this.airlinesHandler,
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"ac"
                }
            }
        }/}<br>
    {/macro}

    {macro field_ms(waiAria)}
        {@aria:MultiSelect {
            id: "ms",
            directOnBlurValidation:true,
            label: "Multiselect",
            labelWidth: 200,
            items: [{value : "a", label : "a"},{value : "b", label : "b"}],
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"ms"
                }
            }
        }/}<br>
    {/macro}

    {macro field_sb(waiAria)}
        {@aria:SelectBox {
            id: "sb",
            directOnBlurValidation:true,
            label: "Selectbox",
            labelWidth: 200,
            options: [{label : "a", value : "a"},{label : "b", value : "b"}],
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"sb"
                }
            }
        }/}<br>
    {/macro}

    {macro field_mac(waiAria)}
        {@aria:MultiAutoComplete {
            id: "mac",
            directOnBlurValidation:true,
            freeText: false,
            label: "MultiAutoComplete",
            labelWidth: 200,
            resourcesHandler: this.airlinesHandler,
            waiAria: waiAria,
            bind: {
                "value": {
                    inside:data, to:"mac"
                }
            }
        }/}<br>
    {/macro}

{/Template}

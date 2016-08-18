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
{Template {
    $classpath : "test.aria.widgets.wai.input.radiobutton.initiallyDisabled.InitiallyDisabledRadioButtonsTpl",
    $hasScript : true
}}

    {macro main()}
        <input {id "tf1"/}>
        <div style="margin:10px;" role="radiogroup">
            {@aria:RadioButton {
                waiAria : true,
                keyValue: "auto",
                label : "Automatic",
                bind: {
                  value: {
                    to: "firstGroup",
                    inside: data
                  }
                }
            }/}<br>
            {@aria:RadioButton {
                waiAria : true,
                keyValue: "manual",
                label : "Manual",
                bind: {
                  value: {
                    to: "firstGroup",
                    inside: data
                  }
                }
            }/}<br>
        <div style="padding-left:10px;" role="radiogroup">
            {@aria:RadioButton {
                waiAria : true,
                keyValue: "opt1",
                label : "Manual option 1",
                bind: {
                    value: {
                        to: "manualOption",
                        inside: data
                    },
                    disabled: {
                        to: "firstGroup",
                        inside: data,
                        transform: areManualOptsDisabled
                    }
                }
            }/}<br>
            {@aria:RadioButton {
                waiAria : true,
                keyValue: "opt2",
                label : "Manual option 2",
                bind: {
                    value: {
                        to: "manualOption",
                        inside: data
                    },
                    disabled: {
                        to: "firstGroup",
                        inside: data,
                        transform: areManualOptsDisabled
                    }
                }
            }/}<br>
            {@aria:RadioButton {
                waiAria : true,
                keyValue: "opt3",
                label : "Manual option 3",
                disabled: true,
                bind: {
                    value: {
                        to: "manualOption",
                        inside: data
                    }
                }
            }/}<br>
            {@aria:RadioButton {
                waiAria : true,
                keyValue: "opt4",
                label : "Manual option 4",
                bind: {
                    value: {
                        to: "manualOption",
                        inside: data
                    },
                    disabled: {
                        to: "firstGroup",
                        inside: data,
                        transform: areManualOptsDisabled
                    }
                }
            }/}
        </div>
        </div>
        <input {id "tf2"/}>
    {/macro}

{/Template}

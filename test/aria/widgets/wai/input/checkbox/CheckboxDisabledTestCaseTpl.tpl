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
    $classpath : "test.aria.widgets.wai.input.checkbox.CheckboxDisabledTestCaseTpl"
}}

    {macro main()}
        <div style="margin:10px;font-size:+3;font-style:bold;">This test needs focus.</div>
        <fieldset style="margin:10px;">
            <legend>State of the checkboxes</legend>
            {@aria:CheckBox {
                waiAria : true,
                waiLabelHidden : true,
                label : "Checked",
                labelWidth: 100,
                bind: {
                    value: {
                        to: "checkboxChecked",
                        inside: data
                    }
                }
            }/}<br>
            {@aria:CheckBox {
                waiAria : true,
                waiLabelHidden : true,
                label : "Disabled",
                labelWidth: 100,
                bind: {
                    value: {
                        to: "checkboxDisabled",
                        inside: data
                    }
                }
            }/}
        </fieldset>

        {@aria:TextField {
            id : "tf1",
            waiAria : true,
            waiLabelHidden : true,
            label : "First textfield",
            labelWidth: 100,
            value: "",
            margins: "10 10 10 10"
        }/}

        {call checkBoxes("std") /}
        {call checkBoxes("simple") /}

        {@aria:TextField {
            id : "tf2",
            waiAria : true,
            waiLabelHidden : true,
            label : "Last textfield",
            labelWidth: 100,
            value: "",
            margins: "10 10 10 10"
        }/}

    {/macro}

    {macro checkBoxes(sclass)}
        <div style="margin:10px;">
            {@aria:CheckBox {
                waiAria : true,
                waiLabelHidden : true,
                label : sclass + " input 1",
                labelWidth: 100,
                sclass: sclass,
                bind: {
                    disabled: {
                        to: "checkboxDisabled",
                        inside: data
                    },
                    value: {
                        to: "checkboxChecked",
                        inside: data
                    }
                }
            }/}
            {@aria:CheckBox {
                waiAria : true,
                waiLabelHidden : true,
                label : sclass + " input 2",
                waiLabelHidden: true,
                waiLabel : sclass + " input 2",
                labelWidth: 100,
                sclass: sclass,
                bind: {
                    disabled: {
                        to: "checkboxDisabled",
                        inside: data
                    },
                    value: {
                        to: "checkboxChecked",
                        inside: data
                    }
                }
            }/}
            <span class="xSROnly" id="${sclass+"input3Label"}" aria-hidden="true">${sclass} input 3</span>
            {@aria:CheckBox {
                waiAria : true,
                waiLabelHidden : true,
                label: sclass + " input 3",
                waiLabelHidden: true,
                waiLabelledBy: sclass + "input3Label",
                labelWidth: 100,
                sclass: sclass,
                bind: {
                    disabled: {
                        to: "checkboxDisabled",
                        inside: data
                    },
                    value: {
                        to: "checkboxChecked",
                        inside: data
                    }
                }
            } /}
        </div>
    {/macro}

{/Template}

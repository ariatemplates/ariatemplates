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
    $classpath : "test.aria.widgets.wai.input.checkbox.CheckboxTestCaseTpl",
    $hasScript : false
}}

    {macro main()}
        <div style="margin:10px;font-size:+3;font-style:bold;">This test needs focus.</div>
        {@aria:TextField {
            id : "tf1",
            waiAria : true,
            waiLabelHidden : true,
            label : "First textfield",
            labelWidth: 100,
            value: ""
        }/}

        <div style="margin:10px;">
            {@aria:CheckBox {
                id : "checkboxA",
                waiAria : true,
                waiLabelHidden : true,
                label : "Checkbox A",
                labelWidth: 100,
                sclass: data.sclass,
                bind: {
                  value: {
                    to: "checkedValue1",
                    inside: data
                  }
                }
            }/}
            {@aria:CheckBox {
                id : "checkboxB",
                waiAria : true,
                waiLabelHidden : true,
                label : "Checkbox B",
                labelWidth: 100,
                sclass: data.sclass,
                bind: {
                  value: {
                    to: "checkedValue2",
                    inside: data
                  }
                }
            }/}
            {@aria:CheckBox {
                id : "checkboxC",
                waiAria : true,
                waiLabelHidden : true,
                label : "Checkbox C",
                labelWidth: 100,
                sclass: data.sclass,
                bind: {
                  value: {
                    to: "checkedValue3",
                    inside: data
                  }
                }
            }/}
        </div>
        {@aria:TextField {
            waiAria : true,
            waiLabelHidden : true,
            id : "tf2",
            label : "Last textfield",
            labelWidth: 100,
            value: ""
        }/}

    {/macro}

{/Template}

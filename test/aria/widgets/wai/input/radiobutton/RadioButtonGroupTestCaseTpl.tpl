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
    $classpath : "test.aria.widgets.wai.input.radiobutton.RadioButtonGroupTestCaseTpl",
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

        <div style="margin:10px;" role="radiogroup">
            {@aria:RadioButton {
                id : "radioA",
                keyValue: "a",
                waiAria : true,
                waiLabelHidden : true,
                label : "Radio A",
                labelWidth: 100,
                sclass: data.sclass,
                bind: {
                  value: {
                    to: "checkedValue",
                    inside: data
                  }
                }
            }/}
            {@aria:RadioButton {
                id : "radioB",
                keyValue: "b",
                waiAria : true,
                waiLabelHidden : true,
                label : "Radio B",
                labelWidth: 100,
                sclass: data.sclass,
                bind: {
                  value: {
                    to: "checkedValue",
                    inside: data
                  }
                }
            }/}
            {@aria:RadioButton {
                id : "radioC",
                keyValue: "c",
                waiAria : true,
                waiLabelHidden : true,
                label : "Radio C",
                labelWidth: 100,
                sclass: data.sclass,
                bind: {
                  value: {
                    to: "checkedValue",
                    inside: data
                  }
                }
            }/}
        </div>
        {@aria:TextField {
            id : "tf2",
            waiAria : true,
            waiLabelHidden : true,
            label : "Last textfield",
            labelWidth: 100,
            value: ""
        }/}

    {/macro}

{/Template}

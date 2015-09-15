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
    $classpath : "test.aria.widgets.wai.input.radiobutton.RadioButtonTestCaseTpl",
    $hasScript : false
}}

    {macro main()}
        <div style="margin:10px;font-size:+3;font-style:bold;">This test needs focus.</div>
        <div style="margin:10px;">
            Using default accessibility and a label defined: <br>
            {@aria:RadioButton {
                id : "default - with label",
                keyValue: "a",
                label : "default - with label",
                labelWidth: 100,
                sclass: data.sclass,
                bind: {
                  disabled: {
                    to: "disableRadio",
                    inside: data
                  }
                }
            }/} <br><br>
            Using default accessibility and no label defined: <br>
            {@aria:RadioButton {
                id : "default - no label",
                keyValue: "a",
                labelWidth: 100,
                sclass: data.sclass,
                bind: {
                  disabled: {
                    to: "disableRadio",
                    inside: data
                  }
                }
            }/} <br><br>
            With accessibility enabled and a label defined but hidden: <br>
            {@aria:RadioButton {
                id : "enabled - with label hidden",
                keyValue: "a",
                waiAria : true,
                label : "enabled - with label hidden",
                labelWidth: 100,
                hideLabel: true,
                sclass: data.sclass,
                bind: {
                  disabled: {
                    to: "disableRadio",
                    inside: data
                  },
                  value: {
                    to: "checkedValue",
                    inside: data
                  }
                }
            }/} <br><br>
            With accessibility enabled and a bound label defined but hidden: <br>
            {@aria:RadioButton {
                id : "enabled - with bound label hidden",
                keyValue: "a",
                waiAria : true,
                label : "enabled - with bound label hidden",
                labelWidth: 100,
                hideLabel: true,
                sclass: data.sclass,
                bind: {
                  label: {
                    to: "label",
                    inside: data
                  },
                  disabled: {
                    to: "disableRadio",
                    inside: data
                  }
                }
            }/} <br><br>
            With accessibility enabled and a label defined: <br>
            {@aria:RadioButton {
                id : "enabled - with label",
                keyValue: "a",
                waiAria : true,
                label : "enabled - with label",
                labelWidth: 100,
                sclass: data.sclass,
                bind: {
                  disabled: {
                    to: "disableRadio",
                    inside: data
                  }
                }
            }/} <br><br>
            With accessibility enabled and no label defined: <br>
            {@aria:RadioButton {
                id : "enabled - no label",
                keyValue: "a",
                waiAria : true,
                sclass: data.sclass,
                bind: {
                  disabled: {
                    to: "disableRadio",
                    inside: data
                  }
                }
            }/}<br><br>
            With accessibility disabled and a label defined: <br>
            {@aria:RadioButton {
                id : "disabled - with label",
                keyValue: "a",
                label : "disabled - with label",
                waiAria : false,
                sclass: data.sclass,
                bind: {
                  disabled: {
                    to: "disableRadio",
                    inside: data
                  }
                }
            }/}<br><br>
            With accessibility disabled and no label defined: <br>
            {@aria:RadioButton {
                id : "disabled - no label",
                keyValue: "a",
                waiAria : false,
                sclass: data.sclass,
                bind: {
                  disabled: {
                    to: "disableRadio",
                    inside: data
                  }
                }
            }/}
        </div>

    {/macro}

{/Template}

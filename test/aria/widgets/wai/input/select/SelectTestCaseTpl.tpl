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
    $classpath : "test.aria.widgets.wai.input.select.SelectTestCaseTpl",
    $hasScript : false
}}

    {macro main()}
        <div style="margin:10px;font-size:+3;font-style:bold;">This test needs focus.</div>
        <div style="margin:10px;">
            Using default accessibility and a label defined: <br>
            {@aria:Select {
                id : "default - with label",
                label : "default - with label",
                labelWidth: 100,
                value: "default - with label"
            }/} <br><br>
            Using default accessibility and no label defined: <br>
            {@aria:Select {
                id : "default - no label",
                labelWidth: 100,
                value: "default - no label"
            }/} <br><br>
            With accessibility enabled and a label defined but hidden: <br>
            {@aria:Select {
                id : "enabled - with label hidden",
                waiAria : true,
                label : "enabled - with label hidden",
                labelWidth: 100,
                value: "enabled - with label hidden",
                hideLabel: true
            }/} <br><br>
            With accessibility enabled and a bound label defined but hidden: <br>
            {@aria:Select {
                id : "enabled - with bound label hidden",
                waiAria : true,
                label : "enabled - with bound label hidden",
                labelWidth: 100,
                value: "enabled - with bound label hidden",
                hideLabel: true,
                bind: {
                  label: {
                    to: "label",
                    inside: data
                  }
                }
            }/} <br><br>
            With accessibility enabled and a label defined: <br>
            {@aria:Select {
                id : "enabled - with label",
                waiAria : true,
                label : "enabled - with label",
                labelWidth: 100,
                value: "enabled - with label"
            }/} <br><br>
            With accessibility enabled and no label defined: <br>
            {@aria:Select {
                id : "enabled - no label",
                waiAria : true,
                value: "enabled - no label"
            }/}<br><br>
            With accessibility disabled and a label defined: <br>
            {@aria:Select {
                id : "disabled - with label",
                label : "disabled - with label",
                waiAria : false,
                value: "disabled - with label"
            }/}<br><br>
            With accessibility disabled and no label defined: <br>
            {@aria:Select {
                id : "disabled - no label",
                waiAria : false,
                value: "disabled - no label"
            }/}
        </div>

    {/macro}

{/Template}

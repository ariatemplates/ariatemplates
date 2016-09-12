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
    $classpath : "test.aria.widgets.wai.textInputBased.MandatoryJawsTestCaseTpl"
}}
    {macro main()}
        <div style="margin:10px;font-size:+3;font-weight:bold;">Mandatory accessibility sample</div>
        <div style="margin:10px; overflow: auto; height: 600px;">
            With accessibility enabled: <br><br>
            {call numberField("nfWaiEnabledStart") /}<br>
            {call textArea("taWaiEnabledStart") /}<br>
            {call textField("tfWaiEnabledStart") /}<br>
        </div>
    {/macro}

    {macro numberField(id)}
        <input type="text" {id id/}>
        {@aria:NumberField {
            waiAria : true,
            mandatory: true
        }/} <br><br>
    {/macro}

    {macro textArea(id)}
        <input type="text" {id id/}>
        {@aria:Textarea {
            waiAria : true,
            mandatory: true
        }/} <br><br>
    {/macro}

    {macro textField(id)}
        <input type="text" {id id/}>
        {@aria:TextField {
            waiAria : true,
            mandatory: true
        }/} <br><br>
    {/macro}

{/Template}

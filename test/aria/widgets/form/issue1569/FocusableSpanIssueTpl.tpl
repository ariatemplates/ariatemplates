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
    $classpath: "test.aria.widgets.form.issue1569.FocusableSpanIssueTpl"
}}

    {macro main()}
        <div style="margin: 10px;">
            <input {id "start"/}><br><br>
            {@aria:TextField {
                id: "textfield1",
                label: "Text field"
            }/}<br><br>
            {@aria:TextField {
                id: "textfield2",
                sclass: "simple",
                label: "Text field"
            }/}<br><br>
            {@aria:TextField {
                id: "textfield3",
                sclass: "simpleframe",
                label: "Text field"
            }/}<br><br>
            {@aria:Button {
                id: "button",
                label: "Button"
            }/}<br><br>
            {@aria:Textarea {
                id: "textarea",
                label: "Textarea"
            }/}<br><br>
            <input {id "end"/}>
        </div>
    {/macro}

{/Template}

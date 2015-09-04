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
    $classpath : "test.aria.widgets.form.textinput.helpText.HelpTextTestCaseTpl",
    $extends : "test.aria.widgets.form.textinput.onclick.OnClickTemplate"
}}

    {macro main()}
        {call fields("std")/}
        {call fields("alt")/}
        {@aria:TextField {
            id: "end"
        }/}<br>
    {/macro}

    {macro fields(sclass)}
        {@aria:TextField {
            id: "tf" + sclass,
            sclass: sclass,
            helptext: "Type something here"
        }/}<br>
        {@aria:Textarea {
            id: "ta" + sclass,
            sclass: sclass,
            helptext: "Type something here"
        }/}<br>
        {@aria:NumberField {
            id: "nf" + sclass,
            sclass: sclass,
            helptext: "Type something here"
        }/}<br>
        {@aria:DateField {
            id: "df" + sclass,
            sclass: sclass,
            helptext: "Type something here"
        }/}<br>

        {@aria:TimeField {
            id: "time" + sclass,
            sclass: sclass,
            helptext: "Type something here"
        }/}<br>
        {@aria:DatePicker {
            id: "dp" + sclass,
            sclass: sclass,
            helptext: "Type something here"
        }/}<br>
        {@aria:AutoComplete {
            id: "ac" + sclass,
            sclass: sclass,
            helptext: "Type something here",
            resourcesHandler: this.airlinesHandler
        }/}<br>
        {@aria:MultiSelect {
            id: "ms" + sclass,
            sclass: sclass,
            helptext: "Type something here",
            items: [{value : "a", label : "a"},{value : "b", label : "b"}]
        }/}<br>
        {@aria:SelectBox {
            id: "sb" + sclass,
            sclass: sclass,
            helptext: "Type something here",
            options: [{label : "a", value : "a"},{label : "b", value : "b"}]
        }/}<br>
        {@aria:MultiAutoComplete {
            id: "mac" + sclass,
            sclass: sclass,
            freeText: false,
            helptext: "Type something here",
            resourcesHandler: this.airlinesHandler
        }/}<br>
    {/macro}
{/Template}

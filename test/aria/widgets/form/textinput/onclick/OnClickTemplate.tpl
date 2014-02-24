/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.textinput.onclick.OnClickTemplate",
    $hasScript : true
}}
    {macro main()}

        {@aria:TextField {
            id: "tf",
            onclick:{fn:onaction},
            value : "aaa"
        }/}

        {@aria:NumberField {
            id: "nf",
            onclick:{fn:onaction},
            value : 5
        }/}

        {@aria:PasswordField {
            id: "pf",
            onclick:{fn:onaction},
            value : "aaa"
        }/}

        {@aria:DateField {
            id: "df",
            onclick:{fn:onaction},
            value : new Date()
        }/}

        {@aria:TimeField {
            id: "time",
            onclick:{fn:onaction}
        }/}

        {@aria:DatePicker {
            id: "dp",
            onclick:{fn:onaction},
            value : new Date()
        }/}

        {@aria:AutoComplete {
            id: "ac",
            resourcesHandler: this.airlinesHandler,
            onclick:{fn:onaction}
        }/}

        {@aria:MultiSelect {
            id: "ms",
            items: [{value : "a", code : "a"},{value : "b", code : "b"}],
            onclick:{fn:onaction}
        }/}

        {@aria:SelectBox {
            id: "sb",
            options: [{label : "a", value : "a"},{label : "b", value : "b"}],
            onclick:{fn:onaction}
        }/}

        {@aria:MultiAutoComplete {
            id: "mac",
            resourcesHandler: this.airlinesHandler,
            onclick:{fn:onaction}
        }/}





    {/macro}
{/Template}

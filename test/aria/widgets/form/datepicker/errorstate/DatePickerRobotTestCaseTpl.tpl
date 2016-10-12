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
    $classpath : "test.aria.widgets.form.datepicker.errorstate.DatePickerRobotTestCaseTpl",
    $hasScript : true
}}
    {macro main()}
    <div class="templateContainer">
        <ul>
            <li>
                <br>
                {section {
                	id : 'datepickers',
                	macro : "dpContent"
                }/}
            </li>
        </div>
    {/macro}

    {macro dpContent()}
        {@aria:DatePicker {
            id : "Date1",
        bind : {
            value : {
                inside : data,
                to : "value1"
            },
            invalidText : {
                inside : data,
                to : "invalid1"
            }
        },
        directOnBlurValidation : false
        }/}

        {@aria:DatePicker {
            id : "Date2",
            bind : {
            value : {
                inside : data,
                to : "value2"
            },
            invalidText : {
                inside : data,
                to : "invalid2"
            }
        },
        directOnBlurValidation : true
        }/}

        {@aria:Button {
                id : "Button1",
            label : "Clear Invalid Text and Value",
            onclick : "clear"
        }/}
        {@aria:Button {
                id : "Button2",
            label : "Refresh",
            onclick : "refresh"
        }/}
        {@aria:Button {
                id : "Button3",
            label : "Clear Invalid Text Only",
            onclick : "clearInvalidText"
        }/}
        {@aria:Button {
                id : "Button4",
            label : "Set Invalid Text Only",
            onclick : "setInvalidText"
        }/}
        {@aria:Button {
                id : "Button5",
            label : "Set Value Only",
            onclick : "setValidValue"
        }/}
    {/macro}

{/Template}

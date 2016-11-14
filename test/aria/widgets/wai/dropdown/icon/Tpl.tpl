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
    $classpath : "test.aria.widgets.wai.dropdown.icon.Tpl",
    $hasScript: true
}}

    {macro main()}
        <div class="root">
            <input {id "firstItem"/} aria-label="FirstFieldLabel"> <br>
            {@aria:DatePicker {
                waiAria: true,
                label: "DatePickerLabel",
                waiIconLabel: "DropDownLabelForDatePicker",
                id: "myDatePicker"
            }/} <br>
            {@aria:AutoComplete {
                waiAria: true,
                label: "AutoCompleteLabel",
                waiIconLabel: "DropDownLabelForAutoComplete",
                id: "myAutoCompleteWithExpandButton",
                expandButton: true,
                resourcesHandler: getAutoCompleteHandler()
            }/} <br>
            {@aria:SelectBox {
                waiAria: true,
                label: "SelectBoxLabel",
                waiIconLabel: "DropDownLabelForSelectBox",
                id: "mySelectBox",
                options: items
            }/} <br>
            {@aria:MultiSelect {
                waiAria: true,
                label: "MultiSelectLabel",
                waiIconLabel: "DropDownLabelForMultiSelect",
                id: "myMultiSelect",
                items: items
            }/} <br>
            <input {id "lastItem"/} aria-label="LastFieldLabel"> <br>
        </div>
    {/macro}

{/Template}
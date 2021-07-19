/*
 * Copyright 2018 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.dropdown.dialogTitle.Tpl",
    $hasScript: true
}}

    {macro main()}
        {@aria:Dialog {
            waiAria: true,
            title: "MyDialogTitle",
            modal: true,
            movable: true,
            resizable: true,
            maximizable: true,
            macro: "dialogContent",
            bind: {
                visible: {
                    to: "dialogVisible",
                    inside: data
                }
            }
        }/}
        {@aria:Button {
            id: "openDialogButton",
            waiAria: true,
            label: "Open dialog",
            onclick: openDialog
        }/}
    {/macro}

    {macro dialogContent()}
        <input {id "firstItem"/} aria-label="FirstFieldLabel"> <br>
        {@aria:DatePicker {
            waiAria: true,
            waiLabelHidden: true,
            label: "DatePickerLabel",
            waiIconLabel: "DropDownLabelForDatePicker",
            waiAriaCalendarLabel: "Calendar table. Use arrow keys to navigate and space to validate.",
            waiAriaDateFormat: "'thisisadate' EEEE d MMMM yyyy",
            pattern:  "'thisisadate' dd/MM/yyyy",
            id: "myDatePicker"
        }/} <br>
        {@aria:AutoComplete {
            waiAria: true,
            waiLabelHidden: true,
            label: "AutoCompleteLabel",
            waiIconLabel: "DropDownLabelForAutoComplete",
            id: "myAutoCompleteWithExpandButton",
            expandButton: true,
            resourcesHandler: getAutoCompleteHandler()
        }/} <br>
        {@aria:MultiSelect {
            waiAria: true,
            waiLabelHidden: true,
            label: "MultiSelectLabel",
            waiIconLabel: "DropDownLabelForMultiSelect",
            id: "myMultiSelect",
            items: items
        }/} <br>
        <input {id "lastItem"/} aria-label="LastFieldLabel"> <br>
    {/macro}

{/Template}
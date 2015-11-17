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
    $classpath: 'test.aria.widgets.wai.dropdown.Tpl',
    $hasScript: false
}}

    {macro main()}
        {var widgets = this.data.widgets /}

        <div>
            <a href='#' {id 'before_autoComplete' /}>Before AutoComplete</a>
            {@aria:AutoComplete widgets.autoComplete.configuration /}
        </div>

        <div>
            <a href='#' {id 'before_expandableAutoComplete' /}>Before expandable AutoComplete</a>
            {@aria:AutoComplete widgets.expandableAutoComplete.configuration /}
        </div>



        <div>
            <a href='#' {id 'before_multiAutoComplete' /}>Before MultiAutoComplete</a>
            {@aria:MultiAutoComplete widgets.multiAutoComplete.configuration /}
        </div>

        <div>
            <a href='#' {id 'before_expandableMultiAutoComplete' /}>Before expandable MultiAutoComplete</a>
            {@aria:MultiAutoComplete widgets.expandableMultiAutoComplete.configuration /}
        </div>



        <div>
            <a href='#' {id 'before_datePicker' /}>Before DatePicker</a>
            {@aria:DatePicker widgets.datePicker.configuration /}
        </div>



        <div>
            <a href='#' {id 'before_multiSelect' /}>Before MultiSelect</a>
            {@aria:MultiSelect widgets.multiSelect.configuration /}
        </div>

        <div>
            <a href='#' {id 'before_select' /}>Before Select</a>
            {@aria:Select widgets.select.configuration /}
        </div>

        <div>
            <a href='#' {id 'before_selectBox' /}>Before SelectBox</a>
            {@aria:SelectBox widgets.selectBox.configuration /}
        </div>
    {/macro}

{/Template}

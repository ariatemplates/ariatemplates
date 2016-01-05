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
    $classpath : 'test.aria.templates.keyboardNavigation.dialog.escape.Tpl',
    $hasScript : true
}}

    {macro main()}
        <a href='#' {id 'before_' + this.data.openDialogButtonId /}>Before AutoComplete</a>

        {@aria:Button {
            id: this.data.openDialogButtonId,
            label: 'Open dialog',
            onclick: {
                scope: this,
                fn: this.openDialog
            }
        }/}

        {@aria:Dialog {
            id : this.data.dialogId,
            title : 'Dialog',
            width : 500,
            maxHeight : 500,
            modal : true,
            visible : false,
            macro : 'dialogContent',
            bind : {
                'visible' : {
                    inside : this.data,
                    to : 'dialogOpen'
                }
            }
        }/}
    {/macro}

    {macro dialogContent()}
        {var configurations = this.data.widgetsConfigurations /}

        <div>
            <a href='#' {id 'before_autoComplete' /}>Before AutoComplete</a>
            {@aria:AutoComplete configurations.autoComplete /}
        </div>
        <div>
            <a href='#' {id 'before_datePicker' /}>Before DatePicker</a>
            {@aria:DatePicker configurations.datePicker /}
        </div>
        <div>
            <a href='#' {id 'before_multiAutoComplete' /}>Before MultiAutoComplete</a>
            {@aria:MultiAutoComplete configurations.multiAutoComplete /}
        </div>
        <div>
            <a href='#' {id 'before_multiSelect' /}>Before MultiSelect</a>
            {@aria:MultiSelect configurations.multiSelect /}
        </div>
        <div>
            <a href='#' {id 'before_select' /}>Before Select</a>
            {@aria:Select configurations.select /}
        </div>
        <div>
            <a href='#' {id 'before_selectBox' /}>Before SelectBox</a>
            {@aria:SelectBox configurations.selectBox /}
        </div>
    {/macro}

{/Template}

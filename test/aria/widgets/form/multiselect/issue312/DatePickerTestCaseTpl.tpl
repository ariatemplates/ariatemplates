/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath:'test.aria.widgets.form.multiselect.issue312.DatePickerTpl'
}}

    {macro main()}
        <h1>This test needs focus</h1>
        {@aria:DatePicker {
            id:"widget",
            label:"DatePicker",
            labelWidth:150,
            sclass:data.outerSclass,
            calendarSclass:data.innerSclass,
            width:400,
            bind:{
                value : {
                    to : 'value',
                    inside : data
                }
            }
        }/}
    {/macro}

{/Template}

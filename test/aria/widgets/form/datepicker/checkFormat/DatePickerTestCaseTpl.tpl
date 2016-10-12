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
 $classpath : "test.aria.widgets.form.datepicker.checkFormat.DatePickerTestCaseTpl"
}}
   {macro main()}
    {@aria:DatePicker {
        label : "Date1 :",
        id : "date1",
        inputPattern : ["yyyy-MM-dd"]
    }/} <br/>
    {@aria:DatePicker {
        label : "Date2 :",
        id : "date2",
        inputPattern : ["yyyy:dd-MM"]
    }/}<br/>
    {@aria:DatePicker {
        label : "Date3 :",
        id : "date3",
        inputPattern : ["yyyy:MMM+dd"]
    }/}<br/>
    {@aria:DatePicker {
        label : "Date4 :",
        id : "date4",
        inputPattern : ["yyyy dd-I"]
    }/}
    {@aria:DatePicker {
        label : "Date5 :",
        id : "date5"
    }/}<br />
    {@aria:DatePicker {
        label : "Date6 :",
        id : "date6",
        inputPattern : ["MMMddyyyy"],
        pattern : "dd/MM/yyyy"
    }/}<br />
    {@aria:DatePicker {
        label : "Date7 :",
        id : "date7",
        inputPattern : ["dMyy"],
        pattern : "dd/MM/yyyy"
    }/}

   {/macro}
{/Template}

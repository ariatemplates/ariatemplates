/*
 * Copyright 2014 Amadeus s.a.s.
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
    $classpath:"test.aria.widgets.calendar.rangeCalendar.RangeCalendar1RobotTestCaseTpl",
    $css: ["test.aria.widgets.calendar.rangeCalendar.RangeDatePickerStyle"]
}}

    {macro main()}
        {section {
            macro: {
                name: "dateDisplay",
                args: ["fromDate"]
            },
            bindRefreshTo: [{to: "fromDate", inside: data}]
        } /}
        {section {
            macro: {
                name: "dateDisplay",
                args: ["toDate"]
            },
            bindRefreshTo: [{to: "toDate", inside: data}]
        } /}
        {@aria:RangeCalendar {
            id: "calendar",
            bind: {
                fromDate: {
                    to: "fromDate",
                    inside: data
                },
                toDate: {
                    to: "toDate",
                    inside: data
                }
            }
        }/}
    {/macro}

    {macro dateDisplay(fieldName)}
        {var date = data[fieldName]/}
        <span class="date selected">
           {if date}
           <span class="day">${date|dateFormat:"d"}</span>
           <div>
           <span class="weekday">${date|dateFormat:"EEEE"|capitalize}</span>
           <span class="month">${date|dateFormat:"MMM"|capitalize}</span>
           <span class="year">${date|dateFormat:"yy"}</span>
           </div>
           {/if}
        </span>
    {/macro}


{/Template}
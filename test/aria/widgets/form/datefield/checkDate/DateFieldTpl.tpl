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
    $classpath:"test.aria.widgets.form.datefield.checkDate.DateFieldTpl",
    $dependencies:["aria.utils.environment.Date"]
}}

    {macro main()}

    <fieldset  class="fieldsetDemo">
        <legend>Please enter date here</legend>
        <div class="panel dates">
            {var minDate = new Date(1980,0,1)/}
            {var maxDate = new Date(2025,11,25)/}
            {var shortFormat = aria.utils.environment.Date.getDateFormats().shortFormat/}
            <p>Both dates should be between ${minDate|dateformat:shortFormat|escapeForHTML} and ${maxDate|dateformat:shortFormat|escapeForHTML}.</p>
        </div>
        {if (data.displayField)}
        <p>
            {@aria:DateField {
                label:"Datefield 1",
                labelPos:"left",
                id: "df1",
                labelAlign:"right",
                helptext:"Enter date 1",
                width:250,
                block:true,
                minValue: minDate,
                maxValue: maxDate,
                bind:{
                    "value":{
                        inside: data,
                        to: 'date1'
                    }
                }
            }/}
        </p>
        {/if}
        <p>
            {@aria:DateField {
                label:"Datefield 2",
                labelPos:"left",
                labelAlign:"right",
                helptext:"Enter date 2",
                width:350,
                block:true,
                id: "df2",
                pattern:aria.utils.environment.Date.getDateFormats().fullFormat,
                minValue: minDate,
                maxValue: maxDate,
                bind:{
                    "value":{
                        inside: data,
                        to: 'date2'
                    }
                }
            }/}
        </p>
        </fieldset>

    {/macro}

{/Template}

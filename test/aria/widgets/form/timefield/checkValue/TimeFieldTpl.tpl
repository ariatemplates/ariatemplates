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
    $classpath:"test.aria.widgets.form.timefield.checkValue.TimeFieldTpl"
}}

    {macro main()}
    <fieldset  class="fieldsetDemo">
        <legend>Please enter Time here</legend>

        <div class="panel dates">
            <p>A test on TimeField widget </p>

            {@aria:TimeField {
                label:"TimeField 1",
                labelPos:"left",
                id: "tf1",
                labelAlign:"right",
                width:250,
                block:true,
                pattern:aria.utils.environment.Date.getTimeFormats().shortFormat,
                bind:{
                    "value":{
                        inside:data,
                        to:'time1'
                    }
                }
            }/}
        </div>

    </fieldset>

    {/macro}

{/Template}
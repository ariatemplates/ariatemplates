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
    $classpath:'test.aria.templates.validation.report.ValidationReport'
}}

    {var today = new Date()/}
    {var minDate = new Date(today.getFullYear()-1,today.getMonth(),today.getDate())/}

    {macro main()}
        <div id="container" style="height:100px;overflow:auto;">
            <div style="font-size: 20px; font-weight: bold;">THIS TEST NEEDS FOCUS</div>
            {@aria:DateField {
                        id: "myDateField",
                        pattern: "dIy",
                        width: 80,
                        minValue: minDate,
                        bind:{
                              value:{
                                  inside: data,
                                  to:     "myDate"
                              }
                        }
            }/}

            <a href='#' {id 'focusHelper2'/}>Focus Helper</a>
            <div style="height: 600px;"></div>
        </div>

    {/macro}

{/Template}

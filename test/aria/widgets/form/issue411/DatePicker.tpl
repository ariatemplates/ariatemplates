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
    $classpath : "test.aria.widgets.form.issue411.DatePicker",
    $width : { min : 500 }
}}

    {macro main ( )}
        {var minDate = new Date()/}
        {var maxDate = new Date(minDate.getFullYear()+1,minDate.getMonth(),minDate.getDate())/}

        {@aria:DatePicker {
            id: "dp",
            labelPos: "left",
            labelAlign:"right",
            minValue: minDate,
            maxValue: maxDate,
            popupOpen : true,
            bind:{
                popupOpen : {
                    to : "popupOpenDP",
                    inside : data
                }
            }
        }/}
    {/macro}

{/Template}

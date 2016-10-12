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
    $classpath:"test.aria.widgets.form.multiselect.longlist.test2.MsLongListRobotTestCaseTpl",
    $hasScript:false
}}



    {macro main()}
        <h1>This test needs focus</h1>
         {var seatCharacteristics = [
         {
             value:"ITN",
             label:"E-ticket receipt",
             disabled:false
         },
         {
             value:"ETR",
             label:"E-ticket receipt for CTS",
             disabled:false
         },
         {
             value:"ITL",
             label:"E-ticket receipt for ETS",
             disabled:false
         },
         {
             value:"ETA",
             label:"ETA Visa Approval",
             disabled:false
         },
         {
             value:"EMD",
             label:"Electronic Miscellaneous Documetns",
             disabled:false
         },
         {
             value:"ECF",
             label:"Emergency Contact Form",
             disabled:false
         },
         {
             value:"XSB",
             label:"Excess Baggage",
             disabled:false
         },
         {
             value:"INV",
             label:"Invoice",
             disabled:false
         },
         {
             value:"ITI",
             label:"Itinerary",
             disabled:false
         }

         ] /}

         {var content = {value : ['ITN', 'ETR', 'ITL', 'ETA']}/}

         {@aria:MultiSelect {
            activateSort: true,
            label: "Document Type",
            labelWidth:100,
            width:450,
            id:"ms1",
            fieldDisplay: "code",
            fieldSeparator:';',
            valueOrderedByClick: true,
            numberOfRows:4,
            displayOptions : {
                flowOrientation:'horizontal',
                listDisplay: "both",
                displayFooter : true
            },
            items:seatCharacteristics,
            bind:{
                value : {
                    to : 'value',
                    inside : content
                }
            }
        }/}
    {/macro}

{/Template}

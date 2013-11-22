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
   $classpath:"test.aria.widgets.form.select.checkBinding.SelectTemplateTest"
}}
    {macro main()}
        {var selectBoxData={
            selectedValue : "FR",
            countries : [{
                value : "FR",
                label : "France"
            }, {
                value : "CH",
                label : "Switzerland"
            },{
                value : "UK",
                label : "United Kingdom"
            },{
                value : "US",
                label : "United States"
            },{
                value : "ES",
                label : "Spain"
            },{
                value : "PL",
                label : "Poland"
            },{
                value : "SE",
                label : "Sweden"
            },{
                value : "USA",
                label : "United States of America"
            }]
        }/}
        <span {id "from"/}></span>
        {@aria:Select {
            id: "mySelect1",
            label: "<strong>New Select Widget</strong>: ",
            labelWidth:220,
            options: selectBoxData.countries,
            sclass: 'simple',
            width:530,
            bind: {
                value: {
                    to : "selectedValue",
                    inside : selectBoxData
                }
            }
        }/}
        {@aria:Select {
            id: "mySelect2",
            label: "New Select Widget: ",
            labelWidth:220,
            options: selectBoxData.countries,
            sclass: 'simple',
            width:530,
            bind: {
                value: {
                    to : "selectedValue",
                    inside : selectBoxData
                }
            }
        }/}
    {/macro}
{/Template}

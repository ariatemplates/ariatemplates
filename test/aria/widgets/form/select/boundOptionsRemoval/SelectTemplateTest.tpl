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
   $classpath:"test.aria.widgets.form.select.boundOptionsRemoval.SelectTemplateTest",
   $hasScript:true
}}
    {macro main()}
        {@aria:Select {
            id: "mySelect1",
            label: "Select Widget1: ",
            labelWidth:220,
            width:530,
            options: data.options1,
            bind: {
                value: {
                    to : "select1Value",
                    inside : data
                }
            }
        }/}
        {@aria:Select {
            id: "mySelect2",
            label: "Select Widget2: ",
            labelWidth:220,
            width:530,
            bind: {
                value: {
                    to : "select2Value",
                    inside : data
                },
                options: {
                    inside: data,
                    to: "select1Value",
                    transform: function(value) {
                        var options = this.getSelectOptions(value);
                        return options;
                    }
                }
            }
        }/}

        {@aria:Text {
            id: "myBoundText2",
            bind : {
                text : {
                    to : "select2Value",
                    inside : data
                }
            }
        }/}
    {/macro}
{/Template}

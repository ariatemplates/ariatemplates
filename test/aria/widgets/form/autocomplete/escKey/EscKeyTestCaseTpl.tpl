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
    $classpath:"test.aria.widgets.form.autocomplete.escKey.EscKeyTestCaseTpl",
    $hasScript:true,
    $width: {min: 500}
}}

        {var view_values = {
            ac_air_value: null
        }/}

    {macro main()}
        <h2>AutoComplete with LC resources handler</h2> <br />

        {@aria:AutoComplete {
            id: "acDest",
            label:"Choose your destination: ",
            labelPos:"left",
            labelAlign:"right",
            width:400,
            block:false,
            labelWidth:180,
            resourcesHandler:_getCitiesHandler(),
            bind:{
                "value" : {
                    inside : view_values,
                    to : 'ac_air_value'
                }
            }
        }/}

        {@aria:TextField {
            id: "tfDest",
            labelWidth:180,
            width:400,
            helptext:"city name",
            bind:{
                "value" : {
                    inside : view_values,
                    to : 'ac_air_value',
                    transform :{
                        toWidget : function(value) {
                            if (value && value.cityName) {
                                return value.cityName;
                            } else if (value) {
                                return "freeText:" + value;
                            } else return null;
                        },
                        fromWidget : function(value) { return null;}
                    }
                }
            },
            readOnly:true,
            label:"Selected Airport Name: ",
            labelPos:"left",
            labelAlign:"right",
            block:false
        }/}

    {/macro}

{/Template}

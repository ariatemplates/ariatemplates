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
    $classpath : "test.aria.widgets.wai.multiselect.MultiSelectTpl"
}}

    {var content = {value : ['a', 'b']}/}

    {macro main()}

        <p>Here is the default Multi-Select:</p>

        {var testItems = [
                {value:'AF', label:'Air France', disabled:false},
                {value:'AC', label:'Air Canada', disabled:false},
                {value:'BA', label:'British Airways', disabled:false},
                {value:'NZ', label:'Air New Zealand', disabled:false},
                {value:'DL', label:'Delta Airlines', disabled:false},
                {value:'AY', label:'Finnair', disabled:false},
                {value:'IB', label:'Iberia', disabled:false},
                {value:'LH', label:'Lufthansa', disabled:false},
                {value:'MX', label:'Mexicana', disabled:false},
                {value:'QF', label:'Quantas', disabled:false}
            ]/}
        <div>
        <input {id "tf"/}><br><br>
        {@aria:MultiSelect {
            id:"ms",
            waiAria : true,
            iconTooltip: "Press space to open the selection list",
            activateSort: true,
            label: "My Multi-select:",
            labelWidth:150,
            width:400,
            fieldDisplay: "label",
            fieldSeparator:',',
            valueOrderedByClick: true,
            maxOptions:3,
            numberOfRows:4,
            displayOptions : {
                flowOrientation:'horizontal',
                tableMode:true,
                listDisplay: "label"
            },
            items:testItems,
            bind:{
                value : {
                    to : 'value',
                    inside : content
                }
            }
        }/}
        </div>
        <input {id "tf2"/}><br><br>
    {/macro}

{/Template}

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
    $classpath : "test.aria.widgets.form.multiselect.checkFeatures.MultiSelectTestCaseTpl",
    $hasScript : true
}}

    {var content = {value : ['a', 'b']}/}

    {macro main()}

        <p>Here is the default Multi-Select:</p>

        <hr />
        <p>Click the icon on the right</p>
        <p>
        {var testItems = [
                {value:'AF', label:'Air France', disabled:false},
                {value:'AC', label:'Air Canada', disabled:false},
                {value:'NZ', label:'Air New Zealand', disabled:false},
                {value:'DL', label:'Delta Airlines', disabled:false},
                {value:'AY', label:'Finnair', disabled:false},
                {value:'IB', label:'Iberia', disabled:true},
                {value:'LH', label:'Lufthansa', disabled:false},
                {value:'MX', label:'Mexicana', disabled:false},
                {value:'QF', label:'Quantas', disabled:false}
            ]/}
        {var tableItems = [
                {value:'AF1', label:'Air France|1st Class|AF', disabled:false},
                {value:'AF2', label:'Air France|Business Class|AF', disabled:false},
                {value:'AC1', label:'Air Canada|1st Class|AF', disabled:false},
                {value:'AF2', label:'Air Canada|Business Class|AF', disabled:false}
            ]/}
        {@aria:MultiSelect {
            activateSort: true,
            label: "My Multi-select:",
            labelWidth:150,
            width:400,
            fieldDisplay: "label",
            id:"ms1",
            fieldSeparator:',',
            valueOrderedByClick: true,
            maxOptions:3,
            numberOfRows:5,
            displayOptions : {
                flowOrientation:'horizontal',
                //flowOrientation:'vertical',
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
        </p>


        <hr/>

        {@aria:MultiSelect {
            activateSort: true,
            label: "My Other Multi-select:",
            labelWidth:150,
            width:400,
            fieldDisplay: "label",
            id:"ms2",
            fieldSeparator:',',
            valueOrderedByClick: true,
            maxOptions:7,
            numberOfRows:3,
            displayOptions : {
                flowOrientation:'horizontal',
                //flowOrientation:'vertical',
                tableMode:true,
                listDisplay: "label"
            },
            items:testItems,
            bind:{
                value : {
                    to : 'value2',
                    inside : content
                }
            },
            onchange : onchange
        }/}
    {/macro}

{/Template}

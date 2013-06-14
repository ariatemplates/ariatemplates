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
    $classpath:"test.aria.widgets.form.multiselect.instantbind.InstantBindTestCaseTpl",
    $hasScript:true
}}

    {var contentNormal = {value : ['AC', 'AF']}/}
    {var contentInstant = {value : ['AC', 'AF']}/}

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

    {macro main()}
        <h2>Without Instant bind</h2>
        <table><tr><td>
                {call _putMultiSelect("msNormal", false, contentNormal) /}
            </td><td>
                {call _putMultiSelectBoundValuePreview("selectedNoInstantBind", contentNormal) /}
        </td></tr></table>

        <h2>With Instant bind</h2>
        <table><tr><td>
                {call _putMultiSelect("msInstant", true, contentInstant) /}
            </td><td>
                {call _putMultiSelectBoundValuePreview("selectedWithInstantBind", contentInstant) /}
        </td></tr></table>
    {/macro}

    {macro _putMultiSelect(msId, bInstantBind, boundObj)}
        {@aria:MultiSelect {
            id:msId,
            activateSort: true,
            label: "My Multi-select:",
            labelWidth:150,
            width:400,
            fieldDisplay: "code",
            fieldSeparator:',',
            valueOrderedByClick: true,
            maxOptions:4,
            onchange:onchange,
            numberOfColumns:1,
            displayOptions : {
                flowOrientation:'vertical',
                listDisplay: "both"
            },
            items:testItems,
            bind:{
                value : {
                    to : 'value',
                    inside : boundObj
                }
            },
            instantBind : bInstantBind
        }/}
    {/macro}

    {macro _putMultiSelectBoundValuePreview(macroName, boundObj)}
        {section {
            id: macroName,
            macro : macroName,
            bindRefreshTo : [{
                to : "value",
                inside : boundObj
            }]
        }/}
    {/macro}

    {macro selectedNoInstantBind()}
        SELECTED: {foreach item in contentNormal.value}
            ${item} &nbsp;
        {/foreach}
    {/macro}

    {macro selectedWithInstantBind()}
        SELECTED: {foreach item in contentInstant.value}
            ${item} &nbsp;
        {/foreach}
    {/macro}

{/Template}

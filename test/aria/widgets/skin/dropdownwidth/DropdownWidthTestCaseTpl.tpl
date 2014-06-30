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
    $classpath:"test.aria.widgets.skin.dropdownwidth.DropdownWidthTestCaseTpl",
    $hasScript:false
}}

    {var selectBoxData={}/}

    {macro main()}
        {var data = {
            countries : [{
                value : "SB",
                label : "SelectboxItem"
            }, {
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
            }]
        }/}
        <p>Select Box:</p>
        {@aria:SelectBox {
            label: "Some Countries: ",
            labelWidth:220,
            helptext:"Type text or select",
            options: data.countries,
            id: "selectBox"
        }/}


        {var testItems = [
                          {value:'MS', label:'MultiselectItem', disabled:false},
                          {value:'AF', label:'Air France', disabled:false},
                          {value:'AC', label:'Air Canada', disabled:false},
                          {value:'NZ', label:'Air New Zealand', disabled:false}
                      ]/}
        <p>Multiselect:</p>
        {@aria:MultiSelect {
            activateSort: true,
            label: "Multiselect:",
            labelWidth:150,
            width:400,
            fieldDisplay: "label",
            id:"multiselect",
            fieldSeparator:',',
            valueOrderedByClick: true,
            numberOfRows:5,
            displayOptions : {
                flowOrientation:'horizontal',
                tableMode:true,
                listDisplay: "label"
            },
            items:testItems
        }/}

        <p>Autocomplete:</p>
        {@aria:AutoComplete {
            id : "autocomplete",
            label : "Autoselect",
            expandButton : true,
            resourcesHandler : "test.aria.widgets.form.autocomplete.autoselect.Handler"
        }/}

        <p>Select:</p>
        {var options = [
                          {value:'MS', label:'SelectItem'},
                          {value:'AF', label:'Air France'},
                          {value:'AC', label:'Air Canada'}
                      ]/}
        {@aria:Select {
            id: "select",
            options: options
        }/}


    {/macro}

{/Template}

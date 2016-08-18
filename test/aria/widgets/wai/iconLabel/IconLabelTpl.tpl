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
    $classpath : "test.aria.widgets.wai.iconLabel.IconLabelTpl",
    $hasScript : true
}}

    {var content = {value : ['a', 'b']}/}

    {macro main()}

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

         {var countries = [
                {
                  value: "FR",
                  label: "France"
                },
                {
                  value: "CH",
                  label: "Switzerland"
                },
                {
                  value: "UK",
                  label: "United Kingdom"
                },
                {
                  value: "US",
                  label: "United States"
                },
                {
                  value: "ES",
                  label: "Spain"
                },
                {
                  value: "PL",
                  label: "Poland"
                },
                {
                  value: "SE",
                  label: "Sweden"
                },
                {
                  value: "USA",
                  label: "United States of America"
                }
            ]/}
        <div>
            {@aria:TextField {
                id : "tf",
                waiAria : true,
                label : "First textfield",
                labelWidth: 150
            }/} <br><br>
            {@aria:AutoComplete {
                id : "ac",
                waiAria : true,
                label : "City",
                labelWidth: 150,
                autoFill : false,
                expandButton : true,
                waiIconLabel: "Press space to open the autocomplete list",
                resourcesHandler : this.acHandler,
                waiSuggestionsStatusGetter: this.waiSuggestionsStatusGetter,
                waiSuggestionAriaLabelGetter: this.waiSuggestionAriaLabelGetter
            }/} <br><br>
            {@aria:DatePicker {
                id: "dp",
                waiAria : true,
                label: "Travel date",
                labelWidth: 150,
                iconTooltip: "Display calendar",
                waiIconLabel: "Press space to open the calendar",
                waiAriaCalendarLabel: "Calendar table. Use arrow keys to navigate and space to validate.",
                waiAriaDateFormat: "EEEE d MMMM yyyy",
                calendarShowShortcuts: false
            }/} <br><br>
            {@aria:MultiSelect {
                id:"ms",
                waiAria : true,
                waiIconLabel: "Press space to open the selection list",
                iconTooltip: "Display list",
                labelWidth: 150,
                activateSort: true,
                label: "Multi-select:",
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
                items:testItems
            }/}<br><br>
            {@aria:SelectBox {
              waiAria : true,
              waiIconLabel: "Press space to open the selection list",
              label : "All Countries: ",
              labelWidth : 150,
              options : countries
            }/}
        </div>
    {/macro}

{/Template}

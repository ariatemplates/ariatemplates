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
    $classpath : "test.aria.templates.testmode.TestIdsTestCaseTpl",
    $hasScript : false,
    $dependencies : ["aria.resources.handlers.LCResourcesHandler", "aria.utils.environment.Date"]
}}

    {macro main()}

    <div id="numberfield">
            {@aria:NumberField {
                label:"Number Field:",
                labelAlign:"left",
                helptext:"Mandatory",
                width:500,
                block:true,
                mandatory: true,
                errorMessages:["Please type in a number"],
                id:"myNumberField"
            }/}
    </div>

    <div id="timefield">
            {@aria:TimeField {
                    label:"Timefield",
                    labelPos:"left",
                    labelAlign:"right",
                    helptext:"Enter a departure time",
                    width:250,
                    pattern:aria.utils.environment.Date.getTimeFormats().shortFormat
            }/}
    </div>
    <div id="textfield">
            {@aria:TextField {
                id:"textField",
                label:"Textfield",
                labelAlign:"left",
                helptext:"Enter your email address",
                width:300,
                labelWidth:100,
                 bind:{
                    "value":{inside:test,to:'value'}
            }}/}
    </div>
    <div id="checkbox">
            {@aria:CheckBox {
                label: "Checkbox",
                id:"myCheckbox"
            }/}
    </div>
    <div id="radio">
        {@aria:RadioButton {
                label: "Radio",
                id:"myOptionA",
                keyValue: "a",
                labelPos: "right"
            }/}
    </div>
    <div id="button">
        {@aria:Button {label:"Normal Button", id: "myButton"}/}
    </div>

     <div id="selectbox">
        {@aria:SelectBox {
            label: "Selectbox ",
            labelWidth:220,
            helptext:"Type text or select"
        }/}
    </div>

    <div id="selectbox1">
        {@aria:SelectBox {
            label: "Selectbox ",
            labelWidth:220,
            helptext:"Type text or select",
            options: [{
                        value : "FR",
                        label : "France"
                    }, {
                        value : "FR",
                        label : "France"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }, {
                        value : "CH",
                        label : "Switzerland"
                    }]
        }/}
    </div>



    <div id="link">
        {@aria:Link {
            label:"my link",
            id: "myLink"
        } /}
    </div>

    <div id="tab">
            {@aria:Tab {
                tabId : "Tab1",
                selectedTab: "Tab1",
                disabled : false,
                margins: "0 0 0 0"
            }}
            All Results
            {/@aria:Tab}
    </div>

    <div id="datepicker">
        {@aria:DatePicker {
            label: "Datepicker",
            labelWidth:150,
            width:300,
            id: "departureDate"
        }/}
    </div>
    <div id="autocomplete">
        {@aria:AutoComplete {
            label:"Autocomplete",
            helptext:"airport",
            labelPos:"left",
            labelAlign:"right",
            width:400,
            block:false,
            labelWidth:180,
            sclass:"important",
            resourcesHandler:'aria.resources.handlers.LCResourcesHandler'
        }/}
    </div>

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
    <div id="multiselect">
        {@aria:MultiSelect {
            activateSort: true,
            label: "Multiselect",
            labelWidth:150,
            width:500,
            fieldDisplay: "code",
            fieldSeparator:',',
            valueOrderedByClick: true,
            maxOptions:7,
            numberOfRows:4,
            items:testItems,
            displayOptions : {
                flowOrientation:'horizontal',
                listDisplay: "both"
            }
        }/}
    </div>

    {/macro}

{/Template}
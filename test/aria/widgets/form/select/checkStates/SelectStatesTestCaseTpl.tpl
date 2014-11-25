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
   $classpath:"test.aria.widgets.form.select.checkStates.SelectStatesTestCaseTpl"
}}
    {macro main()}
        <input {id "clickHelper"/}>Click helper</input><br />

        {@aria:Select {
            id: "mySelect",
            label: "First",
            labelWidth:50,
            options: [{label: "Option 1",value:"opt1"},{label: "Option 2",value:"opt2"}],
            width:150,
            popupWidth: 120
        }/}
        <br /><br />
        {var testItems1 = [
               {value:'AF', label:'AF', disabled:false},
               {value:'AC', label:'AC', disabled:false},
               {value:'NZ', label:'NZ', disabled:false},
               {value:'DL', label:'DL', disabled:false},
               {value:'AY', label:'AY', disabled:false}
           ]/}

        {@aria:MultiSelect {
           activateSort: true,
           label: "Multi-select",
           labelWidth:150,
           width:400,
           fieldDisplay: "label",
           id:"myMultiselect",
           fieldSeparator:',',
           valueOrderedByClick: true,
           maxOptions:3,
           items:testItems1
       }/}
    {/macro}

{/Template}

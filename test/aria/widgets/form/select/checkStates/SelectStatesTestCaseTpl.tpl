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
        <span {id "clickHelper"/}>Click helper</span><br />
        {@aria:Select {
            id: "mySelect",
            label: "First",
            labelWidth:50,
            options: [{label: "Option 1",value:"opt1"},{label: "Option 2",value:"opt2"}],
            width:150,
            popupWidth: 120
        }/}
        <br /><br />
        {@aria:Select {
            id: "mySelect2",
            label: "First",
            labelWidth:50,
            options: [{label: "Option 1",value:"opt1"},{label: "Option 2",value:"opt2"}],
            width:150,
            popupWidth: 120
        }/}
        <br /><br />
    {/macro}

{/Template}

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
    $classpath : "test.aria.templates.keyboardNavigation.TableNavTestCaseTpl",
    $hasScript : false
}}

    {macro main()}

        <h1>THIS TEST NEEDS FOCUS</h1>

        {section {
            "id" : "mySection",
            "tableNav" : true,
            macro : "mySectionContent"
         }/}
     {/macro}

     {macro mySectionContent()}

         <div {on focus { fn : function () { this.data.focus['tf-1'] = true; }}/}>
            {@aria:TextField {label:"tf-1", id:"tf-1", block:true}/}
         </div>

         <div {on focus { fn : function () { this.data.focus['tf0'] = true; }}/}>
            {@aria:TextField {label:"tf0", id:"tf0", block:true}/}
         </div>

            <table>
                <tr>
                    <td rowspan="4" {on focus { fn : function () { this.data.focus['tf1'] = true; }}/}>{@aria:TextField {label:"tf1", id:"tf1"}/}</td>
                    <td {on focus { fn : function () { this.data.focus['tf2'] = true; }}/}>{@aria:TextField {label:"tf2", id:"tf2"}/}</td>
                    <td>Nothing focusable</td>
                    <td {on focus { fn : function () { this.data.focus['tf3'] = true; }}/}>{@aria:TextField {label:"tf3",id:"tf3"}/}</td>
                </tr>
                    <tr>
                    <td>Nothing focusable</td>
                    <td colspan="2" {on focus { fn : function () { this.data.focus['tf4'] = true; }}/}>{@aria:TextField {label:"tf4", id:"tf4"}/}</td>
                </tr>
                <tr>
                    <td>Nothing focusable</td>
                    <td>Nothing focusable</td>
                    <td>Nothing focusable</td>
                </tr>
                <tr>
                    <td>Nothing focusable</td>
                    <td>Nothing focusable</td>
                    <td {on focus { fn : function () { this.data.focus['tf5'] = true; }}/}>{@aria:TextField {label:"tf5", id:"tf5"}/}</td>
                </tr>
                <tr>
                    <td>Nothing focusable</td>
                    <td>Nothing focusable</td>
                    <td>Nothing focusable</td>
                    <td{on focus { fn : function () { this.data.focus['myLink'] = true; }}/}><a href="">My Link</a></td>
                </tr>
            </table>

         <div {on focus { fn : function () { this.data.focus['tf6'] = true; }}/}>
            {@aria:TextField {label:"tf6", id:"tf6", block:true}/}
        </div>

        <div {on focus { fn : function () { this.data.focus['tf7'] = true; }}/}>
            {@aria:TextField {label:"tf7", id:"tf7", block:true}/}
        </div>

    {/macro}

{/Template}

/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath:'test.aria.templates.refresh.partial.PTRTemplate',
    $hasScript:true

}}

    {macro main()}
        {section {
            id: "Section1",
            type : "div",
            macro : "section1Macro" }/}

        Refresh:
        <br/>
        {@aria:Button {
            id:"button1",
            label:'Partial refresh',
            onclick:{ fn: updateCountAndRefresh, args: {sectionId:1} }
        }/}
        {@aria:Button {
            id:"button2",
            label:'Full refresh',
            onclick:{ fn: updateCountAndRefresh }
        }/}

    {/macro}
    {macro section1Macro()}
        <b>Section1</b> count : ${data['view:counts1']}<br/>
        {@aria:Text {
             width : 150,
             bind: {
                text : {
                    to: "textAfterRefresh" ,
                    inside: data
                }
            }
         }/}
    {/macro}

{/Template}

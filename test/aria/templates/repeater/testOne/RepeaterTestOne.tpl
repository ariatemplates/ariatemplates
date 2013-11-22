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
    $classpath:"test.aria.templates.repeater.testOne.RepeaterTestOne",
    $hasScript:true,
    $css:["test.aria.templates.repeater.testOne.RepeaterTestOneCSS"]
}}

    {var myData = {myArray : ["just","an","array"]}/}
    {macro main()}
        <table>
        {repeater {
            loopType: "array",
            content: myData.myArray,
            type: "TBODY",
            childSections : {
                    id: "myChildSection",
                    macro: {
                            name: "myMacro",
                            args: []
                    },

                    type: "TR",
                    cssClass: myCSSFunction
            }
        }/}
        </table>
    {/macro}

    {macro myMacro(item)}
        <td>${item.item}</td>
        <td>${item.ct}</td>
        <td>${item.sectionId}</td>
        <td>${item.sectionIdSuffix}</td>
        <td>${item.index}</td>
        ${updateRefreshCountOf(item)}
    {/macro}

{/Template}

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
    $classpath:"test.aria.templates.repeater.testTwo.RepeaterTestTwo",
    $css:["test.aria.templates.repeater.testTwo.RepeaterTestTwoCSS"]
}}

    {var myData = {myMap : {
                one : {name : "one"},
                two : {name : "two"},
                three : {name : "three"}
                }
    }/}

    {macro main()}
        <table>
        {repeater {
            loopType: "map",
            content: myData.myMap,
            type: "TBODY",
            childSections : {
                    id: "myChildSection",
                    macro: {
                            name: "myMacro",
                            args: []
                    },

                    type: "TR",
                    cssClass: "line"
            }
        }/}
        </table>
    {/macro}

    {macro myMacro(item)}
        <td>{if item.item}${item.item.name}{/if}</td>
        <td>${item.ct}</td>
        <td>${item.sectionId}</td>
        <td>${item.sectionIdSuffix}</td>
        <td>${item.index}</td>
    {/macro}

{/Template}

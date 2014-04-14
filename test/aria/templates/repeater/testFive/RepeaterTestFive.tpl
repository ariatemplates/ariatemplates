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
    $classpath:"test.aria.templates.repeater.testFive.RepeaterTestFive"
}}

    {macro main()}
        {section {
            id :"containingSection",
            macro: {
                name: "containingMacro",
                args : []
            }
        }/}
    {/macro}


    {macro containingMacro()}
            <table>
            {repeater {
                id: "repeaterSection",
                loopType: "array",
                content: data.cities,
                type: "TBODY",
                childSections : {
                        id: "childSection",
                        macro: "childSectionMacro",
                        type: "TR"
                }
            }/}
            </table>
    {/macro}

    {macro childSectionMacro(repeaterItem)}
        {var arrayItem = repeaterItem.item/}
        ${(function(){
            arrayItem.refreshCt++;
            arrayItem.repeaterItem = repeaterItem;
        })()}
        <td>${arrayItem.city}</td>
        <td>
            ${arrayItem.refreshCt}
        </td>
        {section {
            id: "subSection" + repeaterItem.sectionIdSuffix,
            type: "td",
            macro: {
                name: "childSubSectionMacro",
                args : [arrayItem]
            }
        }/}
    {/macro}

    {macro childSubSectionMacro(arrayItem)}
        ${(function(){
            arrayItem.subRefreshCt++;
        })()}

    {/macro}

{/Template}

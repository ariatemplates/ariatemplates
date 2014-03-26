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
    $classpath: "test.aria.utils.overlay.loadingIndicator.automatic.Body"
}}

    {macro main()}
        Counting refreshes : <span id="countRefresh">${data.countRefresh}</span>

        <br />

        There should be a section with overlay
        {section {
            id : "s1",
            macro : "s1Content"
        }/}

        There should also be a grand parent section
        {section {
            id : "grandParent",
            macro : "grandParentContent"
        }/}

        And then comes the sub template
        {@aria:Template {
            defaultTemplate : "test.aria.utils.overlay.loadingIndicator.automatic.SubTemplate"
        } /}
    {/macro}

    {macro s1Content()}
        <span>containing an element with an id</span>
        <div style="height: 80px; border: 1px dashed black" {id "d1" /}>&nbsp;</div>
    {/macro}

    {macro grandParentContent()}
        containing a parent section
        {section {
            id : "parent",
            macro : "parentContent"
        }/}
    {/macro}

    {macro parentContent()}
        with a child section that has an overlay
        {section {
            id : "s2",
            macro : "s2Content"
        }/}
    {/macro}

    {macro s2Content()}
        <div style="height: 80px; border: 1px dashed black" {id "d2" /}>&nbsp;</div>
    {/macro}

{/Template}

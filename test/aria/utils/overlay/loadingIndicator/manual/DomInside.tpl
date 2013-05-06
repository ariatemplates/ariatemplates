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
    $classpath: "test.aria.utils.overlay.loadingIndicator.manual.DomInside"
}}


    {macro main()}
        {@aria:Button {
            label : "Click Me",
            onclick : "clickMe"
        }/}
        <br />


        <div style="border: 5px solid cyan; padding: 10px">
            <span {id "spanOverlay" /} style="border: 1px solid black;">Overlay something here<br />on two lines</span>
        </div>


        {section "s1"}
            <div {id "overlay0" /} style="border: 1px solid black; height: 50px; margin: 20px">
                Overlay something here
            </div>
        {/section}
    {/macro}
{/Template}

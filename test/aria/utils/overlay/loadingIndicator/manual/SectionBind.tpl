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
    $classpath: "test.aria.utils.overlay.loadingIndicator.manual.SectionBind",
    $hasScript: false
}}


    {macro main()}

        {@aria:Button {
            label : "Toggle autorefresh",
            onclick : "toggle"
        }/}
        <br />

        {section {
            id : "s2",
            bindProcessingTo : {inside: data, to: "processing"},
            macro : "s2Content"
        }/}
    {/macro}

    {macro s2Content()}
        <div {id "overlay1" /} style="border: 10px solid green; height: 60px">
            Overlay something here
        </div>
    {/macro}


{/Template}

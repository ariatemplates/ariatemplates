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
    $classpath: "test.aria.utils.overlay.loadingIndicator.automatic.Nasty"
}}

    {macro main()}
        Counting refreshes : <span id="countRefresh">${data.countRefresh}</span>

        <br />

        {section {
            id : "s1",
            bindProcessingTo : {inside: data, to: "bindHere"},
            macro : "s1Content"
        }/}

        {section {
            id : "s2",
            bindProcessingTo : {inside: data, to: "bindHere"},
            macro : "s1Content"
        }/}

        {section {
            id : "s3",
            bindProcessingTo : {inside: data, to: "bindHere"},
            macro : "s1Content"
        }/}

        {section {
            id : "s4",
            bindProcessingTo : {inside: data, to: "bindHere"},
            macro : "s1Content"
        }/}
    {/macro}

    {macro s1Content()}
        <span>containing an element with an id</span>
        <div style="height: 80px; border: 1px dashed black" {id "d1" /}>&nbsp;</div>
    {/macro}

{/Template}

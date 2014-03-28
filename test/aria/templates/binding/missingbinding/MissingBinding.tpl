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
   $classpath:'test.aria.templates.binding.missingbinding.MissingBinding'
}}


    {var myData = {waitingResults : [true,false,false]} /}

    {macro main()}
        {section {
           id: "main1",
           type: "div",
           bindProcessingTo: {
            inside: myData.waitingResults,
            to: 0
           },
           macro : "main1Content"
        }/}

        {section {
           id: "main2",
           type: "div",
           bindProcessingTo: {
            inside: myData.waitingResults
           },
           macro : "main1Content"
        }/}

    {/macro}

    {macro main1Content()}
        mySection content
    {/macro}

{/Template}

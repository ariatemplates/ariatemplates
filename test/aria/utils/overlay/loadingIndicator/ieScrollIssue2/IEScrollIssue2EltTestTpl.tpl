/*
 * Copyright 2014 Amadeus s.a.s.
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
    $classpath : "test.aria.utils.overlay.loadingIndicator.ieScrollIssue2.IEScrollIssue2EltTestTpl"
}}

    {macro main()}
        {section { macro: "tab", bindRefreshTo: [{to:"isHidden", inside: data }]}/}
    {/macro}

    {macro tab()}
        {if !data.isHidden}
            <div {id "container" /} style="height:350px; width:400px; background-color:green; overflow:scroll">
                <div {id "mySpan" /} style="height: 200px; width: 200px; background-color: blue;"></div>
                <div style="height:500px; width:50px; background-color:red"></div>
            </div>
        {/if}
    {/macro}

{/Template}

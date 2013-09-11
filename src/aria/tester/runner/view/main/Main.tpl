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

// TODOC
{Template {
    $classpath:'aria.tester.runner.view.main.Main',
     $css:['aria.tester.runner.view.main.MainCSS'],
    $hasScript:true,
    $width : {"min":180},
    $height : {"min":342}
}}
    {macro main()}
        {section {
            id : "mainSection",
            macro: "sectionContent",
            bindRefreshTo : [{
                inside : data.view.configuration,
                to : "mini"
            }]
        }/}
    {/macro}
    {macro sectionContent()}
        {if data.view.configuration.mini}
            {@aria:Template {
                width:$hdim(180,1),
                height:$vdim(342,1),
                defaultTemplate:"aria.tester.runner.view.mini.Mini"
            } /}
        {else/}
            {@aria:Template {
                width:$hdim(180,1),
                height:$vdim(342,1),
                defaultTemplate:"aria.tester.runner.view.normal.Normal"
            } /}
        {/if}
    {/macro}
{/Template}
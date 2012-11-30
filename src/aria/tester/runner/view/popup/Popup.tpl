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
    $classpath:'aria.tester.runner.view.popup.Popup',
    $hasScript:true,
    $css:['aria.tester.runner.view.popup.PopupCSS']
}}
    {macro main()}    
        {section {
            id:"mainSection",
            bindRefreshTo:[{
                inside : data.flow,
                to : "currentState"
            }]
        }}
            {call displayReport()/}
        {/section}
    {/macro}
    {macro displayReport()}
        {if data.flow.currentState == "report"}
            {@aria:Template {
                defaultTemplate:"aria.tester.runner.view.popup.report.Report"
            } /}
        {elseif data.flow.currentState == "failure"/}
            {@aria:Template {
                defaultTemplate:"aria.tester.runner.view.popup.warning.Warning"
            } /}
        {elseif data.flow.currentState == "options"/}
            {@aria:Template {
                defaultTemplate:"aria.tester.runner.view.popup.options.Options"
            } /}
        {/if}
    {/macro}
{/Template}

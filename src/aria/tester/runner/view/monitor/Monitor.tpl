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
    $classpath:'aria.tester.runner.view.monitor.Monitor',
    $hasScript:false,
    $width : {min:180},
    $height : {min:282},
    $css : ['aria.tester.runner.view.monitor.MonitorCSS']
}}
    {macro main()}
        {var width = 180-2/}
        <div class="monitorContainer" 
            style="
                height : ${$vdim(280)}px;
                width : ${$hdim(width)}px;
        ">
            {@aria:Template {
                width:$hdim(width,1),
                height:50,
                defaultTemplate:"aria.tester.runner.view.header.Header",
                block:true
            } /}
            {@aria:Template {
                width:$hdim(width,1),
                height:25,
                defaultTemplate:"aria.tester.runner.view.filter.Filter",
                block:true
            } /}
            {@aria:Template {
                width:$hdim(width,1),
                height:$vdim(203,1),
                defaultTemplate:"aria.tester.runner.view.report.Report",
                block:true
            } /}
        </div>
    {/macro}
{/Template}

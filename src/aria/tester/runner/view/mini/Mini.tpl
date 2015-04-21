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
    $classpath:'aria.tester.runner.view.mini.Mini',
    $css:['aria.tester.runner.view.mini.MiniCSS'],
    $wlibs : {"aria" : "aria.widgets.AriaLib"},
    $hasScript:true,
    $width : {"min":180},
    $height : {"min":342}
}}
    {macro main()}
        <div  style="position:absolute;top:0px;left:0px;z-index:12000">
            {@aria:Template {
                defaultTemplate:"aria.tester.runner.view.popup.Popup"
            } /}
        </div>
        <div class="monitor" style="
            height : ${$vdim(342)}px;
            width : ${$hdim(180)}px;
        ">
            {@aria:Template {
                height:$vdim(342,1),
                width:$hdim(180,1),
                defaultTemplate:"aria.tester.runner.view.monitor.Monitor"
            } /}
        </div>
    {/macro}
{/Template}

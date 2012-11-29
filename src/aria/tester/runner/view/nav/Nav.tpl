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
    $classpath:'aria.tester.runner.view.nav.Nav',
    $hasScript:false,
    $width : {value:200},
    $height : {min:342},
     $css:['aria.tester.runner.view.nav.NavCSS']
}}
    {macro main()}    
        <div style="float:left; overflow:hidden;">
            {call displayLogo()/}
            {call displayWidgets()/}
        </div>
    {/macro}
    
    {macro displayLogo()}
        <div style="
            position:relative;
            height : 90px;
            width:200px;
        ">
            {@aria:Template {
                width:200,
                height:90,
                defaultTemplate:'aria.tester.runner.view.logo.Logo'
            } /}
        </div>
    {/macro}
    
    {macro displayWidgets()}
        {call displayWidget("Select Suites", 'aria.tester.runner.view.config.Config')/}
        {call displayWidget("Documentation", 'aria.tester.runner.view.links.Links')/}
    {/macro}
    
    {macro displayWidget(title, classpath)} 
        {@aria:Template {
            width:200,
            height:$vdim(125,0.5),
            defaultTemplate:classpath,
            block:true
        } /}
    {/macro}
{/Template}

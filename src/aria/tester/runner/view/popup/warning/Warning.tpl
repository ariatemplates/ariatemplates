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
    $classpath:'aria.tester.runner.view.popup.warning.Warning',
    $extends:'aria.tester.runner.view.popup.generic.Generic',
    $hasScript:true,
    $css : ['aria.tester.runner.view.popup.warning.WarningCSS']
}}
    {macro displayPopupTitle()}
        Load Error !
    {/macro}
    {macro displayPopupContent()}
        <div style="margin-top:10px;margin-left:0px;">
            ! No TestSuite was found for the classpath : "<b>${data.campaign.rootClasspath}</b>"
        </div>
        <div style="margin:10px;margin-left:0px;color:#444">
            As explained in the documentation, we strongly suggest you create a test suite with the <b>MainTestSuite</b> classpath.
        </div>
        <div style="margin:10px;margin-left:0px;color:#444">
            Alternatively, please enter the classpath of your test suite below :
        </div>
        <br/>
        {@aria:TextField {
            bind:{value: {inside:this.data.campaign, to:"newClasspath"}},
            helptext : "Enter your classpath here"
        } /}
    {/macro}
    {macro displayButtons()}
        {call displayButton("load", this._onReloadButtonClicked)/}
    {/macro}
{/Template}

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
    $classpath:'aria.tester.runner.view.popup.report.Report',
    $extends:'aria.tester.runner.view.popup.generic.Generic',
    $css : ['aria.tester.runner.view.popup.report.ReportCSS'],
    $wlibs : {"aria" : "aria.widgets.AriaLib"},
    $hasScript:true
}}
    {macro displayPopupTitle()}
        Error Report
    {/macro}
    {macro displayButtons()}
        {call displayButton("reload", this._onReloadButtonClicked)/}
        {call displayButton("close", this._onCloseButtonClicked)/}
    {/macro}

    {macro displayPopupContent()}
        {var tests = this.getTestsWithErrors()/}
        {if tests.length == 0}
            <div class="noerrors">
                No errors to report !
            </div>
        {else/}
            {foreach test in tests}
                {var classname = "test"/}
                {if (test.classpath == this.data.view.highlightedTest)}
                    {set classname+=" highlight"/}
                {/if}
                <div class="${classname}">
                    {call displayTestErrors(test)/}
                </div>
            {/foreach}
        {/if}
    {/macro}

    {macro displayTestErrors(test)}
        <div class="classpath">
            ${this.formatTestClasspath(test)|escapeForHTML:false}
        </div>
        <div class="count">
            (${this.formatTestErrorsCount(test)|escapeForHTML:false})
        </div>
        {var errors = this.getTestErrors(test)/}
        {if errors.length == 0}
            No errors to display for this test
        {else/}
            <ul>
            {foreach error in errors}
                {call displayTestError(error, test)/}
            {/foreach}
            </ul>
        {/if}
    {/macro}
    {macro displayTestError(error, test)}
        <li class="error">
            <div class="message">
                ${this.formatErrorMessage(error)|escapeForHTML:false}
            </div>
        </li>
    {/macro}
{/Template}

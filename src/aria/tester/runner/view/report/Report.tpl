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
    $classpath:'aria.tester.runner.view.report.Report',
    $hasScript:true,
    $width : {"min":178},
    $height : {"min":203},
    $css:['aria.tester.runner.view.report.ReportCSS']
}}
    {macro main()}
        <div {id "left"/}
            class="leftContainer"
            style="
                width : ${$hdim(178,1)}px;
                height : ${$vdim(203,1)}px;
            "
        >
            {call displayReportAsTree()/}
        </div>
        <div class="rightContainer">
            <div id="tplContainer">
                <div id="TESTAREA"></div>
            </div>
        </div>
    {/macro}

    {macro displayReportAsTree()}
        {section {
            id: "reportSection",
              bindRefreshTo : [{
               inside : data.campaign,
               to : "testsTree"
              },{
               inside : data.view.filter,
               to : "type"
              },{
               inside : data.flow,
               to : "currentState"
              }],
              type:"div"
          }}

            ${this._beforeDisplayReport()|empty:""}
            {var testsArray = this.getFilteredTestsArray()/}
            <table
                class="reportTable"
                cellspacing="1"
                style="
                {if aria.core.Browser.isIE}
                    width:${$hdim(161,1)}px;
                {/if}
            "
            >
                <tbody>
                    {foreach test in testsArray}
                        {call displayTest(test, 0)/}
                    {/foreach}
                </tbody>
            </table>
        {/section}
    {/macro}

    {macro displayTest(test)}
        {var isTestSuite = test.instance && test.instance.$TestSuite/}
        {var isFinished = test.instance && test.instance.isFinished()/}
        {var hasError = test.instance && test.instance.hasError && test.instance.hasError()/}

        {var classname = isTestSuite ? "suite" : (counter++%2? "odd" : "even")/}
        {if (isFinished && !isTestSuite)}
            {if (hasError)}
                {set classname += " failure"/}
            {else/}
                {set classname += " success"/}
            {/if}
            ${this._setLastFinishedId(counter)}
        {else/}
            {if !currentAssigned && (!isTestSuite) && (data.flow.currentState == "ongoing" || data.flow.currentState == "pausing")}
                {set classname += " current"/}
                {set currentAssigned = true/}
            {/if}
        {/if}
        <tr
            class="${classname}"
        >
            <td>
                {if (isTestSuite)}
                    <b>${getSuiteName(test.instance)}</b>
                {else/}
                        <div style="float:left;">${getTestName(test)}</div>
                    {if (hasError)}
                        <div class="errorCount"
                        {on click {fn:this._onErrorTestClick,scope:this, args:test}/}
                        {if data.flow.currentState == "finished"}
                            style="cursor:pointer; text-decoration:underline;"
                        {/if}
                        >
                        (${formatTestErrorsCount(test)})
                        </div>
                    {elseif data.flow.currentState == "finished"/}
                        <div class="testInfo">
                            ${formatTestInfo(test)}
                        </div>
                    {/if}
                {/if}
            </td>
        </tr>
        {if !isTestSuite && test.lastInSuite}
        <tr class="suite separator">
            <td>&nbsp;</td>
        </tr>
        {/if}
    {/macro}
{/Template}

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
    $classpath:'aria.tester.runner.view.config.Config',
    $hasScript:true,
    $width : {value:200},
    $height : {min:125},
    $css : ['aria.tester.runner.view.config.ConfigCSS']
}}
    {macro main()}    
        <h1>Select Suites</h1>
        <div {id "left"/} style="
            overflow-y : scroll;
            overflow-x : hidden;
            width : 200px;
            height : ${$vdim(95,1)}px;
        ">
            {call displaySuitesAsTree()/}
        </div>
    {/macro}
    {macro displaySuitesAsTree()}
        {section {
            id: "suitesTree",
              bindRefreshTo : [{
               inside : data.campaign,
               to : "testsTree"
              }],
              type:"div"
          }}
              
            {var test = data.campaign.testsTree[0]/}
            {if (test && test.$TestSuite)}
                <table class="reportTable" style="
                    {if aria.core.Browser.isIE} 
                        width:${$hdim(186,1)}px;
                    {else/}
                        width : 100%;
                    {/if}
                "
                >
                <tbody>
                    {var testWrapper = {classpath:test.$classpath,instance:test}/}
                    <tr 
                    {on mouseup {
                        fn : this.onSuiteClick,
                        scope : this,
                        args : {testSuite : test}
                    }/}
                    title="${this.getSuiteInfo(testWrapper)}">
                    <td style="padding-left:5px">
                        {var suiteName = this.getSuiteName(testWrapper)/}
                        {var isSelected =  test.isSelected()/}
                        {call displaySelect(isSelected)/}
                        <b>${suiteName}</b>
                            {call displaySuite(test, 1)/}
                        </td>
                    </tr>
                </tbody>
                </table>
            {/if}
        {/section}
    {/macro}
    
    {macro displaySuite(testSuite, nesting)} 
        {var tests=testSuite.getSubTests()/}
        {foreach test in tests} 
            {var instance = test.instance/}
            {var suiteName = this.getSuiteName(test)/}
            {var isTestSuite = !!(instance && instance.$TestSuite)/}
            {if (isTestSuite===true)}
                <tr 
                    {on mouseup {
                        fn : this.onSuiteClick,
                        scope : this,
                        args : {testSuite : instance}
                    }/}
                    title="${this.getSuiteInfo(test)}">
                    <td style="padding-left:${5 + (15*nesting)}px">
                        {var isSelected = instance && instance.isSelected()/}
                        {call displaySelect(isSelected)/}
                        <b>${suiteName}</b>
                        {call displaySuite(instance, nesting+1)/}
                    </td>
                </tr>
            {/if}
        {/foreach}
    {/macro}
    
    {macro displaySelect(isSelected)}
        {if isSelected === 1}
            {var classname = "filled"/}
        {elseif isSelected === 0/}
            {var classname = "half"/}
        {else/}
            {var classname = "empty"/}
        {/if}
        <div class="select">
            <div class="innerSelect ${classname}"></div>
        </div>
    {/macro}
{/Template}

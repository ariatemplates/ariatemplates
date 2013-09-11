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
    $classpath:'aria.tester.runner.view.header.Header',
    $hasScript:true,
    $width : {"min":178},
    $height : {value:50},
     $css:['aria.tester.runner.view.header.HeaderCSS']
}}
    {macro main()}
        <div id="header">
            {section {
                id: "startButton",
                macro: "displayStartButton",
                bindRefreshTo : [{
                    inside : data.flow,
                    to : "currentState"
                }]
            }/}
            {section {
                id: "gauge",
                macro: "displayGauge",
                bindRefreshTo : [{
                    inside : data.campaign,
                    to : "progress"
                }]
            }/}
            {section {
                id: "errorCounter",
                macro: "displayErrorCounter",
                bindRefreshTo : [{
                    inside : data.campaign,
                    to : "errorCount"
                },{
                    inside : data.flow,
                    to : "currentState"
                }]
              }/}
        </div>
    {/macro}

    {macro displayStartButton()}
          {var cssclass = "button"/}
          {if this.isButtonDisabled()}
              {set cssclass += " disabled"/}
          {/if}

          <div
            {on click {fn:"_onStartTestsButtonClick", scope: this, args: {}}/}
            id="startTestsButton" class="${cssclass}">
            ${this.getButtonLabel()}
        </div>
    {/macro}

    {macro displayGauge()}
        {var progress = data.campaign.progress/}
        {var containerWidth = $hdim(25)/}

        {var progressText = "Progress : " + progress + "%" /}
        {var filledWidth = (containerWidth/100)*progress/}
        {var emptyWidth = Math.floor(containerWidth - filledWidth)/}
        <div id="testGauge" style="width:${containerWidth}px">
            <span id="gaugeEmpty" style="width:${emptyWidth}px">${progressText}</span>
            <span id="gaugeFilled" style="width:${filledWidth}px">${progressText}</span>
        </div>
    {/macro}

    {macro displayErrorCounter()}
        {var errorCount = data.campaign.errorCount/}
        {var classname = "errorCounterBox"/}
        {if errorCount === 0}
            {set classname += " noError"/}
            {if data.flow.currentState=="finished"}
                {set classname += "Finished"/}
            {elseif data.flow.currentState=="ongoing"/}
                {set classname += "Ongoing"/}
            {/if}
        {else/}
            {set classname += " error"/}
        {/if}
        {if (data.flow.currentState!="finished")}
            {set classname += "Pushed"/}
        {/if}
        <div {on click {fn:"_onErrorCountClick", scope: this, args: {}}/}
        class="${classname}" title="${errorCount} failed test${errorCount!=1?"s":""}">
            ${errorCount}
        </div>
    {/macro}
{/Template}
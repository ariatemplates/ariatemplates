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

{Template {
    $classpath : "test.aria.widgets.container.tooltip.InnerTemplate",
    $hasScript : true
}}

    {macro main()}
        This template <br /> <br />
        contains lot <br /> <br />
        of useless text. <br /> <br />
        I just want <br /> <br />
        to have <br /> <br />
        scrollbars <br /> <br />
        in order <br /> <br />
        to see where <br /> <br />
        my tooltip is  <br /> <br />
        created <br /> <br />
        Indeed this requires  <br /><br />
        quite a lot <br /> <br />
        of useless text. <br /> <br />
        It's even <br /> <br />
        boring to do <br /> <br />
        this! <br /> <br />

        {@aria:Tooltip {
            id : "myTestingTooltip",
            macro : "tooltipContent",
            showDelay : 12
        }/}

        {@aria:Tooltip {
        	id : "wrong",
        	macro : "tooltipContent"
        }}
        	a__b__c__d__e__f__g__h__i
        {/@aria:Tooltip}

        {@aria:Div {
            tooltipId : "myTestingTooltip",
            block : true
        }}
            <span id="mouseOverMe" style="color: red">This stuff here contains a tooltip</span>
        {/@aria:Div}

        I also want <br /> <br />
        to have some <br /> <br />
        text after <br /> <br />
        the tooltip <br /> <br />
        so to check <br /> <br />
        the position <br /> <br />
    {/macro}

    {macro tooltipContent()}
        <span id="testMe">Aria Templates rocks!</span>
    {/macro}
{/Template}

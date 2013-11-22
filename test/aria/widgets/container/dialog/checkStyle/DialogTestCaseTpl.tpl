/*
 * Copyright 2013 Amadeus s.a.s.
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
   $classpath:"test.aria.widgets.container.dialog.checkStyle.DialogTestCaseTpl",
   $css: ["test.aria.widgets.container.dialog.checkStyle.CSS"]
}}
    {macro main()}
        {@aria:Link {
            id: "myLink",
            tooltipId: "myTooltip",
            label: "Move the mouse here to display tooltip!"
        }/}
        {@aria:Tooltip {
            id: "myTooltip",
            macro: "tooltipContent"
        }/}
        <br/>
        <br/>
        <span {id "from"/}></span>
        {@aria:Dialog {
            contentMacro: "dialogContent",
            bind: {
                visible: {
                    to: "dialogVisible",
                    inside: data
                }
            }
        }}
        {/@aria:Dialog}
    {/macro}

    {macro dialogContent()}
        <div {id "dialogDivToCheck"/} class="classDefinedInCSS">
            My test
        </div>
    {/macro}

    {macro tooltipContent()}
        <div {id "tooltipDivToCheck"/} class="classDefinedInCSS">
            My test
        </div>
    {/macro}

{/Template}

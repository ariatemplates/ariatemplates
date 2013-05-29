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
    $classpath:"test.aria.templates.printing.PrintTestCaseTpl"
}}

    {macro main()}
        <div style="width: 800px; height: 800px;">
        <b>The following widgets will be hidden when printing:</b><br/>
        {@aria:TextField {
            printOptions: "hidden",
            block: true,
            label: "text field"
        }/}
        {@aria:CheckBox {
            printOptions: "hidden",
            block: true,
            label: "check box"
        }/}
        {@aria:Button {
            printOptions: "hidden",
            block: true,
            label: "button"
        }/}
        {@aria:Icon {
            icon: "std:close",
            block: true,
            printOptions: "hidden"
        }/}
        {@aria:Calendar {
            block: true,
            printOptions: "hidden"
        }/}
        <br/>
        <b>The following template will adapt its size horizontally:</b><br/>
        {@aria:Template {
                defaultTemplate:'test.aria.templates.printing.SubTemplate',
                width: 500,
                printOptions: "adaptX",
                block: true,
                height: 100
        } /}<br/>
        <b>The following div will adapt its size vertically:</b><br/>
        {@aria:Div {
            sclass: 'dlg',
            block: true,
            width: 500,
            height: 100,
            printOptions: "adaptY"
        }}
            {@aria:Template {
                defaultTemplate:'test.templateTests.tests.printing.SubTemplate'
            } /}
        {/@aria:Div}<br/>
        <b>The following div will adapt its size both horizontally and vertically:</b><br/>
        {@aria:Div {
            sclass: 'list',
            block: true,
            width: 500,
            height: 100,
            printOptions: "adaptXY"
        }}
            {@aria:Template {
                defaultTemplate:'test.templateTests.tests.printing.SubTemplate',
                block: true
            } /}
        {/@aria:Div}
        </div>
    {/macro}

{/Template}
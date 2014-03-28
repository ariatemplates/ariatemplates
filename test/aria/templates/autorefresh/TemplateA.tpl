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
    $classpath: "test.aria.templates.autorefresh.TemplateA",
    $extends : "test.aria.templates.autorefresh.TemplateToExtend"
}}

    {var d = data /}


    {macro main()}
        {section {
            macro : "mainSection",
            bindRefreshTo : [{inside : data.c, to : "b"}]
        } /}
    {/macro}

    {macro mainSection()}
        TEMPLATE A
        <br/>
        Main Section - A.
        <br/>

        {section {
            id : "SectionAA",
            bindRefreshTo : [{inside : data, to : "a"}],
            macro : "displaySectionAA"
        }/}


        {@aria:Template {
            defaultTemplate: "test.aria.templates.autorefresh.TemplateC",
            data : data
        }/}

    {/macro}

    {macro displaySectionAA()}
        Section AA
        {@aria:Template {
            defaultTemplate: "test.aria.templates.autorefresh.TemplateB",
            data : data
        }/}

        {section {
            id : "SectionAAA",
            macro : "displaySectionAAA"
        }/}
    {/macro}

    {macro displaySectionAAA()}
        Section AAA

        {@aria:TextField {
            id: "AAAtextfield",
            width: 40,
            label: "TextFieldAAA",
            bind: {
                value: {
                    to: 'a',
                    inside: data.a
                }
            }
        }/}
    {/macro}

{/Template}

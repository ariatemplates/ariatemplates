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
    $classpath: "test.aria.templates.autorefresh.TemplateB",
    $extends : "test.aria.templates.autorefresh.TemplateToExtend"
}}

    {macro main()}
        TEMPLATE B
        <br/>
        Main Section - B.
        <br/>
        {section {
            id : "SectionBA",
            macro : "displaySectionBA"
        }/}

        {section {
            id : "SectionBB",
            macro : "displaySectionBB"
        }/}
    {/macro}

    {macro displaySectionBB()}
        Section BB
    {/macro}

    {macro displaySectionBA()}
       Section BA
       {@aria:TextField {
          id: "BAtextfield",
          width: 40,
          label: "TextFieldB",
          bind: {
            value: {
              to: 'b',
              inside: data
            }
          }
        }/}
    {/macro}


{/Template}

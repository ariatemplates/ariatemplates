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
    $classpath : "test.aria.templates.section.sectionAttributes.SectionAttributesTpl",
    $hasScript : false
}}

    {macro main()}

        {section {
            id : "section_1",
            type : "div",
            attributes: {
                style: "margin: 20px;padding: 10px;border:1px solid blue;",
                title: "This is my section",
                classList: ["class1", "class2"],
                dataset: {
                    foo1: "Foo 1",
                    foo2: "Foo 2"
                }
            }
        }}<span _myExpando="" {id "mySpan"/}></span>
            New css attributes
        {/section}

    {/macro}

{/Template}

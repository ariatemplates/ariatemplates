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
    $classpath: "test.aria.templates.autorefresh.Template5C"
}}

    {var d = data /}

    {macro main()}
        {section {
            macro : "mainSection",
            bindRefreshTo : [{ inside : data.a, to : "a" }]
        } /}
    {/macro}

    {macro mainSection()}
        <h1>TEMPLATE 3C</h1>
        <p>Main Section - A</p>
        <h1>There is ${data.a.a} times here</h1>

        {section {
            id : "SectionAAA",
            bindRefreshTo : [{inside : data.a, to : "b"}],
            macro : "aaaContent"
        }/}

        {@aria:Template {
            defaultTemplate: "test.aria.templates.autorefresh.Template5B",
            data : data
        }/}

    {/macro}

    {macro aaaContent()}
        /***** Section AAA bound to data.a.b */
        <h1>I am bound to 'data.a.b' who's value is ${data.a.b}</h1>
        Section AAA
    {/macro}


{/Template}

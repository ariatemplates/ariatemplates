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
    $classpath: "test.aria.templates.autorefresh.Multiple"
}}

    {macro main()}
        {@aria:TextField {
            bind : {
                value : {to : "a", inside : data}
            }
        } /}

        <br />
        This section should be updated:
        {section {
            id : "s1",
            bindRefreshTo : [{to : "a", inside: data}],
            macro : "s1Content"
        }/}

        <br />
        This section should <strong>NOT</strong> be updated:
        {section {
            id : "s2",
            bindRefreshTo : [{to : "b", inside: data}],
            macro : "s2Content"
        }/}

        <br />
        This section should <strong>NOT</strong> be updated either:
        {section {
            id : "s3",
            bindRefreshTo : [{to : "b", inside: data, recursive:false}],
            macro : "s3Content"
        }/}
    {/macro}

    {macro s1Content()}
        <input type="text" {id "v1" /} value="${data.a.value}" />
    {/macro}

    {macro s2Content()}
        <input type="text" {id "v2" /} value="${data.a.value}" />
    {/macro}

    {macro s3Content()}
        <input type="text" {id "v3" /} value="${data.a.value}" />
    {/macro}

{/Template}

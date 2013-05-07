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
    $classpath : "test.aria.templates.css.ctxtMgr.Main",
    $hasScript : true
}}

{macro main()}
    {section {
        macro : "mainSection",
        bindRefreshTo : [{inside : data, to : "step"}]
    } /}
{/macro}

{macro mainSection()}
    {call status()/}

    {@aria:Button {
        id : "btnNext",
        label : "Next",
        onclick : "next"
    } /}

    <br />

    {if data.T1}
        {@aria:Template {
            defaultTemplate : "test.aria.templates.css.ctxtMgr.T1"
        } /}
    {/if}

    {if data.T4}
        {@aria:Template {
            defaultTemplate : "test.aria.templates.css.ctxtMgr.T4"
        } /}
    {/if}

    <br />

    {if data.T6}
        {@aria:Template {
            defaultTemplate : "test.aria.templates.css.ctxtMgr.T6"
        } /}
    {/if}
{/macro}


{macro status()}
    <h1>Step ${data.step}</h1>
    <ul>
        {for template in data}
            {if !aria.utils.Json.isMetadata(template) && template.charAt(0) === "T"}
                <li>${template} : ${data[template]}</li>
            {/if}
        {/for}
    </ul>
{/macro}

{/Template}

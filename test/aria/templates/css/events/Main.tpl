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
    $classpath: "test.aria.templates.css.events.Main",
    $hasScript: true
}}

    {macro main()}
        {section {
            macro : "mainSection",
            bindRefreshTo : [{inside : data}]
        } /}
    {/macro}

    {macro mainSection()}

        {if data.template1}
            {@aria:Template {
                defaultTemplate : "test.aria.templates.css.events.Template1"
            }/}
        {/if}

        <br />

        {if data.template2}
            {@aria:Template {
                defaultTemplate : "test.aria.templates.css.events.Template2"
            }/}
        {/if}

        <br />

        {if data.step != null}
            //If I'm using index.html add a button to change the state
            {@aria:Button {
                label : "Next",
                id : "btnClick",
                onclick : {
                    fn : click
                }
            }/}
        {/if}
    {/macro}

{/Template}

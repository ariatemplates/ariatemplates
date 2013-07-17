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
  $classpath:'test.aria.templates.focusAfterRefresh.RefreshTemplate',
  $hasScript: true,
  $css:['test.aria.templates.focusAfterRefresh.RefreshTemplateCSS']
}}

    {macro main()}

        <span style="display:block;">Click the refresh button then click on an element in either Template A or Template B and after a 2 second delay the root template will be refreshed.  The focused element should remain focused after the refresh.</span>

        <br><br>
        <b>Template Hierarchy</b>:
        <ul>
            <li>APIMainTemplate</li>
            <ul>
                <li>Template 1</li>
                <ul>
                    <li>Template 2</li>
                    <ul>
                        <li>Template 3</li>
                        <ul>
                            <li>Template A</li>
                            <li>Template B</li>
                        </ul>
                    </ul>
                </ul>
            </ul>
        </ul>

        {@aria:Template {
                id:"1",
                defaultTemplate:'test.aria.templates.focusAfterRefresh.Template1',
                width:800
        } /}

        <div>
            {@aria:Button {
                    label:"refresh in 2 seconds..",
                    onclick:"refresh",
                    width:200,
                    id:"refreshPage"
            } /}
        </div>

    {/macro}

{/Template}
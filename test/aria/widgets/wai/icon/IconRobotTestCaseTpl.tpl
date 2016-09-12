/*
 * Copyright 2016 Amadeus s.a.s.
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
    $classpath: 'test.aria.widgets.wai.icon.IconTestTpl',
    $hasScript: true,
    $css: ['test.aria.widgets.wai.icon.IconTestTplCSS']
}}
    {macro main()}
        <p>
            With accessibility enabled: <br/>
            {call widget(this.data.iconsIndex.waiEnabled) /}
        </p>

        <p>
            With accessibility disabled: <br/>
            {call widget(this.data.iconsIndex.waiDisabled) /}
        </p>

        <p>
            {section {
                id: 'sectionCalledCounter',
                macro: 'displayCalledCounter',
                bindRefreshTo: [{inside: this.data, to: 'calledCounter'}]
            }/}
        </p>
    {/macro}

    {macro widget(icon)}
        {var id = icon.id /}

        <a tabindex='0' {id 'before_' + id /}>Element before</a>

        {@aria:Icon icon.configuration /}
    {/macro}

    {macro displayCalledCounter()}
        {var counter = this.data.calledCounter /}
        Action called: ${counter} time(s)
    {/macro}
{/Template}

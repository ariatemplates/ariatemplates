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
    $classpath : 'test.aria.widgets.wai.tabs.Tpl',
    $css: ['test.aria.widgets.wai.tabs.TplCSS']
}}

    {macro main()}
        {foreach group inArray this.data.groups}
            <a tabindex='0' {id group.elementBeforeId /}>Element before ${group.id}</a><br/>
            {call displayGroup(group) /}
            <hr/>
        {/foreach}
    {/macro}



    {macro displayGroup(group)}
        {if !group.tabsUnder}
            {call displayTabs(group.tabs) /}
        {/if}

        {@aria:TabPanel group.tabPanel.configuration /}

        {if group.tabsUnder}
            {call displayTabs(group.tabs) /}
        {/if}
    {/macro}

    {macro displayTabPanel(tabPanel)}
        <p>
            WaiAria activated: ${tabPanel.waiAria ? 'true' : 'false'}
        </p>
        <p>
            <input type='text' {id 'inside_' + tabPanel.id /} aria-label="my input"></input>
        </p>
    {/macro}

    {macro displayTabs(tabs)}
        {foreach tab inArray tabs}
            {@aria:Tab tab.configuration}${tab.label}{/@aria:Tab}
        {/foreach}
    {/macro}

{/Template}

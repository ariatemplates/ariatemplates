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
    $classpath : 'test.aria.widgets.wai.tabs.update1.Tpl',
    $css: ['test.aria.widgets.wai.tabs.TplCSS']
}}

    {macro main()}
        {foreach tab inArray this.data.labeledTabs}
            <div id='${tab.labelId}'>${tab.label}</div>
        {/foreach}

        {foreach tab inArray this.data.describedTabs}
            <div id='${tab.descriptionId}'>${tab.description}</div>
        {/foreach}

        <a tabindex='0' {id this.data.elementBefore.id /}>${this.data.elementBefore.textContent}</a><br/>

        {foreach tab inArray this.data.tabs}
            {@aria:Tab tab.configuration}
                ${tab.textContent}
            {/@aria:Tab}
        {/foreach}

        {@aria:TabPanel this.data.tabPanel.configuration /}
    {/macro}

    {macro displayTabPanelContent()}
        <a tabindex='0' {id this.data.elementInside.id /}>${this.data.elementInside.textContent}</a><br/>
    {/macro}

{/Template}

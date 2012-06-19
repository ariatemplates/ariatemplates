/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath:'aria.widgets.errorlist.ErrorListTemplate',
    $hasScript: true
}}

    {macro main()}
        {if data.messages.length > 0}
            {@aria:Div data.divCfg}
                {@aria:Icon {icon: getIcon()}/}
                <span style="padding: 3px 16px 3px 10px; font-weight: bold;">${data.title}</span>
                <div style="padding: 3px 0 0 0;">
                    {call messagesList(data.messages)/}
                </div>
            {/@aria:Div}
        {/if}
    {/macro}
    
    {macro messagesList(messages, indentation)}
        <ul style="margin: 0 0 0 10px; padding-left: 10px;">
            {foreach msg inArray messages}
                <li style="list-style-type: square;">
                {if msg.metaDataRef}
                    {@aria:Link {
                        label: getDisplayMessage(msg),
                        onclick: { fn: clickOnMessage, args: msg }
                    }/}
                {else/}
                    ${getDisplayMessage(msg)}
                {/if}
                {if msg.subMessages}
                    {call messagesList(msg.subMessages)/}
                {/if}
                </li>
            {/foreach}
        </ul>
    {/macro}

{/Template}
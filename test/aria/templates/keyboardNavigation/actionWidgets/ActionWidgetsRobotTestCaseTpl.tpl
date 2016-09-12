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
    $classpath: 'test.aria.templates.keyboardNavigation.actionWidgets.ActionWidgetsRobotTestCaseTpl',
    $hasScript: true
}}
    {macro main()}
        <a tabindex='0' {id 'before_button' /}>First element</a>

        {call playground() /}
        {call debug() /}
    {/macro}

    {macro playground()}
        {@aria:Button {
            id: 'button',
            label: 'Button',

            onclick: {
                scope: this,
                fn: this.onButtonAction
            }
        }/}

        {@aria:Link {
            id: 'link',
            label: 'Link',

            onclick: {
                scope: this,
                fn: this.onLinkAction
            }
        }/}
    {/macro}

    {macro debug()}
        <div>{call counters() /}</div>
        <div>{call logs() /}</div>
    {/macro}

    {macro counters()}
        <ul>
        {foreach id inArray this.data.countersIds}
            <li>{call counter(id) /}</li>
        {/foreach}
        </ul>
    {/macro}

    {macro counter(id)}
        {var counters = this.data.counters /}

        {section {
            id: 'counter_' + id,
            macro: {
                name: 'displayCounter',
                args: [id]
            },
            bindRefreshTo: [{inside: counters, to: id}]
        } /}
    {/macro}

    {macro displayCounter(id)}
        {var counters = this.data.counters /}

        ${id}: ${counters[id]}
    {/macro}

    {macro logs()}
        {var logs = this.data.logs /}

        {repeater {
            id: 'logs',
            content: logs,
            loopType: 'array',
            type: 'ul',

            childSections : {
                id: 'logEntry',
                macro: {
                    name: 'logEntry'
                },

                type: 'li'
            }
        } /}
    {/macro}

    {macro logEntry(args)}
        ${args.item}
    {/macro}
{/Template}

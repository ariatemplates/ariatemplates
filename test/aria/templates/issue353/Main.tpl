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
 $classpath:'test.aria.templates.issue353.Main'
}}
    // Template entry point
    {macro main()}
        {section {
                id: "list",
                bindRefreshTo : [{
                   inside : this.data,
                   to : "items"
                }],
                macro : "listContent"
              }/}

              {section {
                id: "sublist",
                bindRefreshTo : [{
                   inside : this.data,
                   to : "subItems"
                }],
                macro : "subListContent"
              }/}

              {@aria:TextField {
                id: "textField1",
                bind:{value: {inside:this.data.items[0], to:"name"}},
                label : "Value bound to this.data.items[0]",
                block:true
            } /}
              {@aria:TextField {
                id: "textField2",
                bind:{value: {inside:this.data.subItems[0], to:"name"}},
                label : "Value bound to this.data.subItems[0]",
                block:true
            } /}
    <div id="outsideDiv">&nbsp;</div>
    {/macro}

    {macro listContent()}
        <fieldset>
            <legend>Section bound to this.data.items</legend>
            <ul>
            {foreach item in data.items}
                <li>${item.name}</li>
            {/foreach}
            </ul>
        </fieldset>
    {/macro}

    {macro subListContent()}
        <fieldset>
            <legend>Section bound to this.data.subItems</legend>
            <ul>
            {foreach item in data.subItems}
                <li>${item.name}</li>
            {/foreach}
            </ul>
        </fieldset>
    {/macro}

{/Template}

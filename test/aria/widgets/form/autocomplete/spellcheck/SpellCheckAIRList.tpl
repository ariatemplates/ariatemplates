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
    $classpath : "test.aria.widgets.form.autocomplete.spellcheck.SpellCheckAIRList",
    $extends : "aria.widgets.form.list.templates.LCTemplate" } }

    {macro main ()}

        // The Div is used to wrap the items with good looking border.
        {@aria:Div {
                sclass: data.skin.divsclass,
                block: true,
                width: -1,
                height: -1,
                margins: "0 0 0 0"
        }}

                // FIXME: remove me, i'm a hack for minWidth
                <div style="width: 250px; height:1px;"></div>
                {call checkSpellingMistake()/}

                {section {
                    id : "Items",
                    macro : "itemsList"
                }/}
        {/@aria:Div}
    {/macro}

    {macro itemsList()}
        <table
                {if !data.disabled}
                    {on mouseup {fn: "itemClick"} /}
                    {on mouseover {fn: "itemMouseOver"} /}
                {/if}

                cellpadding="0"
                cellspacing="0"
                style="width:100%"
        >
            <tbody {id "suggestionsRows" /} >

                {for var i=0;i<data.items.length;i++}
                    {call renderItem(data.items[i], i)/}
                {/for}

            </tbody>
        </table>
    {/macro}

    {macro checkSpellingMistake()}
        {var firstItem = data.items[0]/}
        {if firstItem != null}
            {if firstItem.object.value['view:spellingSuggestion']}
                // The id testSpellingSuggestion is here for the test to check that the info was passed correctly
                <div id="testSpellingSuggestion" style="border-bottom: 1px solid black; padding: 2px;">Do you mean <span style="font-weight: bold;">${firstItem.label}</span> ?</div>
            {/if}
        {/if}
    {/macro}

{/Template}

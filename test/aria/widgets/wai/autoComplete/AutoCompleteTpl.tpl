/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.autoComplete.AutoCompleteTpl",
    $hasScript : true
}}

    {macro main()}
        <div style="margin:10px;font-size:+3;font-style:bold;">This test needs focus.</div>
        <div style="margin:10px;">
            Using default accessibility value: <br>
            {@aria:AutoComplete {
                id : "city1",
                label : "City 1",
                labelWidth: 100,
                autoFill : false,
                resourcesHandler : this.acHandler
            }/} <br><br>
            <input {id "inputBeforeAutoComplete"/}><br><br>
            With accessibility enabled: <br>
            {@aria:AutoComplete {
                id : "city2",
                waiAria : true,
                waiLabelHidden : true,
                label : "City 2",
                labelWidth: 100,
                autoFill : false,
                resourcesHandler : this.acHandler,
                waiSuggestionsStatusGetter: this.waiSuggestionsStatusGetter,
                waiSuggestionAriaLabelGetter: this.waiSuggestionAriaLabelGetter
            }/} <br><br>
            With accessibility disabled: <br>
            {@aria:AutoComplete {
                id : "city3",
                waiAria : false,
                label : "City 3",
                labelWidth: 100,
                autoFill : false,
                resourcesHandler : this.acHandler
            }/} <br>
        </div>

    {/macro}

{/Template}

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
    $classpath : "test.aria.widgets.wai.autoComplete.preselect.AutoCompleteTpl",
    $hasScript : true
}}

    {macro main()}
        <div style="margin:10px;font-size:+3;font-style:bold;">This test needs focus.</div>
        <div style="margin:10px;">
            {@aria:AutoComplete {
                id : "country",
                waiAria : true,
                waiLabelHidden : true,
                label : "Country",
                labelWidth: 100,
                autoFill : true,
                preselect : "always",
                resourcesHandler : this.acHandler,
                waiSuggestionsStatusGetter: this.waiSuggestionsStatusGetter,
                waiSuggestionAriaLabelGetter: this.waiSuggestionAriaLabelGetter
            }/} <br><br>
        </div>

    {/macro}

{/Template}

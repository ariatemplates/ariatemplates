/*
 * Copyright 2018 Amadeus s.a.s.
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
    $classpath: "test.aria.widgets.wai.input.actionWidget.blurBeforeAction.BlurBeforeActionTpl",
    $hasScript: true
}}

    {macro main()}
        <input {id "tf1"/} aria-label="First field"><br>
        {@aria:TextField {
            waiAria: true,
            label: "Query",
            bind: {
                "value": {
                    to: "query",
                    inside: data
                }
            }
        }/}<br>
        {@aria:Text {
            waiAria: true,
            bind: {
                "text": {
                    to: "query",
                    inside: data
                }
            }
        }/}<br>
        {@aria:Button {
            waiAria: true,
            label: "Search",
            blurBeforeAction: true,
            onclick: {
                fn: buttonClicked,
                scope: this
            }
        }/}<br><br>
        Last search:
        {@aria:Text {
            waiAria: true,
            bind: {
                "text": {
                    to: "lastSearchedQuery",
                    inside: data
                }
            }
        }/}<br>
        <input {id "tf2"/} aria-label="Second field"><br>
    {/macro}

{/Template}

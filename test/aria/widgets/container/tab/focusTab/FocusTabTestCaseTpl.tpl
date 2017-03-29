/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.container.tab.focusTab.FocusTabTestCaseTpl"
}}
    {macro main()}
        <input>
        <br><br>
        {@aria:Tab {
            id: "summaryTab",
            tabId: "summary",
            waiTitleTag: "h2",
            waiAria: true,
            bind: {
                selectedTab: {
                    to: "selectedTab",
                    inside: data
                }
            }
        }}Summary{/@aria:Tab}
        {@aria:Tab {
            id: "detailsTab",
            tabId: "details",
            waiTitleTag: "h2",
            waiAria: true,
            bind: {
                selectedTab: {
                    to: "selectedTab",
                    inside: data
                }
            }
        }}Details{/@aria:Tab}
        {@aria:Tab {
            id: "mapTab",
            tabId: "map",
            tabIndex: 0,
            waiAria: false,
            bind: {
                selectedTab: {
                    to: "selectedTab",
                    inside: data
                }
            }
        }}Map{/@aria:Tab}
        <br><br>
        <input>
    {/macro}

{/Template}

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
    $classpath : 'test.aria.widgets.container.bindableSize.TabpanelTestCaseTpl',
    $extends : 'test.aria.widgets.container.bindableSize.shared.BindableSizeTestTpl'
}}

{macro main()}
    {@aria:Tab {
        tabId: "tab1",
        bind : {
          selectedTab : {
            to : "selectedTabId",
            inside : data
          }
        }
    }}
        {call _tabContent(1) /}
    {/@aria:Tab}
    {@aria:Tab {
        tabId: "tab2",
        bind : {
          selectedTab : {
            to : "selectedTabId",
            inside : data
          }
        }
    }}
        {call _tabContent(2) /}
    {/@aria:Tab}

    <br />

    {call noConstraints() /}
    {call withConstraints() /}
{/macro}

{macro noConstraints()}
    <span style="border:1px solid red; display: inline-block">
    {@aria:TabPanel {
        id : "tpNoConstraints",
        macro: "_tabPanelMacro",
        bind : {
          width : {
            to : "width",
            inside : data
          },
          height : {
            to : "height",
            inside : data
          },
          selectedTab : {
            to : "selectedTabId",
            inside : data
          }
        }
    }/}
    </span>
{/macro}
{macro withConstraints()}
    <span style="border:1px solid red; display: inline-block">
    {@aria:TabPanel {
        id : "tpWithConstraints",
        macro: "_tabPanelMacro",
        maxWidth: 333,
        maxHeight: 333,
        minWidth: 111,
        minHeight: 111,
        bind : {
          width : {
            to : "width",
            inside : data
          },
          height : {
            to : "height",
            inside : data
          },
          selectedTab : {
            to : "selectedTabId",
            inside : data
          }
        }
    }/}
    </span>
{/macro}

{macro _tabPanelMacro()}
    Selected tab: ${data.selectedTabId}
{/macro}

{macro _tabContent(tid)}
    Tab ${tid}
{/macro}

{/Template}

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
   $classpath : "test.aria.widgets.container.checkContent.DivTestTpl"
}}
    {macro main()}
        {@aria:Div {
            id: 'MyDiv',
            maxHeight : 400
        }}
            {for var i = 0; i < 15; i++}
                {if (aria.core.Browser.isOldIE && aria.core.Browser.majorVersion == 7)}
                    <h3 style="width: 871px;">#DivTestWithAVeryLongStringWithoutAnySpaceToCheckIfTheScrollbarsHideSomeContentOrNot</h3>
                {else/}
                    <h3 style="width: 617px;">#DivTestWithAVeryLongStringWithoutAnySpaceToCheckIfTheScrollbarsHideSomeContentOrNot</h3>
                {/if}
            {/for}
        {/@aria:Div}
    {/macro}

{/Template}

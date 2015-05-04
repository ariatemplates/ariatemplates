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
    $classpath : "test.aria.widgets.form.multiselect.popupReposition.MultiSelectTpl",
    $css : ["test.aria.widgets.form.multiselect.popupReposition.MultiSelectStyle"],
    $hasScript : true
}}

    {macro main()}
        <h1>This test needs focus</h1>
        <div class="myOuterContainer">
            <div class="myInnerContainer">
                {@aria:MultiSelect {
                    label : "My Multi-select:",
                    id : "ms1",
                    items : filter.options,
                    instantBind: true,
                    bind : {
                        value : {
                            to : "value",
                            inside : filter
                        }
                    }
                }/}
                {section {
                    bindRefreshTo : [{inside : filter, to : "value"}],
                    macro : "list"
                }/}
            </div>
        </div>
  {/macro}

  {macro list()}
      <table>
          <tbody>
              {foreach item in getFilteredList()}
                  <tr><td>${item.name}</td><td>${item.type}</td></tr>
              {/foreach}
          </tbody>
      </table>
  {/macro}

{/Template}

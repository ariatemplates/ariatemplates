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
    $classpath : "test.aria.widgets.action.sortindicator.block.SortIndicatorBlockTestTpl"
}}

    {createView aview on [
                                [1, "a", true],
                                [2, "c", true],
                                [3, "b", false],
                                [4, "d", true],
                                [5, "e", false]
                         ] /}

    {macro main()}


      <div>
        some text
        {@aria:SortIndicator {
            id: "mySIBlock",
            sortName: 'test',
            label: 'testBlock',
            view: aview,
            block: true,
            labelWidth : 70,
            sortKeyGetter: function(o) { return o.value[0] }
        }/}
        more text
      </div>

      <div>
        some text
        {@aria:SortIndicator {
            id: "mySINoBlock",
            sortName: 'test',
            label: 'testNoBlock',
            view: aview,
            block: false,
            labelWidth : 70,
            sortKeyGetter: function(o) { return o.value[0] }
        }/}
        more text
      </div>
    {/macro}
{/Template}

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
    $classpath : "test.aria.widgets.wai.input.selectBox.SelectBoxSuggestionsJawsTestCaseTpl"
}}
    {macro main()}
        {var data = {
          widgets: {},
          countries: [
            {
              value: "FR",
              label: "France"
            },
            {
              value: "CH",
              label: "Switzerland"
            },
            {
              value: "UK",
              label: "United Kingdom"
            },
            {
              value: "US",
              label: "United States"
            },
            {
              value: "ES",
              label: "Spain"
            },
            {
              value: "PL",
              label: "Poland"
            },
            {
              value: "SE",
              label: "Sweden"
            },
            {
              value: "USA",
              label: "United States of America"
            }
        ]}/}
        <div style="margin:10px;font-size:+3;font-weight:bold;">SelectBox Suggestions sample</div>
        <div style="margin:10px; overflow: auto; height: 600px;">
            With accessibility enabled: <br><br>
            {call selectBox("sbWaiEnabledStart") /}<br>
        </div>
    {/macro}

    {macro selectBox(id)}
      <input type="text" {id id/}>
      {@aria:SelectBox {
          waiAria : true,
          label : "All Countries",
          labelWidth: 220,
          options : data.countries,
          bind : {
            value : {
              to : "country",
              inside : data.widgets
            }
          },
          waiSuggestionsStatusGetter : function (number) {
              if (number === 0) {
                  return "There is no suggestion.";
              } else {
                  return (number == 1 ? "There is one suggestion" : "There are " + number + " suggestions") + ", use up and down arrow keys to navigate and enter to validate.";
              }
          }
      }/} <br><br>
    {/macro}

{/Template}

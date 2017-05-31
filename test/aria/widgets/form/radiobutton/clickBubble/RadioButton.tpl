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
  $classpath:"test.aria.widgets.form.radiobutton.clickBubble.RadioButton",
  $css: ["test.aria.widgets.form.radiobutton.clickBubble.RadioButtonStyle"],
  $hasScript: true
}}
  {macro main()}
    <table class="myTable">
      <tbody>
        <tr>
          <td colspan="2" class="noborder">Choose your option,
            {@aria:Text {
              bind: {
                text: {
                  to: "clicks",
                  inside: data
                }
              }
            } /} detected clicks
          </td>
          <th colspan="2" class="large">Column 1</th>
          <th colspan="2" class="large">Column 2</th>
        </tr>
        <tr>
          <td class="large">Line 1</td>
          <th class="large">Info 1-2</th>
          <td>Value 1</td>
          <td class="center" {on click {fn: 'selectProposal', args: ['1']} /}>
            {@aria:RadioButton {
              id : "rb1",
              keyValue: "v1",
              bind : {
                value : {
                  inside : data,
                  to : "value"
                }
              }
            }/}
          </td>
          <td>Value 2</td>
          <td class="center" {on click {fn: 'selectProposal', args: ['2']} /}>
            {@aria:RadioButton {
              id : "rb2",
              keyValue: "v2",
              bind : {
                value : {
                  inside : data,
                  to : "value"
                }
              }
            }/}
          </td>
        </tr>
        <tr>
          <td class="large">Line 2</td>
          <th class="large">Info 3-4</t>
          <td>Value 3</td>
          <td class="center" {on click {fn: 'selectProposal', args: ['3']} /}>
            {@aria:RadioButton {
              id : "rb3",
              keyValue: "v3",
              bind : {
                value : {
                  inside : data,
                  to : "value"
                }
              }
            }/}
          </td>
          <td>Value 4</td>
          <td class="center" {on click {fn: 'selectProposal', args: ['4']} /}>
            {@aria:RadioButton {
              id : "rb4",
              keyValue: "v4",
              bind : {
                value : {
                  inside : data,
                  to : "value"
                }
              }
            }/}
          </td>
        </tr>
      </tbody>
    </table>

  {/macro}
{/Template}

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
    $classpath: "test.aria.widgets.autoselect.tab.NoAutoSelectTabRobotTestCaseTpl",
    $hasScript: true,
    $width: {min: 500}
}}

    {macro main()}
    <div>
        {@aria:TextField {
          id : "start",
          label : "First textfield",
          labelWidth:100,
          width:400
        } /}
    </div>
    <div class="sampleDiv" >
      <table><tbody>
      <tr>
        <td>
        {@aria:TextField {
          id : "txtf0",
          label : "TextField ",
          labelWidth:75,
          width:200,
          value: "Selected?",
          autoselect: true
        } /}
        </td>
        <td>
        {@aria:TextField {
          id : "txtf1",
          helptext : "Hi",
          width:200,
          value: "Selected?",
          autoselect: false
        } /}
        </td>
      </tr>
    </tbody></table>
    </div>
    <div class="sampleDiv" >
      <table><tbody>  <tr>
        <td>
        {@aria:NumberField {
          id: "nf0",
          label: "NumberField",
          labelWidth:75,
          width:200,
          value: 55378008,
          autoselect: true
        }/}
        </td>
        <td>
        {@aria:NumberField {
          id: "nf1",
          width:200,
          value: 55378008,
          autoselect: false
        }/}
        </td>
      </tr>
    </tbody></table>
    </div>
    <div class="sampleDiv" >
      <table><tbody>  <tr>
        <td>
        {@aria:TimeField {
          id: "tf0",
          label: "TimeField",
          labelWidth:75,
          width:200,
          pattern:aria.utils.environment.Date.getTimeFormats().shortFormat,
          value: new Date(),
          autoselect: true
        }/}
        </td>
        <td>
        {@aria:TimeField {
          id: "tf1",
          width:200,
          pattern:aria.utils.environment.Date.getTimeFormats().shortFormat,
          value: new Date(),
          autoselect: false
        }/}
        </td>
      </tr>
    </tbody></table>
    </div>
    <div class="sampleDiv" >
      <table><tbody>  <tr>
        <td>
        {@aria:DateField {
          id: "df0",
          label: "DateField",
          labelWidth:75,
          width:200,
          value: new Date (),
          autoselect: true
        }/}
        </td>
        <td>
        {@aria:DateField {
          id: "df1",
          width:200,
          value: new Date (),
          autoselect: false
        }/}
        </td>
      </tr>
    </tbody></table>
    </div>
    <div class="sampleDiv" >
      <table><tbody>  <tr>
        <td>
        {@aria:DatePicker {
          id: "dp0",
          label: "DatePicker",
          labelWidth:75,
          width:200,
          value: new Date(),
          autoselect: true
        }/}
        </td>
        <td>
        {@aria:DatePicker {
          id: "dp1",
          width:200,
          value: new Date(),
          autoselect: false
        }/}
        </td>
      </tr>
    </tbody></table>
    </div>
    <div class="sampleDiv" >
      <table><tbody>  <tr>
        <td>
        {@aria:MultiSelect {
          id: "ms0",
          label: "MultiSelect",
          labelWidth: 75,
          width: 200,
          items:[{
            value:'SelectionOne',
            label:'SelectionOne'
          }, {
            value:'SelectionTwo',
            label:'SelectionTwo'
          }],
          value: ['SelectionOne'],
          autoselect: true
        }/}
        </td>
        <td>
        {@aria:MultiSelect {
          id: "ms1",
          width:200,
          items:[{
            value:'SelectionOne',
            label:'SelectionOne'
          }, {
            value:'SelectionTwo',
            label:'SelectionTwo'
          }],
          value: ['SelectionOne'],
          autoselect: false
        }/}
        </td>
      </tr>
    </tbody></table>
    </div>
    <div class="sampleDiv" >
      <table><tbody>  <tr>
        <td>
        {@aria:AutoComplete {
          id: "ac0",
          label: "AutoComplete",
          labelWidth:75,
          width:200,
          resourcesHandler : getHandler(),
          value: "Selected?",
          autoselect: true
        }/}
        </td>
        <td>
        {@aria:AutoComplete {
          id: "ac1",
          width:200,
          resourcesHandler : getHandler(),
          value: "Selected?",
          autoselect: false
        }/}
        </td>
      </tr>
    </tbody></table>
    </div>
    {/macro}

{/Template}

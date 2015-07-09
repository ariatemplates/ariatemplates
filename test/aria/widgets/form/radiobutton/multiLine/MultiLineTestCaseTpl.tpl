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
    $classpath:"test.aria.widgets.form.radiobutton.multiLine.MultiLineTestCaseTpl"
}}
  {macro main()}
      <div {id "container"/} style="padding:20px;width:290px">
        {@aria:RadioButton {
          id : "rbTop",
          labelWidth: 250,
          keyValue: "vTop",
          verticalAlign:"top",
          label: "This is a very long option, which should probably go to the next line, but with the icon at the top! This is a very long option, which should probably go to the next line, but with the icon at the top!",
          bind : {
            value : {
              inside : data,
              to : "value"
            }
          }
        }/}<br><br>
        {@aria:RadioButton {
          id : "rbBottom",
          labelWidth: 250,
          keyValue: "vBottom",
          verticalAlign:"bottom",
          label: "This is a very long option, which should probably go to the next line, but with the icon at the bottom! This is a very long option, which should probably go to the next line, but with the icon at the bottom!",
          bind : {
            value : {
              inside : data,
              to : "value"
            }
          }
        }/}<br><br>
        {@aria:RadioButton {
          id : "rbMiddle",
          labelWidth: 250,
          keyValue: "vMiddle",
          verticalAlign:"middle",
          label: "This is a very long option, which should probably go to the next line, but with the icon at the middle! This is a very long option, which should probably go to the next line, but with the icon at the middle!",
          bind : {
            value : {
              inside : data,
              to : "value"
            }
          }
        }/}<br><br>
        {@aria:RadioButton {
          id : "rbDefault",
          labelWidth: 250,
          keyValue: "vDefault",
          label: "This is a very long option, which should probably go to the next line, but with the icon at the default position! This is a very long option, which should probably go to the next line, but with the icon at the default position!",
          bind : {
            value : {
              inside : data,
              to : "value"
            }
          }
        }/}<br><br>
      </div>
  {/macro}
{/Template}

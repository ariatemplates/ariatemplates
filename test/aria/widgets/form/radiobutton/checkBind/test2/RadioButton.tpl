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
    $classpath:"test.aria.widgets.form.radiobutton.checkBind.test2.RadioButton"
}}
  {macro main()}

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

    {@aria:RadioButton {
      id : "rb3",
      keyValue: "v3",
      bind : {
        value : {
          inside : data,
          to : "otherValue"
        }
      }
    }/}

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


  {/macro}
{/Template}
